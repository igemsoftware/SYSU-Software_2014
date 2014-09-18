import json
from flask.ext.testing import TestCase
from server import db, app
from server import models
from server.views.circuit import _truth_table_satisfies


def biobrick(type, id):
    return {'type': type, 'name': type + str(id), 'id': id}


class TestWebservice(TestCase):

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
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SQLALCHEMY_ECHO'] = False
        app.config['TESTING'] = True
        return app

    def setUp(self):
        db.create_all()
        self.init_biobricks()
        self.init_logics()
        self.init_relationships()

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
            'outputs': [
                {'id': 1, 'terminator_id': 1},
                {'id': 2, 'terminator_id': 1}
            ],
            'truth_table': self.truth_table['AND_OR']
        }
        self.req_simple_circuit = {
            'inputs': [
                {'id': 1, 'receptor_id': 1, 'promoter_id': 1}
            ],
            'outputs': [
                {'id': 1, 'terminator_id': 1},
                {'id': 2, 'terminator_id': 2}
            ],
            'truth_table': [
                {'inputs': [True], 'outputs': [True, True]},
                {'inputs': [False], 'outputs': [False, False]}
            ]
        }

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def init_biobricks(self):
        db.session.add(models.Input(input_name='input1'))
        db.session.add(models.Input(input_name='input2'))
        db.session.add(models.Input(input_name='input3'))
        db.session.add(models.Input(input_name='input4'))

        db.session.add(models.Promoter(promoter_name='promoter1'))
        db.session.add(models.Promoter(promoter_name='promoter2'))
        db.session.add(models.Promoter(promoter_name='promoter3'))
        db.session.add(models.Promoter(promoter_name='promoter4'))

        db.session.add(models.Receptor(receptor_name='receptor1'))
        db.session.add(models.Receptor(receptor_name='receptor2'))
        db.session.add(models.Receptor(receptor_name='receptor3'))
        db.session.add(models.Receptor(receptor_name='receptor4'))

        db.session.add(models.Output(output_name='output1'))
        db.session.add(models.Output(output_name='output2'))
        db.session.add(models.Output(output_name='output3'))
        db.session.add(models.Output(output_name='output4'))

        db.session.add(models.RBS(RBS_name='RBS1'))
        db.session.add(models.RBS(RBS_name='RBS2'))
        db.session.add(models.RBS(RBS_name='RBS3'))
        db.session.add(models.RBS(RBS_name='RBS4'))

        db.session.add(models.Terminator(terminator_name='terminator1'))
        db.session.add(models.Terminator(terminator_name='terminator2'))
        db.session.add(models.Terminator(terminator_name='terminator3'))
        db.session.add(models.Terminator(terminator_name='terminator4'))

        db.session.add(
            models._Suggestions(input_id=1, promoter_id=1, receptor_id=1))
        db.session.add(
            models._Suggestions(input_id=1, promoter_id=1, receptor_id=2))
        db.session.add(
            models._Suggestions(input_id=1, promoter_id=2, receptor_id=2))
        db.session.add(
            models._Suggestions(input_id=2, promoter_id=1, receptor_id=1))

        db.session.commit()

    def init_logics(self):
        logic = dict()
        logic['n_inputs'] = 2
        logic['intermedia'] = '[]'
        logic['inputparts'] = json.dumps([
            [models.RBS.query.get(1).to_dict(),
             models.Output.query.get(1).to_dict(),
             models.Terminator.query.get(1).to_dict()
             ],
            [models.RBS.query.get(1).to_dict(),
             models.Output.query.get(2).to_dict(),
             models.Terminator.query.get(1).to_dict()
             ],
        ])
        logic['outputparts'] = json.dumps([
            [models.Promoter.query.get(1).to_dict(),
             models.RBS.query.get(1).to_dict()]
        ])

        logic1 = models.Logic(logic_name='AND 1', truth_table='FFFT', **logic)
        logic2 = models.Logic(logic_name='AND 2', truth_table='FFFT', **logic)
        logic3 = models.Logic(logic_name='OR 1', truth_table='FTTT', **logic)

        logic['n_inputs'] = 1
        logic['intermedia'] = '[]'
        logic['inputparts'] = json.dumps([
            [models.RBS.query.get(1).to_dict(),
             models.Output.query.get(1).to_dict(),
             models.Terminator.query.get(1).to_dict()]
        ])

        logic4 = models.Logic(logic_name='Switch', truth_table='FT', **logic)
        logic5 = models.Logic(logic_name='NOT 1', truth_table='TF', **logic)

        db.session.add(logic1)
        db.session.add(logic2)
        db.session.add(logic3)
        db.session.add(logic4)
        db.session.add(logic5)

        db.session.commit()

    def init_relationships(self):
        r1 = models._OutputPromoterRelationship(output_id=1, promoter_id=1,
                                                relationship='promote')
        r2 = models._OutputPromoterRelationship(output_id=2, promoter_id=2,
                                                relationship='promote')
        r3 = models._OutputPromoterRelationship(output_id=3, promoter_id=3,
                                                relationship='repress')
        r4 = models._OutputPromoterRelationship(output_id=4, promoter_id=4,
                                                relationship='repress')

        db.session.add(r1)
        db.session.add(r2)
        db.session.add(r3)
        db.session.add(r4)

        db.session.commit()

    def test_get_biobrick_list(self):
        for name in ['input', 'promoter', 'receptor', 'output', 'RBS',
                     'terminator']:
            result = self.client.get('/biobrick/' + name).json
            self.assertItemsEqual(result, {
                'result': [biobrick(name, 1), biobrick(name, 2),
                           biobrick(name, 3), biobrick(name, 4)]
            })

    def test_get_one_biobrick(self):
        for name in ['input', 'promoter', 'receptor', 'output', 'RBS',
                     'terminator']:
            result = self.client.get('/biobrick/%s?id=1' % name).json
            self.assertEquals(result, {
                'result': biobrick(name, 1)
            })

    def test_suggest_promoter(self):
        result = self.client.get('/biobrick/suggest/promoters?input_id=1').json
        self.assertItemsEqual(result, {
            'result': [biobrick('promoter', 1), biobrick('promoter', 2)]
        })

    def test_suggest_receptor(self):
        result = self.client.get(
            '/biobrick/suggest/receptors?input_id=1&promoter_id=2').json
        self.assertItemsEqual(result, {
            'result': [biobrick('receptor', 2)]
        })

    def test_truth_table_satisfies(self):
        self.assert_(_truth_table_satisfies(self.truth_table['AND'],
                                            0, 'FFFT'))
        self.assert_(_truth_table_satisfies(self.truth_table['AND'][:2],
                                            0, 'FFFT'))
        self.assertFalse(_truth_table_satisfies(self.truth_table['AND'],
                                                0, 'FFTT'))

    def test_design(self):
        self.client.post('/circuit/schemes',
                         data=json.dumps(self.req_AND_OR)).json

    def test_design_schemes_inputs(self):
        r = self.client.post('/circuit/schemes',
                             data=json.dumps(self.req_AND_OR)).json
        with open('tests/circuit_schemes_AND_OR.json') as fobj:
            desired = json.load(fobj)
        self.assertEqualWithoutEid(r, desired)

    def test_design_schemes_simple_circuit(self):
        r = self.client.post('/circuit/schemes',
                             data=json.dumps(self.req_simple_circuit)).json
        with open('tests/circuit_schemes_simple_circuit.json') as fobj:
            desired = json.load(fobj)
        self.assertEqualWithoutEid(r, desired)

    def test_device_build_relationships(self):
        terminator = models.Terminator.query.get(1).to_dict(True)
        rbs = models.RBS.query.get(1).to_dict(True)

        logic1 = models.Logic.query.get(1).to_dict(True)
        logic2 = models.Logic.query.get(2).to_dict(True)
        logic3 = models.Logic.query.get(1).to_dict(True)
        logic4 = models.Logic.query.get(2).to_dict(True)

        i1 = models.Input.query.get(1).to_dict(True)
        i2 = models.Input.query.get(2).to_dict(True)

        p1 = models.Promoter.query.get(1).to_dict('promoter_eid_1')
        p2 = models.Promoter.query.get(2).to_dict('promoter_eid_2')
        p3 = models.Promoter.query.get(3).to_dict('promoter_eid_3')
        p4 = models.Promoter.query.get(4).to_dict('promoter_eid_4')
        p5 = models.Promoter.query.get(2).to_dict('promoter_eid_5')
        p6 = models.Promoter.query.get(3).to_dict('promoter_eid_6')

        o1 = models.Output.query.get(1).to_dict('output_eid_1')
        o2 = models.Output.query.get(3).to_dict('output_eid_2')
        o3 = models.Output.query.get(1).to_dict('output_eid_3')
        o4 = models.Output.query.get(2).to_dict('output_eid_4')

        inputs = [[i1, rbs], [i2, rbs]]

        logic1['inputparts'][0].insert(0, p1)
        logic1['inputparts'][1].insert(0, p2)
        logic1['outputparts'][0].extend([o1, terminator])

        logic2['inputparts'][0].insert(0, p1)
        logic2['inputparts'][1].insert(0, p2)
        logic2['outputparts'][0].extend([o2, terminator])

        logic3['inputparts'][0].insert(0, p3)
        logic3['inputparts'][1].insert(0, p4)
        logic3['outputparts'][0].extend([o3, terminator])

        logic4['inputparts'][0].insert(0, p5)
        logic4['inputparts'][1].insert(0, p6)
        logic4['outputparts'][0].extend([o4, terminator])

        circuit1 = {'inputs': inputs, 'logics': [logic1, logic2]}
        circuit2 = {'inputs': inputs, 'logics': [logic3]}
        circuit3 = {'inputs': inputs, 'logics': [logic4]}

        circuits = [circuit1, circuit2, circuit3]
        r = self.client.post('/device/build_relationships',
                             data=json.dumps(circuits)).json
        self.assertItemsEqual(r['circuits'], circuits)
        self.assertItemsEqual(r['relationships'],
                              [
                                  {
                                      'from': 'output_eid_4',
                                      'to': 'promoter_eid_2',
                                      'type': 'promote'
                                  },
                                  {
                                      'from': 'output_eid_2',
                                      'to': 'promoter_eid_6',
                                      'type': 'repress'
                                  },
                                  {
                                      'from': 'output_eid_3',
                                      'to': 'promoter_eid_1',
                                      'type': 'promote'
                                  },
                                  {
                                      'from': 'output_eid_2',
                                      'to': 'promoter_eid_3',
                                      'type': 'repress'
                                  }
                              ])
