# disutils: language=c++
"""
The simulator module of FLAME.

This module provides a ``Simulator`` class to simulate arbitrary biological pathways
as long as they can be modeled as some sets of regulatory relationships supported
by FLAME, including ``PROMOTE``, ``REPRESS``, ``BIPROMOTE``.
"""
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
    """
    The ``Simulator`` class.

    A simulator object must be initialized with the number of kinds of reactant.

    For example:

    >>> from simulator import Simulator
    >>> s = Simulator(5)
    >>> s.relationship('PROMOTE', 0, 1, [1.0, 8.3e-2, 2e-3, 1e-3, 1.0])
    >>> s.relationship('PROMOTE', 2, 3, [1.0, 8.3e-2, 1.2e-1, 2.1e-1, 1.2])
    >>> s.relationship('BIPROMOTE', 1, 3, 4, [1.0, 8.3e-2, 0.0, 1.0, 1.0])
    >>> s.simulate([1e-2, 1e-2, 0, 0, 0], 100)
    """
    cdef _Simulator *thisptr

    def __cinit__(self, n):
        self.thisptr = new _Simulator(n)

    def __dealloc__(self):
        del self.thisptr

    def relationship(self, *args):
        """
        Add a regulatory relationship between two kinds of reactant.

        :param str type: The type of regulatory relationship.

            ``'PROMOTE'`` means Reactant 1 promotes Reactant 2.
            ``'REPRESS'`` means Reactant 1 represses Reactant 2.
            ``'BIPROMOTE'`` means Reactant 1 and Reactant 2 promote Reactant 3.
        :param int reactant_1:
            The index of Reactant 1 (starting from 0).
        :param int reactant_2:
            The index of Reactant 2 (starting from 0).
        :param reactant_3:
            The index of Reactant 3 (starting from 0).
        :type reactant_3: int (optional)
        :param list parameters:
            A list of the required parameters of the reaction. It should be
            in the form of ``[alpha, beta, gamma, K, n]``.
        """
        if args[0] in ('PROMOTE', 'BIREPRESS'):
            self.thisptr.relationship(PROMOTE, args[1], args[2], args[3])
        elif args[0] == 'REPRESS':
            self.thisptr.relationship(REPRESS, args[1], args[2], args[3])
        elif args[0] == 'SIMPLE':
            self.thisptr.relationship(SIMPLE, args[1], args[2], args[3])
        elif args[0] == 'BIPROMOTE':
            self.thisptr.relationship(BIPROMOTE,
                                      args[1], args[2], args[3], args[4])

    def simulate(self, x0, t):
        """
        Start the simulation. You must add some relationships before the simulation.

        :param list x0:
            A list of the initial concentration of all kinds of reactant.
        :param float t:
            The simulation time.

        :rtype: list
        :return result:
            ``result[i]`` is a 2-tuple indicating the state of reaction at the i'th moment.
            ``result[i][0]`` is the time, and ``result[i][1]`` is a list of the concentration
            of the reactant at that moment.
        """
        return self.thisptr.simulate(x0, t)
