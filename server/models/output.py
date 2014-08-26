from .. import db


class Output(db.Model):
    """
    Model for outputs.
    """
    __tablename__ = 'outputs'

    output_id = db.Column(db.Integer, primary_key=True)
    output_name = db.Column(db.String, unique=True)
