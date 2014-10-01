import json
import uuid
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output, Logic, Terminator, RBS


def _truth_table_satisfies(truth_table, output_idx, code):
    for row in truth_table:
        idx = int(''.join(str(int(x)) for x in row['inputs']), 2)
        if row['outputs'][output_idx] != (code[idx] == 'T'):
            return False
    return True


def _simple_circuit(promoter, output):
    return dict(id=None, type='logic', eid=uuid.uuid4().get_hex(),
                truth_table='FT', intermedia=[], inputparts=[[promoter]],
                outputparts=[[RBS.query.first().to_dict(True),
                              output, Terminator.query.first().to_dict(True)]])


def _get_circuit_schemes(inputs, promoters, outputs, truth_table):
    candidates = Logic.query.filter_by(n_inputs=len(inputs)).all()
    logics = []

    terminator = Terminator.query.first()
    for i, out in enumerate(outputs):
        _logic = []

        if len(inputs) == 1 and _truth_table_satisfies(truth_table, i, 'FT'):
            _logic.append(_simple_circuit(promoters[0], out))

        for l in candidates:
            if _truth_table_satisfies(truth_table, i, l.truth_table):
                logic = l.to_dict(True)
                for p_idx, p in enumerate(promoters):
                    logic['inputparts'][p_idx].insert(0, p)
                logic['outputparts'][0].append(out)
                logic['outputparts'][0].append(terminator.to_dict(True))
                _logic.append(logic)

        logics.append(_logic)

    return logics


@app.route('/circuit/schemes', methods=['POST'])
def get_circuit_schemes():
    desc = json.loads(request.data)

    inputs = []
    promoters = []
    for i in desc['inputs']:
        _input = []
        _input.append(Input.query.get_or_404(i['id']).to_dict(True))
        _input.append(Receptor.query.get_or_404(i['receptor_id'])
                      .to_dict(True))
        inputs.append(_input)
        promoters.append(Promoter.query.get_or_404(i['promoter_id'])
                         .to_dict(True))

    outputs = []
    for o in desc['outputs']:
        outputs.append(Output.query.get_or_404(o).to_dict(True))

    logics = _get_circuit_schemes(inputs, promoters, outputs,
                                  desc['truth_table'])

    return jsonify(inputs=inputs, logics=logics)
