import uuid
from .. import db


class Gate(db.Model):
    """
    Model for logic gates.
    """
    __tablename__ = 'gates'

    gate_id = db.Column(db.Integer, primary_key=True)
    gate_name = db.Column(db.String, unique=True)
    logic = db.Column(db.Enum('AND', 'OR', 'NOT'), index=True)
    PRO = db.Column(db.Float)
    RES = db.Column(db.Float)
    SEN = db.Column(db.Float)
    STA = db.Column(db.Float)
    HEA = db.Column(db.Float)

    def to_dict(self, eid=False):
        result = {'id': self.gate_id, 'name': self.gate_name,
                  'logic': self.logic,
                  'scores': {'PRO': self.PRO,
                             'RES': self.RES,
                             'SEN': self.SEN,
                             'STA': self.STA,
                             'HEA': self.HEA}
                  }
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
