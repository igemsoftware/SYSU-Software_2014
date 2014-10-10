from .. import db


class Promoter(db.Model):
    """
    Model for promoters.
    """
    __tablename__ = 'promoters'

    promoter_id = db.Column(db.Integer, primary_key=True)
    promoter_name = db.Column(db.String, unique=True)
    short_name = db.Column(db.String, default='')
    description = db.Column(db.String, default='')
    gamma = db.Column(db.Float)
    K = db.Column(db.Float)
    n = db.Column(db.Float)

    def to_dict(self):
        result = {'id': self.promoter_id, 'name': self.promoter_name,
                  'short_name': self.short_name,
                  'description': self.description,
                  'type': 'promoter',
                  'gamma': self.gamma, 'K': self.K, 'n': self.n}
        return result
