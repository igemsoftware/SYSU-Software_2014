# disutils: language=c++
from libc.stddef cimport size_t
from libcpp.vector cimport vector
from libcpp.utility cimport pair

cdef extern from "_simulator_class.h":
    enum RELATIONSHIP_TYPE:
        PROMOTE, REPRESS

    ctypedef vector[double] STATE_t

    cdef cppclass Simulator:
        Simulator(int n) except +
        void relationship(RELATIONSHIP_TYPE type, size_t other, vector[double] parameters) except +
        vector[pair[double, STATE_t]] simulate(STATE_t x0, double t) except +


def simulate(dict device, dict initial_c, double t):
    cdef int i
    cdef list reactants, relationships, x0
    cdef dict reactants_idx
    cdef Simulator *simulator

    reactants, relationships = analyse_device(device)
    reactants_idx = {}
    x0 = []
    for i, r in enumerate(reactants):
        reactants_idx[r] = i
        x0.append(initial_c.get(r, 0.0))

    cdef list[double] _test_parameters = [0.0, 0.0, 0.0, 0.0, 0.0]
    simulator = new Simulator(len(reactants))
    for r in relationships:
        if r['type'] == 'promote':
            simulator.relationship(PROMOTE, reactants_idx[r['to']],
                                   _test_parameters)
        elif r['type'] == 'repress':
            simulator.relationship(REPRESS, reactants_idx[r['to']],
                                   _test_parameters)

    return simulator.simulate(x0, t)


cdef analyse_device(dict device):
    cdef set reactants = set()
    cdef list relationships = []
    cdef dict eid_reactant_map = {}

    for circuit in device['circuits']:
        for _input in circuit['inputs']:
            for x in _input:
                if x['type'] == 'input':
                    reactants.add(x['name'])
                    eid_reactant_map.setdefault(x['eid'], []).append(x['name'])

        for logic in circuit['logics']:
            for _input in logic['inputparts']:
                for x in _input:
                    if x['type'] == 'promoter':
                        promoter_eid = x['eid']
                        break

                for x in _input:
                    if x['type'] == 'output':
                        reactants.add(x['name'])
                        eid_reactant_map.setdefault(promoter_eid, []).\
                            append(x['name'])

            for _output in logic['outputparts']:
                for x in _output:
                    if x['type'] == 'output':
                        reactants.add(x['name'])
                        eid_reactant_map.setdefault(x['eid'], []).\
                            append(x['name'])

            if 'relationships' in logic:
                relationships.extend(logic['relationships'])

    for r in device['relationships']:
        _from = eid_reactant_map[r['from']][0]
        for _to in eid_reactant_map[r['to']]:
            relationships.append({'from': _from, 'to': _to, 'type': r['type']})

    return list(reactants), relationships
