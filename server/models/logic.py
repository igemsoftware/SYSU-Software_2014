import uuid
import json
from .. import db


class Logic(db.Model):
    """
    Model for logic components.
    """
    __tablename__ = 'logics'

    logic_id = db.Column(db.Integer, primary_key=True)
    logic_name = db.Column(db.String, unique=True)
    n_inputs = db.Column(db.Integer)
    truth_table = db.Column(db.String)
    intermedia = db.Column(db.String)   # for simulation
    inputparts = db.Column(db.String)   # for visualization
    outputparts = db.Column(db.String)  # for visualization
    PRO = db.Column(db.Float)
    RES = db.Column(db.Float)
    SEN = db.Column(db.Float)
    STA = db.Column(db.Float)
    HEA = db.Column(db.Float)

    def to_dict(self, eid=False):
        result = {'id': self.logic_id, 'name': self.logic_name,
                  'type': 'logic', 'truth_table': self.truth_table,
                  'intermedia': json.loads(self.intermedia),
                  'inputparts': json.loads(self.inputparts),
                  'outputparts': json.loads(self.outputparts),
                  'scores': {
                      'PRO': self.PRO,
                      'RES': self.RES,
                      'SEN': self.SEN,
                      'STA': self.STA,
                      'HEA': self.HEA,
                  }}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
