from .. import db


signal_promoter_suggestions = db.Table(
    'signal_promoter_suggestions',
    db.Column('signal_id', db.Integer,
              db.ForeignKey('signals.signal_id')),
    db.Column('promoter_id', db.Integer,
              db.ForeignKey('promoters.promoter_id')))


signal_receptor_suggestions = db.Table(
    'signal_receptor_suggestions',
    db.Column('signal_id', db.Integer,
              db.ForeignKey('signals.signal_id')),
    db.Column('receptor_id', db.Integer,
              db.ForeignKey('receptors.receptor_id')))


class Signal(db.Model):
    """
    Model for signals.
    """
    __tablename__ = 'signals'

    signal_id = db.Column(db.Integer, primary_key=True)
    signal_name = db.Column(db.String, unique=True)

    promoter_suggestions = db.relationship(
        'Promoter', secondary=signal_promoter_suggestions)
    receptor_suggestions = db.relationship(
        'Receptor', secondary=signal_receptor_suggestions)
