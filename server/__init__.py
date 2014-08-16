from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from . import config

from sqlalchemy.engine import Engine
from sqlalchemy import event


# deal with the sqlite3 foreign key issue
@event.listens_for(Engine, 'connect')
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute('PRAGMA foreign_keys=ON')
    cursor.close()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_ECHO'] = config.DEBUG
db = SQLAlchemy(app)

from . import views
