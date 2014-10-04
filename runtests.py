#!/usr/bin/env python
# encoding: utf-8
import nose
import sys
from distutils.core import run_setup


if __name__ == '__main__':
    argv = sys.argv[:]
    run_setup('setup.py', ['build_ext', '-i'])
    defaults = ['--with-coverage', '--cover-branches', '--cover-html',
                '--cover-package=server', '--cover-package=tests',
                '--cover-erase', '--cover-tests']
    for a in defaults:
        if a not in argv:
            argv.append(a)
    nose.main(argv=argv)
