import uuid
from .. import db


class Promoter(db.Model):
    """
    Model for promoters.
    """
    __tablename__ = 'promoters'

    promoter_id = db.Column(db.Integer, primary_key=True)
    promoter_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        if eid:
            return {'type': 'promoter', 'eid': uuid.uuid4().get_hex(),
                    'id': self.promoter_id, 'name': self.promoter_name}
        else:
            return {'type': 'promoter',
                    'id': self.promoter_id, 'name': self.promoter_name}
