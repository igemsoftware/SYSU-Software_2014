import json
from flask import request, jsonify
from .. import app
from ..models import _OutputPromoterRelationship


@app.route('/device/build_relationships', methods=['POST'])
def device_build_relationships():
    circuits = json.loads(request.data)

    promoters = {}
    outputs = []
    for i, circuit in enumerate(circuits):
        # Check the outputs of the first logic only
        for input in circuit['logics'][0]['inputparts']:
            for element in input:
                if element['type'] == 'promoter':
                    element = element.copy()
                    element['circuit_id'] = i
                    promoters.setdefault(element['id'], []).append(element)

        for logic in circuit['logics']:
            for output in logic['outputparts']:
                for element in output:
                    if element['type'] == 'output':
                        element = element.copy()
                        element['circuit_id'] = i
                        outputs.append(element)

    relationships = []
    for output in outputs:
        rs = _OutputPromoterRelationship.query.filter_by(
            output_id=output['id'])
        for r in rs:
            if r.promoter_id in promoters:
                for p in promoters[r.promoter_id]:
                    if output['circuit_id'] != p['circuit_id']:
                        relationships.append({
                            'from': output['eid'],
                            'to': p['eid'],
                            'type': r.relationship
                        })

    return jsonify(circuits=circuits, relationships=relationships)
