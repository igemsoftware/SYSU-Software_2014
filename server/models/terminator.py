from .. import db


class Terminator(db.Model):
    """
    Model for terminators.
    """
    __tablename__ = 'terminators'

    terminator_id = db.Column(db.Integer, primary_key=True)
    terminator_name = db.Column(db.String, unique=True)

    def to_dict(self):
        result = {'id': self.terminator_id, 'name': self.terminator_name,
                  'type': 'terminator'}
        return result
