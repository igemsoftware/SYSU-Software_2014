from .. import db


class RBS(db.Model):
    """
    Model for RBSs.
    """
    __tablename__ = 'RBSs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    part_id = db.Column(db.Integer, default=0)
    short_name = db.Column(db.String, default='')
    description = db.Column(db.String, default='')
    sequence = db.Column(db.String)
    alpha = db.Column(db.Float)

    def to_dict(self):
        result = {'id': self.id, 'name': self.name,
                  'short_name': self.short_name,
                  'description': self.description,
                  'part_id': self.part_id,
                  'type': 'RBS', 'alpha': self.alpha}
        return result
