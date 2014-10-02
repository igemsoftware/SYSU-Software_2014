import json
from flask import request, jsonify
from .. import app
from ..models import _Suggestions, Input, Output, Logic, RBS, Promoter
from ..simulation import simulator


@app.route('/simulation/preprocess', methods=['POST'])
def simulation_preprocess():
    circuits = json.loads(request.data)
    output_RBS = {}
    relationships = []

    for circuit in circuits:
        input_rel = []
        for x in circuit['inputs']:
            I = Input.query.get(x['id'])
            r = _Suggestions.query.get(
                (x['id'], x['promoter_id'], x['receptor_id']))
            promoter = Promoter.query.get(x['promoter_id'])
            input_rel.append({'from': I.input_name,
                              'type': r.relationship,
                              'gamma': promoter.gamma,
                              'K': promoter.K,
                              'n': promoter.n})

        for logic_id, output_id in zip(circuit['logics'],
                                       circuit['outputs']):
            L = Logic.query.get(logic_id).to_dict()
            output_name = Output.query.get(output_id).output_name

            for i, _input in enumerate(L['inputparts']):
                for x in _input:
                    if x['type'] == 'RBS':
                        RBS_name = x['name']
                        break

                for x in _input:
                    if x['type'] == 'output':
                        rel = input_rel[i].copy()
                        rel['to'] = x['name']
                        relationships.append(rel)
                        output_RBS[x['name']] = RBS_name

            # TODO: Handle repressilators
            for rel in L['relationships']:
                # A rel in a logic should contain its RBS on demand
                RBS_name = rel.pop('RBS', None)
                if 'to' not in rel:
                    rel['to'] = output_name
                relationships.append(rel)
                if RBS_name is not None:
                    output_RBS[rel['to']] = RBS_name

    reactants = set()
    for rel in relationships:
        reactants.add(rel['to'])

    return jsonify(reactants=list(reactants), output_RBS=output_RBS,
                   relationships=relationships)


@app.route('/simulation/simulate', methods=['POST'])
def simulate():
    simulation = json.loads(request.data)

    reactant_ids = {r: i for i, r in enumerate(simulation['reactants'])}

    alphas = {}
    for rbs in simulation['RBSs']:
        alphas[rbs['output']] = RBS.query.filter_by(RBS_name=rbs['RBS']).\
            one().alpha

    s = simulator.Simulator(len(simulation['reactants']))
    for r in simulation['relationships']:
        if r['type'] in ('PROMOTE', 'REPRESS'):
            s.relationship(r['type'],
                           reactant_ids[r['from']], reactant_ids[r['to']],
                           [alphas[r['to']], 0.01, r['gamma'], r['K'], r['n']])
        elif r['type'] == 'SIMPLE':
            s.relationship('SIMPLE',
                           reactant_ids[r['from']], reactant_ids[r['to']], [])

    x0 = []
    for r in simulation['reactants']:
        x0.append(simulation['x0'].get(r, 0.0))

    result = s.simulate(x0, simulation['t'])
    return json.dumps(result)
