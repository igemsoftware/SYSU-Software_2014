import json
from . import TestCase


class TestSimulationBase(TestCase):

    def setUp(self):
        self.simulations = {}
        logic_type = ['repressilator', 'toggle_switch_1', 'toggle_switch_2',
                      'inverter', 'simple', 'and_gate', 'or_gate']
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
             'logics': [17], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['toggle_switch_1'])

    def test_preprocess_toggle_switch_2(self):
        circuits = json.dumps([
            {'inputs': [{'id': 4, 'promoter_id': 20, 'receptor_id': 5}],
             'logics': [18], 'outputs': [1, 2]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['toggle_switch_2'])

    def test_preprocess_inverter(self):
        circuits = json.dumps([
            {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
             'logics': [7], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['inverter'])

    def test_preprocess_simple(self):
        circuits = json.dumps([
            {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
             'logics': [20], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['simple'])

    def test_preprocess_and_gate(self):
        circuits = json.dumps([
            {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12},
                        {'id': 9, 'promoter_id': 17, 'receptor_id': 13}],
             'logics': [21], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['and_gate'])

    def test_preprocess_or_gate(self):
        circuits = json.dumps([
            {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12},
                        {'id': 9, 'promoter_id': 17, 'receptor_id': 13}],
             'logics': [23], 'outputs': [1]}
        ])
        result = self.client.post('/simulation/preprocess', data=circuits).json
        self.assertEqual(result, self.simulations['or_gate'])


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
