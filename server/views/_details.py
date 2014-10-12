from ..models import Receptor


def toggle_switch_1(receptors, promoters, output, logic, terminator):
    receptors = [Receptor.query.get(r['id']).to_dict(True, True)
                 for r in receptors]
    logic['inputparts'][0].insert(0, promoters[0])
    logic['inputparts'][0].append(receptors[1])
    logic['inputparts'][0].append(terminator)

    logic['inputparts'][1].insert(0, promoters[1])
    logic['inputparts'][1].append(receptors[0])
    logic['inputparts'][1].append(output)
    logic['inputparts'][1].append(terminator)

    return logic


def toggle_switch_2(promoter, outputs, logic, terminator):
    logic['inputparts'][0].insert(0, promoter)

    logic['inputparts'][1].insert(0, promoter)
    logic['inputparts'][1].append(outputs[1])
    logic['inputparts'][1].append(terminator)

    logic['outputparts'][0].append(outputs[0])
    logic['outputparts'][0].append(terminator)

    return logic


def simple(promoter, output, logic, terminator):
    logic['inputparts'][0].insert(0, promoter)
    logic['inputparts'][0].append(output)
    logic['inputparts'][0].append(terminator)

    return logic


def or_gate(promoters, output, logic, terminator):
    logic['inputparts'][0].insert(0, promoters[0])
    logic['inputparts'][0].append(output)
    logic['inputparts'][0].append(terminator)

    logic['inputparts'][1].insert(0, promoters[1])
    logic['inputparts'][1].append(output)
    logic['inputparts'][1].append(terminator)

    return logic


def other(promoters, output, logic, terminator):
    for p, i in zip(promoters, logic['inputparts']):
        i.insert(0, p)
    logic['outputparts'][0].append(output)
    logic['outputparts'][0].append(terminator)

    return logic
