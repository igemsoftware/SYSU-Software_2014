def and_gate(input_rels, output_name, logic, relationships, output_RBS):
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
    reactants = {output_name}

    for i, (rel, input_part) in enumerate(zip(input_rels, logic['inputparts'])):
        inter_gene = receptor_names[1 - i]
        RBS_name = input_part[0]['name']

        _rel = rel.copy()
        _rel['to'] = inter_gene
        relationships.append(_rel)
        if i == 0:
            output_RBS[inter_gene] = RBS_name
        reactants.add(_rel['from'])
        reactants.add(_rel['to'])

        _rel = _rel.copy()
        _rel['from'] = receptor_names[i]
        _rel['type'] = 'REPRESS'
        relationships.append(_rel)

    relationships.append({'from': receptor_names[0], 'to': output_name,
                          'type': 'SIMPLE'})
    output_RBS[output_name] = RBS_name

    return reactants


def toggle_switch_2(input_rels, output_names, logic, relationships, output_RBS):
    reactants = {input_rels[0]['from']}

    input1 = logic['inputparts'][0]
    input2 = logic['inputparts'][1]
    output = logic['outputparts'][0]

    rel = input_rels[0].copy()
    rel['to'] = input1[1]['name']
    relationships.append(rel)
    output_RBS[rel['to']] = input1[0]['name']
    reactants.add(rel['to'])

    promoter = output[0]
    relationships.append({'from': rel['to'], 'to': output_names[0],
                          'type': 'REPRESS', 'gamma': promoter['gamma'],
                          'K': promoter['K'], 'n': promoter['n']})
    output_RBS[output_names[0]] = output[1]['name']
    reactants.add(output_names[0])

    rel = input_rels[0].copy()
    rel['to'] = output_names[1]
    relationships.append(rel)
    output_RBS[rel['to']] = input2[0]['name']
    reactants.add(rel['to'])

    return reactants


def repressilator(input_rels, logic, relationships, output_RBS, outputs):
    _outputs = logic['outputparts']
    reactants = set()
    promoters = []
    RBS_names = []
    output_names = []

    for output in _outputs:
        promoters.append(output[0])
        RBS_names.append(output[1]['name'])
        output_names.append(output[2]['name'])
    reactants.update(output_names)
    outputs.update(output_names)

    for i, (promoter, RBS_name, output_name) in enumerate(
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


def inverter(input_rels, output_name, logic, relationships, output_RBS):
    reactants = {output_name}

    RBS_name = logic['inputparts'][0][0]['name']
    inter_gene = logic['inputparts'][0][1]['name']
    rel = input_rels[0].copy()
    rel['to'] = inter_gene
    relationships.append(rel)
    output_RBS[inter_gene] = RBS_name
    reactants.add(rel['from'])
    reactants.add(inter_gene)

    promoter = logic['outputparts'][0][0]
    RBS_name = logic['outputparts'][0][1]['name']
    relationships.append({'from': inter_gene, 'to': output_name,
                          'type': 'REPRESS', 'gamma': promoter['gamma'],
                          'K': promoter['K'], 'n': promoter['n']})
    output_RBS[output_name] = RBS_name

    return reactants


def simple(input_rels, output_name, logic, relationships, output_RBS):
    rel = input_rels[0].copy()
    rel['to'] = output_name
    relationships.append(rel)
    output_RBS[rel['to']] = logic['inputparts'][0][0]['name']

    return {rel['from'], rel['to']}


def or_gate(input_rels, output_name, logic, relationships, output_RBS):
    reactants = {input_rels[0]['from'], input_rels[1]['from'], output_name}
    for r in input_rels:
        _r = r.copy()
        _r['to'] = output_name
        relationships.append(_r)
    output_RBS[output_name] = logic['inputparts'][0][0]['name']
    return reactants
