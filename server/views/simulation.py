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
    inputs = set()
    outputs = set()
    reactants = set()
    receptor_names = []

    for circuit in circuits:
        input_rels = []
        for x in circuit['inputs']:
            I = Input.query.get(x['id'])
            r = _Suggestions.query.get(
                (x['id'], x['promoter_id'], x['receptor_id']))
            promoter = Promoter.query.get(x['promoter_id'])
            inputs.add(I.name)
            input_rels.append({'from': I.name,
                               'type': r.relationship,
                               'gamma': promoter.gamma,
                               'K': promoter.K,
                               'n': promoter.n})
            receptor_names.append(
                Receptor.query.get(x['receptor_id']).name)

        logics = [Logic.query.get(lid).to_dict() for lid in circuit['logics']]

        if logics[0]['logic_type'] == 'repressilator':
            reactants.update(preprocess.repressilator(
                input_rels, logics[0], relationships, output_RBS, outputs))

        elif logics[0]['logic_type'] == 'toggle_switch_2':
            output_names = [Output.query.get(i).name
                            for i in circuit['outputs']]
            outputs.update(output_names)
            reactants.update(preprocess.toggle_switch_2(
                input_rels, output_names, logics[0], relationships,
                output_RBS))

        else:
            for logic, output_id in zip(logics, circuit['outputs']):
                output_name = Output.query.get(output_id).name
                outputs.add(output_name)

                if logic['logic_type'] == 'and_gate':
                    reactants.update(preprocess.and_gate(
                        input_rels, output_name, logic,
                        relationships, output_RBS))
                elif logic['logic_type'] == 'toggle_switch_1':
                    reactants.update(preprocess.toggle_switch_1(
                        input_rels, receptor_names, output_name, logic,
                        relationships, output_RBS))
                elif logic['logic_type'] == 'inverter':
                    reactants.update(preprocess.inverter(
                        input_rels, output_name, logic,
                        relationships, output_RBS))
                elif logic['logic_type'] == 'simple':
                    reactants.update(preprocess.simple(
                        input_rels, output_name, logic,
                        relationships, output_RBS))
                elif logic['logic_type'] == 'or_gate':
                    reactants.update(preprocess.or_gate(
                        input_rels, output_name, logic,
                        relationships, output_RBS))

    return jsonify(reactants=list(reactants), output_RBS=output_RBS,
                   relationships=relationships,
                   inputs=list(inputs), outputs=list(outputs))


def _get_simulator(simulation):
    reactant_ids = {r: i for i, r in enumerate(simulation['reactants'])}

    alphas = {o: RBS.query.filter_by(name=r).one().alpha
              for o, r in simulation['output_RBS'].iteritems()}

    s = simulator.Simulator(len(simulation['reactants']))
    for r in simulation['relationships']:
        if r['type'] in ('PROMOTE', 'BIREPRESS', 'REPRESS'):
            s.relationship(r['type'],
                           reactant_ids[r['from']], reactant_ids[r['to']],
                           [alphas[r['to']], 8.3e-2, 0, r['K'], r['n']])
        elif r['type'] == 'BIPROMOTE':
            s.relationship('BIPROMOTE',
                           reactant_ids[r['from_1']],
                           reactant_ids[r['from_2']],
                           reactant_ids[r['to']],
                           [alphas[r['to']], 8.3e-2, 0, r['K'], r['n']])
        elif r['type'] == 'SIMPLE':
            s.relationship('SIMPLE',
                           reactant_ids[r['from']], reactant_ids[r['to']], [])

    return s, reactant_ids


@app.route('/simulation/simulate/dynamic', methods=['POST'])
def simulate_dynamic():
    simulation = json.loads(request.data)
    s, reactant_ids = _get_simulator(simulation)
    output_ids = [reactant_ids[o] for o in simulation['outputs']]

    x0 = []
    for r in simulation['reactants']:
        x0.append(simulation['x0'].get(r, 0.0))

    result = s.simulate(x0, simulation['t'])
    t, c = [list(l) for l in zip(*result)]
    c = [list(l) for l in zip(*c)]
    dynamic = dict(t=t, c=dict(zip(simulation['outputs'],
                                   [c[i] for i in output_ids])))

    return jsonify(**dynamic)


@app.route('/simulation/simulate/static', methods=['POST'])
def simulate_static():
    simulation = json.loads(request.data)
    s, reactant_ids = _get_simulator(simulation)
    c_static = simulation['c_static']

    C = [0.0001, 0.000316227766017, 0.001, 0.00316227766017, 0.01,
         0.0316227766017, 0.1, 0.316227766017, 1.0]
    static = []
    for _input in simulation['inputs']:
        x0 = [0.0] * len(simulation['reactants'])
        result = {'variable': _input, 'c': {}}
        for c0 in C:
            for _i in simulation['inputs']:
                x0[reactant_ids[_i]] = c0 if _input == _i else c_static
            _result = s.simulate(x0, simulation['t'])[-1][1]
            for _o in simulation['outputs']:
                result['c'].setdefault(_o, []).append(
                    _result[reactant_ids[_o]])
        static.append(result)

    return jsonify(c_input=C, c_output=static)
