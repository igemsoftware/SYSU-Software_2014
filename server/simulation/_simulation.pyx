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
    cdef list[double] parameters

    reactants, relationships = analyse_device(device)
    reactants_idx = {}
    x0 = []
    for i, r in enumerate(reactants):
        reactants_idx[r] = i
        x0.append(initial_c.get(r, 0.0))

    simulator = new Simulator(len(reactants))
    for r in relationships:
        if r['type'] == 'PROMOTE':
            parameters = [r['alpha'], 0.0, 0.0, 0.0, 0.0]
            simulator.relationship(PROMOTE, reactants_idx[r['to']],
                                   parameters)
        elif r['type'] == 'REPRESS':
            parameters = [r['alpha'], 0.0, 0.0, 0.0, 0.0]
            simulator.relationship(REPRESS, reactants_idx[r['to']],
                                   parameters)

    result = simulator.simulate(x0, t)
    del simulator
    return result


cdef analyse_device(dict device):
    cdef set reactants = set()
    cdef list relationships = []
    cdef list input_relationships
    cdef dict output_alpha = {}
    cdef int i
    cdef double alpha

    for circuit in device['circuits']:
        input_relationships = []
        for i, _input in enumerate(circuit['inputs']):
            for x in _input:
                if x['type'] == 'input':
                    reactants.add(x['name'])
                    input_relationships.append({'from': x['name'],
                                                'type': x['relationship']})
                    break

        for logic in circuit['logics']:
            for i, _input in enumerate(logic['inputparts']):
                for x in _input:
                    if x['type'] == 'RBS':
                        alpha = x['alpha']
                        break

                for x in _input:
                    if x['type'] == 'output':
                        reactants.add(x['name'])
                        rel = input_relationships[i].copy()
                        rel['to'] = x['name']
                        rel['alpha'] = alpha
                        relationships.append(rel)

            for _output in logic['outputparts']:
                for x in _output:
                    if x['type'] == 'RBS':
                        alpha = x['alpha']
                        break

                for x in _output:
                    if x['type'] == 'output':
                        output_alpha[x['name']] = alpha
                        reactants.add(x['name'])

            for r in logic.get('relationships', []):
                r['alpha'] = output_alpha[r['to']]
                relationships.append(r)

    return list(reactants), relationships
