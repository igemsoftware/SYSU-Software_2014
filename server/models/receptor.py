import uuid
from .. import db


class Receptor(db.Model):
    """
    Model for receptors.
    """
    __tablename__ = 'receptors'

    receptor_id = db.Column(db.Integer, primary_key=True)
    receptor_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        if eid:
            return {'type': 'receptor', 'eid': uuid.uuid4().get_hex(),
                    'id': self.receptor_id, 'name': self.receptor_name}
        else:
            return {'type': 'receptor',
                    'id': self.receptor_id, 'name': self.receptor_name}
