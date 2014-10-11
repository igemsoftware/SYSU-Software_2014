from .. import db


class Promoter(db.Model):
    """
    Model for promoters.
    """
    __tablename__ = 'promoters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    part_id = db.Column(db.Integer, default=0)
    short_name = db.Column(db.String, default='')
    nickname = db.Column(db.String, default='')
    description = db.Column(db.String, default='')
    sequence = db.Column(db.String)
    gamma = db.Column(db.Float)
    K = db.Column(db.Float)
    n = db.Column(db.Float)

    def to_dict(self):
        result = {'id': self.id, 'name': self.name,
                  'short_name': self.short_name,
                  'nickname': self.nickname,
                  'description': self.description,
                  'part_id': self.part_id,
                  'type': 'promoter',
                  'gamma': self.gamma, 'K': self.K, 'n': self.n}
        return result
