import json
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output, Logic, Terminator,\
    _Suggestions
from . import _details


def _truth_table_satisfies(truth_table, output_idx, code):
    if len(code) == 0:
        return False
    for row in truth_table:
        idx = int(''.join(str(int(x)) for x in row['inputs']), 2)
        if row['outputs'][output_idx] != (code[idx] == 'T'):
            return False
    return True


def _get_circuit_schemes(inputs, promoters, outputs, truth_table):
    candidates = Logic.query.filter_by(n_inputs=len(inputs)).all()
    logics = []

    terminator = Terminator.query.first()
    for i, out in enumerate(outputs):
        _logic = []

        for l in candidates:
            if _truth_table_satisfies(truth_table, i, l.truth_table):
                logic = l.to_dict(True)
                if logic['logic_type'] == 'simple':
                    _logic.append(_details.simple(
                        promoters[0], out, logic, terminator))
                else:
                    _logic.append(_details.other(
                        promoters, out, logic, terminator))

        logics.append(_logic)

    return logics


@app.route('/circuit/schemes', methods=['POST'])
def get_circuit_schemes():
    desc = json.loads(request.data)

    inputs = []
    promoters = []
    for i in desc['inputs']:
        relationship = _Suggestions.query.get_or_404(
            (i['id'], i['promoter_id'], i['receptor_id'])).relationship
        _input_obj = Input.query.get_or_404(i['id']).to_dict(True)
        _input_obj['relationship'] = relationship

        _input = [_input_obj]
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


@app.route('/circuit/details', methods=['POST'])
def circuit_details():
    circuit = json.loads(request.data)

    inputs = []
    promoters = []
    receptors = []
    for i in circuit['inputs']:
        relationship = _Suggestions.query.get_or_404(
            (i['id'], i['promoter_id'], i['receptor_id'])).relationship
        _input_obj = Input.query.get_or_404(i['id']).to_dict(True)
        _input_obj['relationship'] = relationship

        receptor = Receptor.query.get_or_404(i['receptor_id']).to_dict(True)
        receptors.append(receptor)
        inputs.append([_input_obj, receptor])

        promoters.append(Promoter.query.get_or_404(i['promoter_id'])
                         .to_dict(True))

    outputs = []
    for o in circuit['outputs']:
        outputs.append(Output.query.get_or_404(o).to_dict(True))

    T_obj = Terminator.query.first()
    logics = []
    for i, logic_id in enumerate(circuit['logics']):
        logic = Logic.query.get_or_404(logic_id).to_dict()
        if logic['logic_type'] == 'repressilator':
            logics.append(logic)  # repressilator doesn't need extra processing
        elif logic['logic_type'] == 'toggle_switch_1':
            logics.append(_details.toggle_switch_1(
                receptors, promoters, outputs[i], logic, T_obj))
        elif logic['logic_type'] == 'toggle_switch_2':
            logics.append(_details.toggle_switch_2(
                promoters[0], outputs, logic, T_obj))
        elif logic['logic_type'] == 'simple':
            logics.append(_details.simple(
                promoters[0], outputs[i], logic, T_obj))
        else:
            logics.append(_details.other(promoters, outputs[i], logic, T_obj))

    return jsonify(inputs=inputs, logics=logics)
