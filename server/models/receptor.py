from .. import db
from . import BiobrickMixin


class Receptor(db.Model, BiobrickMixin):
    """
    Model for receptors.
    """
    def to_dict(self, as_output=False, *args, **kwargs):
        result = super(Receptor, self).to_dict(*args, **kwargs)
        if as_output:
            result['type'] = 'output'
        return result
