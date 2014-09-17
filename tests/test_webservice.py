import json
from flask.ext.testing import TestCase
from server import db, app
from server import models
from server.views.circuit import _truth_table_satisfies


def init_db(db):
    db.session.add(models.Input(input_name='input1'))
    db.session.add(models.Input(input_name='input2'))

    db.session.add(models.Promoter(promoter_name='promoter1'))
    db.session.add(models.Promoter(promoter_name='promoter2'))

    db.session.add(models.Receptor(receptor_name='receptor1'))
    db.session.add(models.Receptor(receptor_name='receptor2'))

    db.session.add(models.Output(output_name='output1'))
    db.session.add(models.Output(output_name='output2'))

    db.session.add(models.RBS(RBS_name='RBS1'))
    db.session.add(models.RBS(RBS_name='RBS2'))

    db.session.add(models.Terminator(terminator_name='terminator1'))
    db.session.add(models.Terminator(terminator_name='terminator2'))

    db.session.add(
        models._Suggestions(input_id=1, promoter_id=1, receptor_id=1))
    db.session.add(
        models._Suggestions(input_id=1, promoter_id=1, receptor_id=2))
    db.session.add(
        models._Suggestions(input_id=1, promoter_id=2, receptor_id=2))
    db.session.add(
        models._Suggestions(input_id=2, promoter_id=1, receptor_id=1))

    db.session.commit()


def biobrick(type, id):
    return {'type': type, 'name': type + str(id), 'id': id}


class TestBiobrick(TestCase):

    def create_app(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SQLALCHEMY_ECHO'] = False
        app.config['TESTING'] = True
        return app

    def setUp(self):
        db.create_all()
        init_db(db)

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_get_biobrick_list(self):
        for name in ['input', 'promoter', 'receptor', 'output', 'RBS',
                     'terminator']:
            result = self.client.get('/biobrick/' + name).json
            self.assertItemsEqual(result, {
                'result': [biobrick(name, 1), biobrick(name, 2)]
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


class TestCircuitSchemes(TestCase):

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
        init_db(db)
        self.init_logics()

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
