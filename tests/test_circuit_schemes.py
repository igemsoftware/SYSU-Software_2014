from flask.ext.testing import TestCase
from server import db, app
from server import models
from server.algorithms import circuit_schemes


def _logic_eval_single(eid_dict, output):
    if isinstance(eid_dict[output], dict):
        input_values = [_logic_eval_single(eid_dict, i)
                        for i in eid_dict[output]['inputs']]

        if eid_dict[output]['logic'] == 'AND':
            value = input_values[0] and input_values[1]
        elif eid_dict[output]['logic'] == 'OR':
            value = input_values[0] or input_values[1]
        elif eid_dict[output]['logic'] == 'NOT':
            value = not input_values[0]
        else:
            raise ValueError

        eid_dict[output] = value

    return eid_dict[output]


def logic_eval(eid_dict, outputs):
    return [_logic_eval_single(eid_dict, o) for o in outputs]


def validate_logic_circuit(inputs, outputs, truth_table, scheme):
    eid_dict = {gate['eid']: gate for gate in scheme['logic_gates']}
    eid_dict.update({eid: None for eid in inputs})

    for rule in truth_table:
        _eid_dict = eid_dict.copy()
        _eid_dict.update(dict(zip(inputs, rule['inputs'])))
        if logic_eval(_eid_dict, outputs) != rule['outputs']:
            return False

    return True


def init_db(db):
    s1 = {'PRO': 1.0, 'RES': 2.0, 'SEN': 3.0, 'STA': 4.0, 'HEA': 5.0}
    s2 = {'PRO': 2.0, 'RES': 1.0, 'SEN': 2.0, 'STA': 5.0, 'HEA': 3.0}
    s3 = {'PRO': 3.0, 'RES': 4.0, 'SEN': 1.0, 'STA': 2.0, 'HEA': 1.0}
    db.session.add(models.Component(component_name='and 1', logic='AND', **s1))
    db.session.add(models.Component(component_name='and 2', logic='AND', **s2))
    db.session.add(models.Component(component_name='or 1', logic='OR', **s1))
    db.session.add(models.Component(component_name='or 2', logic='OR', **s2))
    db.session.add(models.Component(component_name='not 1', logic='NOT', **s1))
    db.session.add(models.Component(component_name='not 2', logic='NOT', **s2))
    db.session.add(models.Component(component_name='not 3', logic='NOT', **s3))

    db.session.add(models.Input(input_name='input1'))
    db.session.add(models.Input(input_name='input2'))

    db.session.add(models.Promoter(promoter_name='promoter1'))
    db.session.add(models.Promoter(promoter_name='promoter2'))

    db.session.add(models.Receptor(receptor_name='receptor1'))
    db.session.add(models.Receptor(receptor_name='receptor2'))

    db.session.add(models.Output(output_name='output1'))
    db.session.add(models.Output(output_name='output2'))
    db.session.add(models.Output(output_name='output3'))


class TestCircuitSchemes(TestCase):

    def create_app(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SQLALCHEMY_ECHO'] = False
        app.config['TESTING'] = True
        return app

    def setUp(self):
        db.create_all()
        init_db(db)

        self.truth_table = [
            {'inputs': [True, True], 'outputs': [True, False, False]},
            {'inputs': [True, False], 'outputs': [True, False, True]},
            {'inputs': [False, True], 'outputs': [False, True, True]},
            {'inputs': [False, False], 'outputs': [False, False, False]}
        ]
        self.inputs = [x.to_dict(True) for x in models.Input.query[:2]]
        self.outputs = [x.to_dict(True) for x in models.Output.query[:3]]

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_make_schemes_schemes_validation(self):
        schemes = circuit_schemes.make_schemes(self.inputs, self.outputs,
                                               self.truth_table)
        input_eids = [x['eid'] for x in self.inputs]
        for scheme in schemes:
            self.assert_(validate_logic_circuit(input_eids, scheme['outputs'],
                                                self.truth_table, scheme))

    def test_make_schemes_number_of_schemes(self):
        schemes = circuit_schemes.make_schemes(self.inputs, self.outputs,
                                               self.truth_table)
        self.assertEquals(len(schemes), 24)

    def test_make_schemes_scores(self):
        schemes = circuit_schemes.make_schemes(self.inputs, self.outputs,
                                               self.truth_table)
        self.assertEquals(schemes[0]['scores'], {'PRO': 5.0, 'RES': 10.0,
                                                 'SEN': 15.0, 'STA': 20.0,
                                                 'HEA': 25.0})
