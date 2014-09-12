import json
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output, Logic


def _truth_table_satisfies(truth_table, n_outputs, code):
    for row in truth_table:
        idx = int(''.join(str(int(x)) for x in row['inputs']), 2)
        idx *= n_outputs
        if ''.join('T' if x else 'F' for x in row['outputs']) != \
                code[idx:idx + n_outputs]:
            return False


def _get_circuit_schemes(n_inputs, n_outputs, truth_table):
    logic = []

    for l in Logic.query.filter_by(n_inputs=n_inputs, n_outputs=n_outputs):
        if _truth_table_satisfies(truth_table, n_outputs, l.truth_table):
            logic.append(l.to_dict(True))

    if n_outputs == 1:
        if n_inputs == 0:
            logic.append(None)
        elif n_inputs == 1 and _truth_table_satisfies(truth_table, 1, 'FT'):
            logic.append(None)

    return logic


@app.route('/circuit/schemes', methods=['POST'])
def get_circuit_schemes():
    desc = json.loads(request.data)
    inputs = []
    for i in desc['inputs']:
        inputs.append(Input.query.get_or_404(i['id']).to_dict(True))
        inputs[-1]['receptor'] = Receptor.query.\
            get_or_404(i['receptor_id']).to_dict(True)
        inputs[-1]['promoters'] = [Promoter.query.get_or_404(p).to_dict(True)
                                   for p in i['promoter_ids']]
    outputs = [Output.query.get_or_404(o).to_dict(True)
               for o in desc['outputs']]

    return jsonify(inputs=inputs, outputs=outputs,
                   logic=_get_circuit_schemes(len(inputs), len(outputs),
                                              desc['truth_table']))
