from flask import jsonify, abort, request
from .. import app, db
from ..models import Input, Output, Promoter, Receptor, RBS, Terminator,\
    Logic, _Suggestions


@app.route('/biobrick/<type>')
def get_biobrick_list(type):
    if type == 'input':
        m = Input
    elif type == 'output':
        m = Output
    elif type == 'promoter':
        m = Promoter
    elif type == 'receptor':
        m = Receptor
    elif type == 'RBS':
        m = RBS
    elif type == 'terminator':
        m = Terminator
    elif type == 'logic':
        m = Logic
    else:
        abort(400)

    if 'id' in request.args:
        return jsonify(result=m.query.get_or_404(request.args['id']).to_dict())
    else:
        if type == 'RBS':
            q = m.query.order_by(RBS.alpha)
        else:
            q = m.query
        return jsonify(result=[x.to_dict() for x in q])


@app.route('/biobrick/suggest/promoters')
def suggest_promoters():
    result = set()
    i = Input.query.get_or_404(request.args['input_id'])
    s_query = i.suggestions.options(db.joinedload(_Suggestions.promoter))
    for x in s_query:
        result.add(x.promoter)
    return jsonify(result=list(x.to_dict() for x in result))


@app.route('/biobrick/suggest/receptors')
def suggest_receptors():
    result = []
    i = Input.query.get_or_404(request.args['input_id'])
    s_query = i.suggestions.options(db.joinedload(_Suggestions.receptor))
    for x in s_query.filter_by(promoter_id=request.args['promoter_id']):
        result.append(x.receptor.to_dict())
    return jsonify(result=result)


@app.route('/biobrick/search/<type>/<keyword>')
def biobrick_search(type, keyword):
    if type == 'receptor':
        m = Receptor
    elif type == 'promoter':
        m = Promoter
    elif type == 'input':
        m = Input
    elif type == 'output':
        m = Output
    else:
        abort(400)

    q = m.query.filter(
        m.name.contains(keyword) | m.description.contains(keyword))
    return jsonify(result=[x.to_dict() for x in q])
