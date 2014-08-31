import uuid


def make_schemes(inputs, outputs, truth_table):
    pass


class _LogicElement(object):
    def __init__(self):
        self.eid = uuid.uuid4().get_hex()

    def __and__(self, other):
        if not isinstance(other, _LogicElement):
            raise TypeError('The second operand is of invalid type')
        return _LogicGate('AND', self, other)

    def __or__(self, other):
        if not isinstance(other, _LogicElement):
            raise TypeError('The second operand is of invalid type')
        return _LogicGate('OR', self, other)

    def __invert__(self):
        return _LogicGate('NOT', self)

    def implement(self, input_map, _and, _or, _not):
        raise NotImplementedError


class _LogicInput(_LogicElement):
    def __init__(self, input_name):
        self.input_name = input_name

    def implement(self, input_map, _and, _or, _not):
        return []


class _LogicGate(_LogicElement):
    def __init__(self, logic, input1, input2=None):
        super(_LogicGate, self).__init__()
        if logic not in ('AND', 'OR', 'NOT'):
            raise ValueError('Invalid logic ' + logic)
        if logic != 'NOT' and input2 is None:
            raise ValueError('Binary logic requires two inputs')
        self.logic = logic
        self.input1 = input1
        self.input2 = input2

    def implement(self, input_map, _and, _or, _not):
        if self.logic == 'AND':
            gate_desc = _and.to_dict(self.eid)
        elif self.logic == 'OR':
            gate_desc = _or.to_dict(self.eid)
        elif self.logic == 'NOT':
            gate_desc = _not.to_dict(self.eid)
        result = [gate_desc]

        if isinstance(self.input1, _LogicGate):
            gate_desc['inputs'] = [self.input1.eid]
            left_op = self.input1.implement(input_map, _and, _or, _not)
            left_op[0]['output'] = self.eid
            result.extend(left_op)
        else:
            gate_desc['inputs'] = [input_map[self.input1.input_name]]

        if isinstance(self.input2, _LogicGate):
            gate_desc['inputs'].append(self.input2.eid)
            right_op = self.input2.implement(input_map, _and, _or, _not)
            right_op[0]['output'] = self.eid
            result.extend(right_op)
        elif self.input2 is not None:
            gate_desc['inputs'].append(input_map[self.input2.input_name])

        return result
