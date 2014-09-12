import uuid
import json
from .promoter import Promoter
from .output import Output
from .RBS import RBS
from .. import db


class Logic(db.Model):
    """
    Model for logic components.
    """
    __tablename__ = 'logics'

    logic_id = db.Column(db.Integer, primary_key=True)
    logic_name = db.Column(db.String, unique=True)
    n_inputs = db.Column(db.Integer)
    n_outputs = db.Column(db.Integer)
    truth_table = db.Column(db.String)
    intermedia = db.Column(db.String)
    inputs = db.Column(db.String)
    outputs = db.Column(db.String)
    PRO = db.Column(db.Float)
    RES = db.Column(db.Float)
    SEN = db.Column(db.Float)
    STA = db.Column(db.Float)
    HEA = db.Column(db.Float)

    def _get_inputs_details(self, eid=False):
        inputs = json.loads(self.inputs)
        for i in inputs:
            i['RBS'] = RBS.query.get(i['RBS']).to_dict(eid)
            i['output'] = Output.query.get(i['output']).to_dict(eid)
        return inputs

    def _get_outputs_details(self, eid=False):
        outputs = json.loads(self.outputs)
        for o in outputs:
            o['RBS'] = RBS.query.get(o['RBS']).to_dict(eid)
            o['promoter'] = Promoter.query.get(o['promoter']).to_dict(eid)
        return outputs

    def to_dict(self, eid=False):
        result = {'id': self.logic_id, 'name': self.logic_name,
                  'type': 'logic', 'truth_table': self.truth_table,
                  'intermedia': json.loads(self.intermedia),
                  'inputs': self._get_inputs_details(eid),
                  'outputs': self._get_outputs_details(eid),
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
