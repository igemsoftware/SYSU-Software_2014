from .. import db
from . import BiobrickMixin


class RBS(db.Model, BiobrickMixin):
    """
    Model for RBSs.
    """
    alpha = db.Column(db.Float)

    def to_dict(self, *args, **kwargs):
        result = super(RBS, self).to_dict(*args, **kwargs)
        result.update(type='RBS', alpha=self.alpha)
        return result
