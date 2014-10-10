from .. import db


class RBS(db.Model):
    """
    Model for RBSs.
    """
    __tablename__ = 'RBSs'

    RBS_id = db.Column(db.Integer, primary_key=True)
    RBS_name = db.Column(db.String, unique=True)
    alpha = db.Column(db.Float)

    def to_dict(self):
        result = {'id': self.RBS_id, 'name': self.RBS_name,
                  'type': 'RBS', 'alpha': self.alpha}
        return result
