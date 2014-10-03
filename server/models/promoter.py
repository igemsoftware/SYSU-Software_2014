import uuid
from .. import db


class Promoter(db.Model):
    """
    Model for promoters.
    """
    __tablename__ = 'promoters'

    promoter_id = db.Column(db.Integer, primary_key=True)
    promoter_name = db.Column(db.String, unique=True)
    gamma = db.Column(db.Float)
    K = db.Column(db.Float)
    n = db.Column(db.Float)

    def to_dict(self, eid=False):
        result = {'id': self.promoter_id, 'name': self.promoter_name,
                  'type': 'promoter',
                  'gamma': self.gamma, 'K': self.K, 'n': self.n}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
