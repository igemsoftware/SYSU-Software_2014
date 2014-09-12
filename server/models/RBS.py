import uuid
from .. import db


class RBS(db.Model):
    """
    Model for RBSs.
    """
    __tablename__ = 'RBSs'

    RBS_id = db.Column(db.Integer, primary_key=True)
    RBS_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        result = {'id': self.RBS_id, 'name': self.RBS_name,
                  'type': 'RBS'}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
