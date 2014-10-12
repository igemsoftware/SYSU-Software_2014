import json
import itertools
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output, Logic, Terminator,\
    _Suggestions
from . import _details


def _get_dna(logics):
    seq = []
    seq_cache = {}
    biobrick_scar = ('', 'biobrick_scar', 'tactagag')
    poly_A = ('', 'poly_A', 'a' * 100)
    for logic in logics:
        for line in itertools.chain(logic['inputparts'], logic['outputparts']):
            for x in line:
                _seq = x.pop('sequence', None)
                if _seq is not None:
                    seq_cache[x['name']] = _seq
                else:
                    _seq = seq_cache[x['name']]
                seq.extend([(x['name'], x['type'], _seq), biobrick_scar])
            seq.append(poly_A)
    return seq


def _truth_table_satisfies(truth_table, output_idx, code):
    if len(code) == 0:
        return False
    for row in truth_table:
        idx = int(''.join(str(int(x)) for x in row['inputs']), 2)
        if row['outputs'][output_idx] != (code[idx] == 'T'):
            return False
    return True


def _preprocess_truth_table(relationships, truth_table):
    be_inverted = [r == 'REPRESS' for r in relationships]
    for row in truth_table:
        for i in range(len(be_inverted)):
            if be_inverted[i]:
                row['inputs'][i] = not row['inputs'][i]


def _get_circuit_schemes(inputs, promoters, outputs, truth_table):
    candidates = Logic.query.filter_by(n_inputs=len(inputs)).all()
    logics = []

    terminator = Terminator.query.first().to_dict(True)
    for i, out in enumerate(outputs):
        _logic = []

        for l in candidates:
            if _truth_table_satisfies(truth_table, i, l.truth_table):
                logic = l.to_dict()
                if logic['logic_type'] == 'simple':
                    _logic.append(_details.simple(
                        promoters[0], out, logic, terminator))
                elif logic['logic_type'] == 'or_gate':
                    _logic.append(_details.or_gate(
                        promoters, out, logic, terminator))
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
    relationships = []
    for i in desc['inputs']:
        relationship = _Suggestions.query.get_or_404(
            (i['id'], i['promoter_id'], i['receptor_id'])).relationship
        _input_obj = Input.query.get_or_404(i['id']).to_dict()
        _input_obj['relationship'] = relationship
        relationships.append(relationship)

        _input = [_input_obj]
        _input.append(Receptor.query.get_or_404(i['receptor_id'])
                      .to_dict())
        inputs.append(_input)
        promoters.append(Promoter.query.get_or_404(i['promoter_id'])
                         .to_dict(True))

    outputs = []
    for o in desc['outputs']:
        outputs.append(Output.query.get_or_404(o).to_dict(True))

    _preprocess_truth_table(relationships, desc['truth_table'])
    logics = _get_circuit_schemes(inputs, promoters, outputs,
                                  desc['truth_table'])

    _get_dna(itertools.chain(*logics))
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
        _input_obj = Input.query.get_or_404(i['id']).to_dict()
        _input_obj['relationship'] = relationship

        receptor = Receptor.query.get_or_404(i['receptor_id']).to_dict()
        receptors.append(receptor)
        inputs.append([_input_obj, receptor])

        promoters.append(Promoter.query.get_or_404(i['promoter_id'])
                         .to_dict(True))

    outputs = []
    for o in circuit['outputs']:
        outputs.append(Output.query.get_or_404(o).to_dict(True))

    terminator = Terminator.query.first().to_dict(True)
    logics = []
    for i, logic_id in enumerate(circuit['logics']):
        logic = Logic.query.get_or_404(logic_id).to_dict()
        if logic['logic_type'] == 'repressilator':
            logics.append(logic)  # repressilator doesn't need extra processing
        elif logic['logic_type'] == 'toggle_switch_1':
            logics.append(_details.toggle_switch_1(
                receptors, promoters, outputs[i], logic, terminator))
        elif logic['logic_type'] == 'toggle_switch_2':
            logics.append(_details.toggle_switch_2(
                promoters[0], outputs, logic, terminator))
        elif logic['logic_type'] == 'simple':
            logics.append(_details.simple(
                promoters[0], outputs[i], logic, terminator))
        elif logic['logic_type'] == 'or_gate':
            logics.append(_details.or_gate(promoters, outputs[i], logic,
                                           terminator))
        else:
            logics.append(_details.other(promoters, outputs[i], logic,
                                         terminator))

    dna = _get_dna(logics)
    return jsonify(inputs=inputs, logics=logics, dna=dna)
