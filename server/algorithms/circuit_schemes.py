import uuid
import itertools
from ..models import Component


class _LogicElement(object):
    def __init__(self):
        pass

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

    def get_all_gates(self):
        raise NotImplementedError

    def requires(self):
        raise NotImplementedError


class _LogicInput(_LogicElement):
    def __init__(self, input_name):
        self.input_name = input_name

    def __repr__(self):
        return '<%s>' % self.input_name

    def get_all_gates(self):
        return set()

    def requires(self):
        return set()


class _LogicGate(_LogicElement):
    def __init__(self, logic, input1, input2=None):
        if logic not in ('AND', 'OR', 'NOT'):
            raise ValueError('Invalid logic ' + logic)
        if logic != 'NOT' and input2 is None:
            raise ValueError('Binary logic requires two inputs')
        self.logic = logic
        self.input1 = input1
        self.input2 = input2

    def __eq__(self, other):
        if not isinstance(other, _LogicGate):
            return False
        return self.logic == other.logic and \
            self.input1 == other.input1 and self.input2 == other.input2

    def __hash__(self):
        s = '%d%d%d%d' % (hash(_LogicGate), hash(self.logic),
                          hash(self.input1), hash(self.input2))
        return hash(s)

    def __repr__(self):
        if self.logic == 'NOT':
            return '(NOT %s)' % repr(self.input1)
        else:
            return '(%s %s %s)' % (repr(self.input1), self.logic,
                                   repr(self.input2))

    def get_all_gates(self):
        gates = {self}
        if isinstance(self.input1, _LogicGate):
            gates.update(self.input1.get_all_gates())
        if isinstance(self.input2, _LogicGate):
            gates.update(self.input2.get_all_gates())
        return gates

    def requires(self):
        result = {self.logic}
        if isinstance(self.input1, _LogicGate):
            result.update(self.input1.requires())
        if isinstance(self.input2, _LogicGate):
            result.update(self.input2.requires())
        return result


def logic_impelment(logic_exps, input_map, gates):
    all_gates = set()
    for l in logic_exps:
        all_gates.update(l.get_all_gates())
    all_gates = list(all_gates)

    eid_dict = {}
    for g in all_gates:
        if g not in eid_dict:
            eid_dict[g] = uuid.uuid4().get_hex()

    result = []
    for g in all_gates:
        gate_desc = gates[g.logic].to_dict(eid_dict[g])

        if isinstance(g.input1, _LogicGate):
            gate_desc['inputs'] = [eid_dict[g.input1]]
        else:
            gate_desc['inputs'] = [input_map[g.input1]]

        if isinstance(g.input2, _LogicGate):
            gate_desc['inputs'].append(eid_dict[g.input2])
        elif g.input2 is not None:
            gate_desc['inputs'].append(input_map[g.input2])

        result.append(gate_desc)

    outputs = []
    for l in logic_exps:
        if isinstance(l, _LogicGate):
            outputs.append(eid_dict[l])
        elif isinstance(l, _LogicInput):
            outputs.append(input_map[l])

    return {'logic_gates': result, 'outputs': outputs}


def logic_require(logic_exps):
    gates = set()
    for l in logic_exps:
        gates.update(l.requires())
    return gates


A = _LogicInput('A')
B = _LogicInput('B')
_LOGIC_ONE_INPUT = [_LogicElement(), A, ~A, _LogicElement()]
_LOGIC_TWO_INPUT = [
    _LogicElement(),
    A & B,
    A & ~B,
    A,
    ~A & B,
    B,
    [(~A & B) | (A & ~B), (~A | ~B) & (A | B)],
    A | B,
    ~(A | B),
    [(A & B) | (~A & ~B), (A | ~B) & (~A | B)],
    ~B,
    A | ~B,
    ~A,
    ~A | B,
    ~(A & B),
    _LogicElement()
]


def validate_truth_table(n_input, n_output, truth_table):
    pass


def make_schemes(inputs, outputs, truth_table):
    validate_truth_table(len(inputs), len(outputs), truth_table)
    truth_table.sort(key=lambda x: x['inputs'])
    logic_exp_lists = []
    for i, output in enumerate(outputs):
        idx_orig = [x['outputs'][i] for x in truth_table]
        idx = 0
        for k in idx_orig:
            idx = (idx << 1) | k

        if len(inputs) == 1:
            logic = _LOGIC_ONE_INPUT[idx]
            input_map = {A: inputs[0]['eid']}
        elif len(inputs) == 2:
            logic = _LOGIC_TWO_INPUT[idx]
            input_map = {A: inputs[0]['eid'], B: inputs[1]['eid']}

        if isinstance(logic, list):
            logic_exp_lists.append(logic)
        else:
            logic_exp_lists.append([logic])

    gate_impl = {'AND': Component.query.filter(Component.logic == 'AND').all(),
                 'OR': Component.query.filter(Component.logic == 'OR').all(),
                 'NOT': Component.query.filter(Component.logic == 'NOT').all()}
    result = []
    for logic_exps in itertools.product(*logic_exp_lists):
        require = list(logic_require(logic_exps))
        require_impl = [gate_impl[r] for r in require]
        for an_impl in itertools.product(*require_impl):
            result.append(logic_impelment(
                logic_exps, input_map, dict(zip(require, an_impl))))

    return result
