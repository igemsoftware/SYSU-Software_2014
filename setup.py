#!/usr/bin/env python
# encoding: utf-8
from distutils.core import setup, Extension
from Cython.Build import cythonize

setup(ext_modules=cythonize(
    Extension('server.simulation._simulation',
              ['server/simulation/_simulation.pyx',
               'server/simulation/_simulator_class.cpp'],
              language='c++', extra_compile_args=['-std=c++11'])))
