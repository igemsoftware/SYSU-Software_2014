import json
from server.views.circuit import _truth_table_satisfies
from . import TestCase


class TestCircuit(TestCase):

    def setUp(self):
        self.truth_table = {
            'AND': [
                {'inputs': [True, True], 'outputs': [True]},
                {'inputs': [False, True], 'outputs': [False]},
                {'inputs': [True, False], 'outputs': [False]},
                {'inputs': [False, False], 'outputs': [False]},
            ],
            'SIMPLE_NOT_SIMPLE': [
                {'inputs': [True], 'outputs': [True, False, True]},
                {'inputs': [False], 'outputs': [False, True, False]},
            ],
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
                'outputs': [4],
                'truth_table': self.truth_table['AND']
            }
        ]

    def test_truth_table_satisfies(self):
        self.assert_(_truth_table_satisfies(self.truth_table['AND'],
                                            0, 'FFFT'))
        self.assert_(_truth_table_satisfies(self.truth_table['AND'][:2],
                                            0, 'FFFT'))
        self.assertFalse(_truth_table_satisfies(self.truth_table['AND'],
                                                0, 'FFTT'))

    def test_circuit_schemes_1(self):
        result = self.client.post('/circuit/schemes',
                                  data=json.dumps(self.reqs[0])).json
        with open('tests/circuit_schemes_1.json') as fobj:
            desired = json.load(fobj)
        self.assertEqualWithoutEid(desired, result)

    def test_circuit_schemes_2(self):
        result = self.client.post('/circuit/schemes',
                                  data=json.dumps(self.reqs[1])).json
        with open('tests/circuit_schemes_2.json') as fobj:
            desired = json.load(fobj)
        self.assertEqualWithoutEid(desired, result)

