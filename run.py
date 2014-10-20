#!/usr/bin/env python
# encoding: utf-8
import webbrowser
from gevent.wsgi import WSGIServer
from server import app


if __name__ == '__main__':
    server = WSGIServer(('localhost', 5000), app)
    server.start()
    webbrowser.open('http://localhost:5000')
    server.serve_forever()  # just wait but not start the server *again*
