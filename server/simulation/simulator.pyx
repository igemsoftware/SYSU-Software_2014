# disutils: language=c++
from libc.stddef cimport size_t
from libcpp.vector cimport vector
from libcpp.utility cimport pair

cdef extern from "_simulator.h":
    enum RELATIONSHIP_TYPE:
        SIMPLE, PROMOTE, REPRESS, BIPROMOTE

    ctypedef vector[double] STATE_t

    cdef cppclass _Simulator:
        _Simulator(int n) except +
        void relationship(RELATIONSHIP_TYPE type, size_t _from, size_t to,
                          vector[double] parameters) except +
        void relationship(RELATIONSHIP_TYPE type, size_t from_1, size_t from_2,
                          size_t to, vector[double] parameters) except +
        vector[pair[double, STATE_t]] simulate(STATE_t x0, double t) except +


cdef class Simulator:
    cdef _Simulator *thisptr

    def __cinit__(self, n):
        self.thisptr = new _Simulator(n)

    def __dealloc__(self):
        del self.thisptr

    def relationship(self, *args):
        if args[0] == 'PROMOTE':
            self.thisptr.relationship(PROMOTE, args[1], args[2], args[3])
        elif args[0] == 'REPRESS':
            self.thisptr.relationship(REPRESS, args[1], args[2], args[3])
        elif args[0] == 'SIMPLE':
            self.thisptr.relationship(SIMPLE, args[1], args[2], args[3])
        elif args[0] == 'BIPROMOTE':
            self.thisptr.relationship(BIPROMOTE,
                                      args[1], args[2], args[3], args[4])

    def simulate(self, x0, t):
        return self.thisptr.simulate(x0, t)
