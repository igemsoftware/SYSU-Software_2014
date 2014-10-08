from flask.ext.testing import TestCase as _TestCase
from server import db, app


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
