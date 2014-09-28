# disutils: language=c++
from libcpp.vector cimport vector
from libcpp.utility cimport pair

cdef extern from "_simulator_class.h":
    enum RELATIONSHIP_TYPE:
        PROMOTE, REPRESS

    ctypedef vector[double] STATE_t

    cdef cppclass Simulator:
        Simulator(int n) except +
        void relationship(RELATIONSHIP_TYPE type, int A, int B, vector[double] parameters)
        vector[pair[double, double]] simulate(STATE_t x0)
