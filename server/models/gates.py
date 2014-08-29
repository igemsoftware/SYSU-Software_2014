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
        if eid:
            return {'id': self.gate_id, 'eid': uuid.uuid4().get_hex(),
                    'name': self.gate_name, 'logic': self.logic}
        else:
            return {'id': self.gate_id,
                    'name': self.gate_name, 'logic': self.logic}
