import json
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output, Logic


def _truth_table_satisfies(truth_table, output_idx, code):
    for row in truth_table:
        idx = int(''.join(str(int(x)) for x in row['inputs']), 2)
        if row['outputs'][output_idx] != (code[idx] == 'T'):
            return False
    return True


def _get_circuit_schemes(inputs, outputs, truth_table):
    candidates = Logic.query.filter_by(n_inputs=len(inputs)).all()
    logics = []

    for i, out in enumerate(outputs):
        _logic = []

        if len(inputs) == 1 and _truth_table_satisfies(truth_table, i, 'TF'):
            pass  # TODO: Simple circuit

        for l in candidates:
            if _truth_table_satisfies(truth_table, i, l.truth_table):
                logic = l.to_dict(True)
                logic['outputparts'][0].append(out)
                _logic.append(logic)

        logics.append(_logic)

    return logics


@app.route('/circuit/schemes', methods=['POST'])
def get_circuit_schemes():
    desc = json.loads(request.data)

    inputs = []
    for i in desc['inputs']:
        _ = []
        _.append(Input.query.get_or_404(i['id']).to_dict(True))
        _.append(Receptor.query.get_or_404(i['receptor_id']).to_dict(True))
        for p_id in i['promoter_ids']:
            _.append(Promoter.query.get_or_404(p_id).to_dict(True))
        inputs.append(_)

    outputs = []
    for o in desc['outputs']:
        outputs.append(Output.query.get_or_404(o).to_dict(True))

    return jsonify(inputs=inputs,
                   logics=_get_circuit_schemes(inputs, outputs,
                                               desc['truth_table']))
