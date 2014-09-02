import uuid
from .. import db


class Component(db.Model):
    """
    Model for circuit components.
    """
    __tablename__ = 'components'

    component_id = db.Column(db.Integer, primary_key=True)
    component_name = db.Column(db.String, unique=True)
    logic = db.Column(db.Enum('AND', 'OR', 'NOT'), index=True)
    PRO = db.Column(db.Float)
    RES = db.Column(db.Float)
    SEN = db.Column(db.Float)
    STA = db.Column(db.Float)
    HEA = db.Column(db.Float)

    def to_dict(self, eid=False):
        result = {'id': self.component_id, 'name': self.component_name,
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
