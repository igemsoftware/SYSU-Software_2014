import json
from flask import request, jsonify
from .. import app
from ..models import Input, Receptor, Promoter, Output
from ..algorithms import circuit_schemes


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
                   schemes=circuit_schemes.make_schemes(inputs, outputs,
                                                        desc['truth_table']))
