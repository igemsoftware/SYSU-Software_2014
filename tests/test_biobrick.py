from server import models
from . import TestCase


class TestBiobrick(TestCase):

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

