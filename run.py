#!/usr/bin/env python
# encoding: utf-8
import sys
import webbrowser
from gevent.wsgi import WSGIServer
from server import app


if __name__ == '__main__':
    if '-s' not in sys.argv:
        server = WSGIServer(('localhost', 5000), app)
        server.start()
        webbrowser.open('http://localhost:5000')
    else:
        server = WSGIServer(('0.0.0.0', 5000), app)
    server.serve_forever()  # just wait but not start the server *again*
