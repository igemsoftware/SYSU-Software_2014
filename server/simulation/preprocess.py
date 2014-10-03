def and_gate(input_rels, output_name, logic, relationships, output_RBS):
    if logic['logic_type'] != 'and_gate':
        raise ValueError('Invalid logic type')

    inter_genes = []
    reactants = set()

    for rel, input_part in zip(input_rels, logic['inputparts']):
        RBS_name = input_part[0]['name']
        to = input_part[1]['name']

        _rel = rel.copy()
        _rel['to'] = to
        relationships.append(_rel)
        output_RBS[to] = RBS_name
        reactants.add(_rel['from'])
        reactants.add(_rel['to'])

        inter_genes.append(to)

    output_part = logic['outputparts'][0]
    promoter = output_part[0]
    RBS_name = output_part[1]['name']

    relationships.append({'from_1': inter_genes[0], 'from_2': inter_genes[1],
                          'to': output_name, 'type': 'BIPROMOTE',
                          'gamma': promoter['gamma'], 'K': promoter['K'],
                          'n': promoter['n']})
    output_RBS[output_name] = RBS_name
    reactants.add(output_name)

    return reactants


def toggle_switch_1(input_rels, receptor_names, output_name, logic,
                  relationships, output_RBS):
    if logic['logic_type'] != 'toggle_switch_1':
        raise ValueError('Invalid logic type')

    reactants = set()

    for i, rel, input_part in enumerate(zip(input_rels, logic['inputparts'])):
        inter_gene = receptor_names[1 - i]
        RBS_name = input_part[0]['name']

        _rel = rel.copy()
        _rel['to'] = inter_gene
        relationships.append(_rel)
        output_RBS[inter_gene] = RBS_name
        reactants.add(_rel['from'])
        reactants.add(_rel['to'])

        _rel = _rel.copy()
        _rel['from'] = receptor_names[i]
        _rel['type'] = 'REPRESS'
        relationships.append(_rel)

    relationships.append({'from': receptor_names[0], 'to': output_name,
                          'type': 'SIMPLE'})

    return reactants


def repressilator(input_rels, logic, relationships, output_RBS):
    if logic['logic_type'] != 'repressilator':
        raise ValueError('Invalid logic type')

    outputs = logic['outputparts']
    reactants = set()
    promoters = []
    RBS_names = []
    output_names = []

    for output in outputs:
        promoters.append(output[0])
        RBS_names.append(output[1]['name'])
        output_names.append(output[2]['name'])
    reactants.union(output_names)

    for i, promoter, RBS_name, output_name in enumerate(
            zip(promoters, RBS_names, output_names)):
        rel = {'from': output_names[(i - 1) % 3], 'to': output_name,
               'type': 'REPRESS', 'gamma': promoter['gamma'],
               'K': promoter['K'], 'n': promoter['n']}
        relationships.append(rel)
        output_RBS[output_name] = RBS_name

    rel = input_rels[0].copy()
    rel['to'] = output_names[0]
    relationships.append(rel)
    reactants.add(rel['from'])

    return reactants
