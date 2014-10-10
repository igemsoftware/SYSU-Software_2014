from .. import db


class Output(db.Model):
    """
    Model for outputs.
    """
    __tablename__ = 'outputs'

    output_id = db.Column(db.Integer, primary_key=True)
    output_name = db.Column(db.String, unique=True)
    short_name = db.Column(db.String, default='')
    description = db.Column(db.String, default='')

    def to_dict(self):
        result = {'id': self.output_id, 'name': self.output_name,
                  'short_name': self.short_name,
                  'description': self.description,
                  'type': 'output'}
        return result
