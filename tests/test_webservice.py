from flask.ext.testing import TestCase
from server import db, app
from server import models


def init_db(db):
    db.session.add(models.Input(input_name='input1'))
    db.session.add(models.Input(input_name='input2'))

    db.session.add(models.Promoter(promoter_name='promoter1'))
    db.session.add(models.Promoter(promoter_name='promoter2'))

    db.session.add(models.Receptor(receptor_name='receptor1'))
    db.session.add(models.Receptor(receptor_name='receptor2'))

    db.session.add(models.Output(output_name='output1'))
    db.session.add(models.Output(output_name='output2'))

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


class TestWebservice(TestCase):

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
        for name in ['input', 'promoter', 'receptor', 'output']:
            result = self.client.get('/biobrick/' + name).json
            self.assertEquals(result, {
                'result': [biobrick(name, 1), biobrick(name, 2)]
            })

    def test_get_one_biobrick(self):
        for name in ['input', 'promoter', 'receptor', 'output']:
            result = self.client.get('/biobrick/%s?id=1' % name).json
            self.assertEquals(result, {
                'result': biobrick(name, 1)
            })

    def test_suggest_promoter(self):
        result = self.client.get('/biobrick/suggest/promoters?input_id=1').json
        self.assertEquals(result, {
            'result': [biobrick('promoter', 1), biobrick('promoter', 2)]
        })

    def test_suggest_receptor(self):
        result = self.client.get(
            '/biobrick/suggest/receptors?input_id=1&promoter_id=2').json
        self.assertEquals(result, {
            'result': [biobrick('receptor', 2)]
        })
