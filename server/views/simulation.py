import json
from flask import request, jsonify
from .. import app
from ..models import _Suggestions, Input, Output, Logic, RBS


@app.route('/simulation/preprocess', methods=['POST'])
def simulation_preprocess():
    circuits = json.loads(request.data)
    RBSs = []
    relationships = []
    rbs = RBS.query.first()

    for circuit in circuits:
        input_rel = []
        for x in circuit['inputs']:
            I = Input.query.get(x['input_id'])
            r = _Suggestions.query.get(
                (x['input_id'], x['promoter_id'], x['receptor_id']))
            input_rel.append({'from': I.input_name,
                              'type': r.relationship})

        for logic_id, output_id in zip(circuit['logics'],
                                       circuit['outputs']):
            L = Logic.query.get(logic_id).to_dict()
            output_name = Output.query.get(output_id).output_name

            for i, _input in enumerate(L['inputparts']):
                for x in _input:
                    if x['type'] == 'output':
                        rel = input_rel[i].copy()
                        rel['to'] = x['name']
                        # TODO: Get parameters
                        rel['gamma'] = 1.0
                        rel['K'] = 1.0
                        rel['n'] = 2.0
                        relationships.append(rel)
                        RBSs.append({'RBS': rbs.RBS_name, 'output': x['name']})

            # TODO: Handle repressilators
            # TODO: Handle toggle switches
            for rel in L['relationships']:
                # A rel in a logic should contain its RBS
                rbs_name = rel.pop('RBS')
                if 'to' not in rel:
                    rel['to'] = output_name
                relationships.append(rel)
                RBSs.append({'RBS': rbs_name, 'output': rel['to']})

    reactants = set()
    for rel in relationships:
        reactants.add(rel['to'])

    return jsonify(reactants=list(reactants), RBSs=RBSs,
                   relationships=relationships)
