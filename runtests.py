#!/usr/bin/env python
# encoding: utf-8
import nose
import sys


if __name__ == '__main__':
    argv = sys.argv[:]
    defaults = ['--with-coverage', '--cover-branches', '--cover-html',
                '--cover-package=server']
    for a in defaults:
        if a not in argv:
            argv.append(a)
    nose.main(argv=argv)
