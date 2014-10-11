import json
from .. import db


class Logic(db.Model):
    """
    Model for logic components.
    """
    __tablename__ = 'logics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    logic_type = db.Column(db.String)
    n_inputs = db.Column(db.Integer)
    truth_table = db.Column(db.String, default='')
    inputparts = db.Column(db.String)
    outputparts = db.Column(db.String)

    def to_dict(self):
        result = {'id': self.id, 'name': self.name,
                  'type': 'logic', 'truth_table': self.truth_table,
                  'inputparts': json.loads(self.inputparts),
                  'outputparts': json.loads(self.outputparts),
                  'logic_type': self.logic_type
                  }
        return result
