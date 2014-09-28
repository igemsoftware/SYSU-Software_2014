#!/usr/bin/env python
# encoding: utf-8
from distutils.core import setup, Extension
from Cython.Build import cythonize

setup(ext_modules=cythonize(
    Extension('_simulation',
              ['_simulation.pyx', '_simulator_class.cpp'],
              language='c++', extra_compile_args=['-std=c++11'])))
