import uuid
from .. import db


class _OutputPromoterRelationship(db.Model):
    """
    Models for the relationships between outputs and promoters.
    """
    __tablename__ = '_output_promoter_relationships'

    output_id = db.Column(db.Integer, db.ForeignKey('outputs.output_id'),
                          primary_key=True)
    promoter_id = db.Column(db.Integer, db.ForeignKey('promoters.promoter_id'),
                            primary_key=True)
    relationship = db.Column(db.Enum('promote', 'repress'))


class Output(db.Model):
    """
    Model for outputs.
    """
    __tablename__ = 'outputs'

    output_id = db.Column(db.Integer, primary_key=True)
    output_name = db.Column(db.String, unique=True)

    def to_dict(self, eid=False):
        result = {'id': self.output_id, 'name': self.output_name,
                  'type': 'output'}
        if eid is True:
            result['eid'] = uuid.uuid4().get_hex()
        elif isinstance(eid, (str, unicode)):
            result['eid'] = eid
        return result
