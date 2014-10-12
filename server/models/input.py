from .. import db
from . import BiobrickMixin


class _Suggestions(db.Model):
    """
    Model for the suggestion association between inputs, promoters and
    receptors.
    """
    __tablename__ = '_suggestions'

    input_id = db.Column(db.Integer, db.ForeignKey('inputs.id'),
                         primary_key=True)
    promoter_id = db.Column(db.Integer, db.ForeignKey('promoters.id'),
                            primary_key=True)
    receptor_id = db.Column(db.Integer, db.ForeignKey('receptors.id'),
                            primary_key=True)
    relationship = db.Column(db.Enum('BIREPRESS', 'REPRESS', 'PROMOTE'))

    input = db.relationship('Input')
    promoter = db.relationship('Promoter')
    receptor = db.relationship('Receptor')


class Input(db.Model, BiobrickMixin):
    """
    Model for inputs.
    """
    suggestions = db.relationship('_Suggestions', lazy='dynamic')
