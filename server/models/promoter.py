from .. import db
from . import BiobrickMixin


class Promoter(db.Model, BiobrickMixin):
    """
    Model for promoters.
    """
    gamma = db.Column(db.Float)
    K = db.Column(db.Float)
    n = db.Column(db.Float)

    def to_dict(self, *args, **kwargs):
        result = super(Promoter, self).to_dict(*args, **kwargs)
        result.update(gamma=self.gamma, K=self.K, n=self.n)
        return result
