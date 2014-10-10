from .. import db


class Receptor(db.Model):
    """
    Model for receptors.
    """
    __tablename__ = 'receptors'

    receptor_id = db.Column(db.Integer, primary_key=True)
    receptor_name = db.Column(db.String, unique=True)
    short_name = db.Column(db.String, default='')
    description = db.Column(db.String, default='')

    def to_dict(self):
        result = {'id': self.receptor_id, 'name': self.receptor_name,
                  'short_name': self.short_name,
                  'description': self.description,
                  'type': 'receptor'}
        return result
