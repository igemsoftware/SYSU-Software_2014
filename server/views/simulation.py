import json
from flask import request, jsonify
from .. import app
from ..models import _Suggestions, Input, Output, Logic, RBS, Promoter,\
    Receptor
from ..simulation import simulator, preprocess


@app.route('/simulation/preprocess', methods=['POST'])
def simulation_preprocess():
    circuits = json.loads(request.data)
    output_RBS = {}
    relationships = []
    reactants = set()
    receptor_names = []

    for circuit in circuits:
        input_rels = []
        for x in circuit['inputs']:
            I = Input.query.get(x['id'])
            r = _Suggestions.query.get(
                (x['id'], x['promoter_id'], x['receptor_id']))
            promoter = Promoter.query.get(x['promoter_id'])
            input_rels.append({'from': I.input_name,
                               'type': r.relationship,
                               'gamma': promoter.gamma,
                               'K': promoter.K,
                               'n': promoter.n})
            receptor_names.append(
                Receptor.query.get(x['receptor_id']).receptor_name)

        if circuit['logics'][0]['type'] == 'repressilator':
            repressilator = circuit['logics'][0]
            reactants.union(preprocess.repressilator(
                input_rels, repressilator, relationships, output_RBS))
        else:
            for logic_id, output_id in zip(circuit['logics'],
                                           circuit['outputs']):
                logic = Logic.query.get(logic_id).to_dict()
                output_name = Output.query.get(output_id).output_name

                if logic['type'] == 'and_gate':
                    reactants.union(preprocess.and_gate(
                        input_rels, output_name, logic,
                        relationships, output_RBS))
                elif logic['type'] == 'toggle_switch_1':
                    reactants.union(preprocess.toggle_switch(
                        input_rels, receptor_names, output_name, logic,
                        relationships, output_RBS))

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
