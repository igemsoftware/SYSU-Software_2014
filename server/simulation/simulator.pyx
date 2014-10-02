# disutils: language=c++
from libc.stddef cimport size_t
from libcpp.vector cimport vector
from libcpp.utility cimport pair

cdef extern from "_simulator.h":
    enum RELATIONSHIP_TYPE:
        PROMOTE, REPRESS

    ctypedef vector[double] STATE_t

    cdef cppclass _Simulator:
        _Simulator(int n) except +
        void relationship(RELATIONSHIP_TYPE type, size_t _from, size_t to,
                          vector[double] parameters) except +
        vector[pair[double, STATE_t]] simulate(STATE_t x0, double t) except +


cdef class Simulator:
    cdef _Simulator *thisptr

    def __cinit__(self, n):
        self.thisptr = new _Simulator(n)

    def __dealloc__(self):
        del self.thisptr

    def relationship(self, type, _from, to, parameters):
        if type == 'PROMOTE':
            self.thisptr.relationship(PROMOTE, _from, to, parameters)
        elif type == 'REPRESS':
            self.thisptr.relationship(REPRESS, _from, to, parameters)

    def simulate(self, x0, t):
        return self.thisptr.simulate(x0, t)
