from .. import db


class Receptor(db.Model):
    """
    Model for receptors.
    """
    __tablename__ = 'receptors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    part_id = db.Column(db.Integer, default=0)
    short_name = db.Column(db.String, default='')
    nickname = db.Column(db.String, default='')
    description = db.Column(db.String, default='')
    sequence = db.Column(db.String)

    def to_dict(self):
        result = {'id': self.id, 'name': self.name,
                  'short_name': self.short_name,
                  'nickname': self.nickname,
                  'description': self.description,
                  'part_id': self.part_id,
                  'type': 'receptor'}
        return result
