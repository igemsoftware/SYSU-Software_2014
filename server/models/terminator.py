import uuid
from .. import db


class Terminator(db.Model):
    """
    Model for terminators.
    """
    __tablename__ = 'terminators'

    terminator_id = db.Column(db.Integer, primary_key=True)
    terminator_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        result = {'id': self.terminator_id, 'name': self.terminator_name,
                  'type': 'terminator'}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
