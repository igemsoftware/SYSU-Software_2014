import json
from flask import request, jsonify
from .. import app
from ..models import _Suggestions, Input, Output, Logic, RBS
from ..simulation import simulator


@app.route('/simulation/preprocess', methods=['POST'])
def simulation_preprocess():
    circuits = json.loads(request.data)
    RBSs = []
    relationships = []
    rbs = RBS.query.first()

    for circuit in circuits:
        input_rel = []
        for x in circuit['inputs']:
            I = Input.query.get(x['id'])
            r = _Suggestions.query.get(
                (x['id'], x['promoter_id'], x['receptor_id']))
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


@app.route('/simulation/simulate', methods=['POST'])
def simulate():
    simulation = json.loads(request.data)

    reactant_ids = {r: i for i, r in enumerate(simulation['reactants'])}

    alphas = {}
    for rbs in simulation['RBSs']:
        alphas[rbs['output']] = RBS.query.filter_by(RBS_name=rbs['RBS']).alpha

    s = simulator.Simulator(len(simulation['reactants']))
    for r in simulation['relationships']:
        if r['type'] in ('PROMOTE', 'REPRESS'):
            s.relationship(r['type'],
                           reactant_ids[r['from']], reactant_ids[r['to']],
                           alphas[r['to']], 0.01,  # BETA
                           r['gamma'], r['K'], r['n'])

    x0 = []
    for r in simulation['reactants']:
        x0.append(simulation['x0'].get(r, 0.0))

    result = s.simulate(x0, simulation['t'])
    return json.dumps(result)
