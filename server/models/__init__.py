from sqlalchemy.ext.declarative import declared_attr
from .. import db


class BiobrickMixin(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower() + 's'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    part_id = db.Column(db.Integer, default=0)
    short_name = db.Column(db.String, default='unknown')
    nickname = db.Column(db.String, default='unknown')
    description = db.Column(db.String, default='unknown')
    sequence = db.Column(db.String, default='')

    def to_dict(self, with_seq=False):
        result = {'id': self.id, 'name': self.name,
                  'type': self.__class__.__name__.lower(),
                  'part_id': self.part_id, 'short_name': self.short_name,
                  'nickname': self.nickname, 'description': self.description}
        if with_seq:
            result['sequence'] = self.sequence
        return result

from .promoter import Promoter
from .receptor import Receptor
from .output import Output
from .input import Input, _Suggestions
from .logic import Logic
from .RBS import RBS
from .terminator import Terminator
