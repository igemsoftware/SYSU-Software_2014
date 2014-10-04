import json
from flask.ext.testing import TestCase as _TestCase
from server import db, app
from server import models
from server.views.circuit import _truth_table_satisfies


class TestCase(_TestCase):

    def assertItemsAlmostEqual(self, a, b):
        if isinstance(a, dict) and isinstance(b, dict):
            self.assertItemsEqual(a.keys(), b.keys())
            for k in a:
                self.assertItemsAlmostEqual(a[k], b[k])
        elif isinstance(a, list) and len(a) == len(b):
            for _a, _b in zip(a, b):
                self.assertItemsAlmostEqual(_a, _b)
        else:
            self.assertAlmostEqual(a, b)

    def assertEqualWithoutEid(self, a, b):
        if isinstance(a, dict) and isinstance(b, dict):
            a.pop('eid', None)
            b.pop('eid', None)
            self.assertItemsEqual(a.keys(), b.keys())
            for k in a:
                self.assertEqualWithoutEid(a[k], b[k])
        elif isinstance(a, list) and len(a) == len(b):
            for _a, _b in zip(a, b):
                self.assertEqualWithoutEid(_a, _b)
        else:
            self.assertEqual(a, b)

    def create_app(self):
        app.config['SQLALCHEMY_ECHO'] = False
        app.config['TESTING'] = True
        return app

    def tearDown(self):
        db.session.remove()


class TestBiobrick(TestCase):

    def setUp(self):
        self.truth_table = {
            'AND': [
                {'inputs': [True, True], 'outputs': [True]},
                {'inputs': [False, True], 'outputs': [False]},
                {'inputs': [True, False], 'outputs': [False]},
                {'inputs': [False, False], 'outputs': [False]},
            ],
            'AND_OR': [
                {'inputs': [True, True], 'outputs': [True, True]},
                {'inputs': [False, True], 'outputs': [False, True]},
                {'inputs': [True, False], 'outputs': [False, True]},
                {'inputs': [False, False], 'outputs': [False, False]},
            ]
        }

        self.req_AND_OR = {
            'inputs': [
                {'id': 1, 'receptor_id': 1, 'promoter_id': 1},
                {'id': 2, 'receptor_id': 2, 'promoter_id': 2}
            ],
            'outputs': [1, 2],
            'truth_table': self.truth_table['AND_OR']
        }
        self.req_simple_circuit = {
            'inputs': [
                {'id': 1, 'receptor_id': 1, 'promoter_id': 1}
            ],
            'outputs': [1, 2],
            'truth_table': [
                {'inputs': [True], 'outputs': [True, True]},
                {'inputs': [False], 'outputs': [False, False]}
            ]
        }

    def test_get_biobrick_list(self):
        for type in ['input', 'receptor', 'promoter', 'output', 'RBS',
                     'terminator', 'logic']:
            result = self.client.get('/biobrick/' + type).json
            self.assert_(len(result['result']) > 0)
        self.assert400(self.client.get('/biobrick/XXX'))

    def test_get_one_biobrick(self):
        for type in ['input', 'receptor', 'promoter', 'output', 'RBS',
                     'terminator', 'logic']:
            result = self.client.get('/biobrick/%s?id=1' % type).json['result']
            type = type.capitalize() if not type.isupper() else type
            desired = getattr(models, type).query.get(1).to_dict()
            self.assertEqual(result, desired)

    def test_suggest_promoters(self):
        result = self.client.get('/biobrick/suggest/promoters?input_id=1').json
        self.assertEqual(result['result'],
                         [models.Promoter.query.get(17).to_dict()])

    def test_suggest_receptors(self):
        result = self.client.get(
            '/biobrick/suggest/receptors?input_id=1&promoter_id=17').json
        self.assertEqual(result['result'],
                         [models.Receptor.query.get(1).to_dict()])

    def test_truth_table_satisfies(self):
        self.assert_(_truth_table_satisfies(self.truth_table['AND'],
                                            0, 'FFFT'))
        self.assert_(_truth_table_satisfies(self.truth_table['AND'][:2],
                                            0, 'FFFT'))
        self.assertFalse(_truth_table_satisfies(self.truth_table['AND'],
                                                0, 'FFTT'))


class TestSimulationBase(TestCase):

    def setUp(self):
        self.simulations = {}
        logic_type = ['repressilator', 'toggle_switch_1', 'toggle_switch_2',
                      'inverter', 'simple', 'and_gate']
        for logic_type in logic_type:
            with open('tests/preprocess_%s.json' % logic_type) as fobj:
                self.simulations[logic_type] = json.load(fobj)


class TestSimulationPreprocess(TestSimulationBase):
    
    def test_preprocess_repressilator(self):
        circuits = json.dumps([
            {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
             'logics': [1], 'outputs': []}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['repressilator'])

    def test_preprocess_toggle_switch_1(self):
        circuits = json.dumps([
            {'inputs': [{'id': 3, 'promoter_id': 9, 'receptor_id': 4},
                        {'id': 4, 'promoter_id': 20, 'receptor_id': 5}],
             'logics': [12], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['toggle_switch_1'])

    def test_preprocess_toggle_switch_2(self):
        circuits = json.dumps([
            {'inputs': [{'id': 4, 'promoter_id': 20, 'receptor_id': 5}],
             'logics': [13], 'outputs': [1, 2]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['toggle_switch_2'])

    def test_preprocess_inverter(self):
        circuits = json.dumps([
            {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
             'logics': [2], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['inverter'])

    def test_preprocess_simple(self):
        circuits = json.dumps([
            {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
             'logics': [15], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['simple'])

    def test_preprocess_and_gate(self):
        circuits = json.dumps([
            {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12},
                        {'id': 9, 'promoter_id': 17, 'receptor_id': 13}],
             'logics': [16], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['and_gate'])


class TestSimulationSimulate(TestSimulationBase):
    
    def test_simulation_and_gate(self):
        s = self.simulations['and_gate']
        s['x0'] = {'Zinc ions': 2e-2, 'PAI': 1e-2}
        s['t'] = 100
        result = self.client.post('/simulation/simulate',
                                  data=json.dumps(s)).json
        with open('tests/simulation_and_gate.json') as fobj:
            desired = json.load(fobj)
        self.assertItemsAlmostEqual(result, desired)

    def test_simulation_simple(self):
        s = self.simulations['simple']
        s['x0'] = {'Mercury ions': 1e-2}
        s['t'] = 100
        result = self.client.post('/simulation/simulate',
                                  data=json.dumps(s)).json
        with open('tests/simulation_simple.json') as fobj:
            desired = json.load(fobj)
        self.assertItemsAlmostEqual(result, desired)

    def test_simulation_toggle_switch_1(self):
        s = self.simulations['toggle_switch_1']
        s['x0'] = {'Arsenic ions': 1e-2, 'aTc': 2e-2}
        s['t'] = 100
        result = self.client.post('/simulation/simulate',
                                  data=json.dumps(s)).json
        with open('tests/simulation_toggle_switch_1.json') as fobj:
            desired = json.load(fobj)
        self.assertItemsAlmostEqual(result, desired)
