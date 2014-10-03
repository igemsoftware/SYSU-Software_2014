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
    logic_type = db.Column(db.String)
    n_inputs = db.Column(db.Integer)
    truth_table = db.Column(db.String)
    relationships = db.Column(db.String)
    inputparts = db.Column(db.String)   # for visualization
    outputparts = db.Column(db.String)  # for visualization

    def to_dict(self, eid=False):
        result = {'id': self.logic_id, 'name': self.logic_name,
                  'type': 'logic', 'truth_table': self.truth_table,
                  'relationships': json.loads(self.relationships),
                  'inputparts': json.loads(self.inputparts),
                  'outputparts': json.loads(self.outputparts),
                  'logic_type': self.logic_type
                  }
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
