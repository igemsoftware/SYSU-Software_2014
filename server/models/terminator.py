from .. import db


class Terminator(db.Model):
    """
    Model for terminators.
    """
    __tablename__ = 'terminators'

    terminator_id = db.Column(db.Integer, primary_key=True)
    terminator_name = db.Column(db.String, unique=True)
    part_id = db.Column(db.Integer, default=0)
    short_name = db.Column(db.String, default='')
    description = db.Column(db.String, default='')
    sequence = db.Column(db.String)
    alpha = db.Column(db.Float)

    def to_dict(self):
        result = {'id': self.terminator_id, 'name': self.terminator_name,
                  'short_name': self.short_name,
                  'description': self.description,
                  'part_id': self.part_id,
                  'type': 'terminator'}
        return result
