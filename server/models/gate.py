import uuid
from .. import db


class Gate(db.Model):
    """
    Model for logic gates.
    """
    __tablename__ = 'gates'

    gate_id = db.Column(db.Integer, primary_key=True)
    gate_name = db.Column(db.String, unique=True)
    logic = db.Column(db.Integer, index=True)

    def to_dict(self, eid=False):
        result = {'id': self.gate_id, 'name': self.gate_name,
                  'logic': self.logic}
        if eid == True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
