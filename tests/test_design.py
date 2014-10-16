import json
from . import TestCase


class TestCircuitSchemes(TestCase):

    def setUp(self):
        self.truth_table = {
            'SIMPLE_NOT_SIMPLE': [
                {'inputs': [True], 'outputs': [True, False, True]},
                {'inputs': [False], 'outputs': [False, True, False]},
            ],
            'AND_OR': [
                {'inputs': [True, True], 'outputs': [True, True]},
                {'inputs': [False, True], 'outputs': [False, True]},
                {'inputs': [True, False], 'outputs': [False, True]},
                {'inputs': [False, False], 'outputs': [False, False]},
            ],
            'SIMPLE': [
                {'inputs': [True], 'outputs': [True]},
                {'inputs': [False], 'outputs': [False]},
            ]
        }

        self.reqs = [
            {
                'inputs': [{'id': 2, 'promoter_id': 23, 'receptor_id': 3}],
                'outputs': [1, 2, 3],
                'truth_table': self.truth_table['SIMPLE_NOT_SIMPLE']
            },
            {
                'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1},
                           {'id': 2, 'promoter_id': 23, 'receptor_id': 3}],
                'outputs': [2, 4],
                'truth_table': self.truth_table['AND_OR']
            },
            {
                'inputs': [{'id': 5, 'promoter_id': 24, 'receptor_id': 9}],
                'outputs': [1],
                'truth_table': self.truth_table['SIMPLE']
            }
        ]

    def test_circuit_schemes_1(self):
        result = self.client.post('/circuit/schemes',
                                  data=json.dumps(self.reqs[0])).json
        with open('tests/circuit_schemes_1.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result, desired)

    def test_circuit_schemes_2(self):
        result = self.client.post('/circuit/schemes',
                                  data=json.dumps(self.reqs[1])).json
        with open('tests/circuit_schemes_2.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result, desired)

    def test_circuit_schemes_3(self):
        result = self.client.post('/circuit/schemes',
                                  data=json.dumps(self.reqs[2])).json
        with open('tests/circuit_schemes_3.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result, desired)


class TestCircuitDetails(TestCase):

    def test_details_repressilator(self):
        design = {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
                  'logics': [1], 'outputs': []}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_repressilator.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_toggle_switch_1(self):
        design = {'inputs': [{'id': 3, 'promoter_id': 9, 'receptor_id': 4},
                             {'id': 4, 'promoter_id': 20, 'receptor_id': 5}],
                  'logics': [17], 'outputs': [1]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_toggle_switch_1.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_toggle_switch_2(self):
        design = {'inputs': [{'id': 4, 'promoter_id': 20, 'receptor_id': 5}],
                  'logics': [18], 'outputs': [1, 2]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_toggle_switch_2.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_simple(self):
        design = {'inputs': [{'id': 1, 'promoter_id': 17, 'receptor_id': 1}],
                  'logics': [20], 'outputs': [1]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_simple.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_and_gate(self):
        design = {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12},
                             {'id': 9, 'promoter_id': 17, 'receptor_id': 13}],
                  'logics': [21], 'outputs': [1]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_and_gate.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_or_gate(self):
        design = {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12},
                             {'id': 9, 'promoter_id': 17, 'receptor_id': 13}],
                  'logics': [23], 'outputs': [1]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_or_gate.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)

    def test_details_multi(self):
        design = {'inputs': [{'id': 8, 'promoter_id': 1, 'receptor_id': 12}],
                  'logics': [20, 7, 20], 'outputs': [1, 2, 3]}
        result = self.client.post('/circuit/details', data=json.dumps(design))
        with open('tests/details_multi.json') as fobj:
            desired = json.load(fobj)
        self.assertDictContainsRecursively(result.json, desired)
