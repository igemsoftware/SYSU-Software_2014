from flask import render_template, redirect, url_for
from .. import app

@app.route('/')
def index():
    return render_template('circuit.html')
@app.route('/<path>')
def goto(path):
    pages = ["circuit", "shape", "simulation", "experiment", "help"];
    for page in pages:
        if path == page:
            return render_template(path + '.html')
    return render_template('circuit.html')

from . import biobrick
from . import design
from . import simulation
