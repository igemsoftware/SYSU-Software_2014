from .. import db


class Reporter(db.Model):
    """
    Model for reporters.
    """
    __tablename__ = 'reporters'

    reporter_id = db.Column(db.Integer, primary_key=True)
    reporter_name = db.Column(db.String, unique=True)
