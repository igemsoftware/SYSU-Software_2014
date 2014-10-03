from flask import render_template
from .. import app

@app.route('/')
def index():
    return render_template('circuit.html')

@app.route('/<path>')
def goto(path):
    return render_template(path + '.html')

from . import biobrick
from . import circuit
from . import simulation
