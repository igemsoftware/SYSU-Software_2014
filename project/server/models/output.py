import uuid
from .. import db


class Output(db.Model):
    """
    Model for outputs.
    """
    __tablename__ = 'outputs'

    output_id = db.Column(db.Integer, primary_key=True)
    output_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        result = {'id': self.output_id, 'name': self.output_name,
                  'type': 'output'}
        if eid == True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
