import uuid
from .. import db


class _Suggestions(db.Model):
    """
    Model for the suggestion association between inputs, promoters and
    receptors.
    """
    __tablename__ = '_suggestions'

    input_id = db.Column(db.Integer, db.ForeignKey('inputs.input_id'),
                         primary_key=True)
    promoter_id = db.Column(db.Integer, db.ForeignKey('promoters.promoter_id'),
                            primary_key=True)
    receptor_id = db.Column(db.Integer, db.ForeignKey('receptors.receptor_id'),
                            primary_key=True)

    input = db.relationship('Input')
    promoter = db.relationship('Promoter')
    receptor = db.relationship('Receptor')


class Input(db.Model):
    """
    Model for inputs.
    """
    __tablename__ = 'inputs'

    input_id = db.Column(db.Integer, primary_key=True)
    input_name = db.Column(db.String, unique=True)

    suggestions = db.relationship('_Suggestions', lazy='dynamic')

    def to_dict(self, eid=False):
        result = {'id': self.input_id, 'name': self.input_name,
                  'type': 'input'}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
