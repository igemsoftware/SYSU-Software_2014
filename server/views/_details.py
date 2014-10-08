def toggle_switch_1(receptors, promoters, output, logic, T_obj):
    logic['inputparts'][0].insert(0, promoters[0])
    logic['inputparts'][0].append(receptors[1])
    logic['inputparts'][0].append(T_obj.to_dict(True))

    logic['inputparts'][1].insert(0, promoters[1])
    logic['inputparts'][1].append(receptors[0])
    logic['inputparts'][1].append(output)
    logic['inputparts'][1].append(T_obj.to_dict(True))

    return logic


def toggle_switch_2(promoter, outputs, logic, T_obj):
    logic['inputparts'][0].insert(0, promoter)

    logic['inputparts'][1].insert(0, promoter)
    logic['inputparts'][1].append(outputs[1])
    logic['inputparts'][1].append(T_obj.to_dict(True))

    logic['outputparts'][0].append(outputs[0])
    logic['outputparts'][0].append(T_obj.to_dict(True))

    return logic


def simple(promoter, output, logic, T_obj):
    logic['inputparts'][0].insert(0, promoter)
    logic['inputparts'][0].append(output)
    logic['inputparts'][0].append(T_obj.to_dict(True))

    return logic


def other(promoters, output, logic, T_obj):
    for p, i in zip(promoters, logic['inputparts']):
        i.insert(0, p)
    logic['outputparts'][0].append(output)
    logic['outputparts'][0].append(T_obj.to_dict(True))

    return logic
