#!/usr/bin/env python
# encoding: utf-8
import json
from server import db
from server.models import *
from server.models import _Suggestions


def _(obj):
    db.session.add(obj)


def inputs():
    _(Input(input_name='Mercury ions'))
    _(Input(input_name='IPTG'))
    _(Input(input_name='aTc'))
    _(Input(input_name='Arsenic ions'))
    _(Input(input_name='HSL'))
    _(Input(input_name='Tryptophan'))
    _(Input(input_name='Arabinose (without glucose)'))
    _(Input(input_name='PAI'))
    _(Input(input_name='Zinc ions'))
    _(Input(input_name='Sal'))
    _(Input(input_name='hrpR'))
    _(Input(input_name='supD'))
    db.session.commit()


def promoters():
    promoters = [
        ('BBa_R0079',    0.002,   0.001,      1),
        ('BBa_J64712',   0.004,   0.000347,   2),
        ('BBa_R0078',    0.0002,  0.01,       1),
        ('BBa_R0080',    0.00006, 0.01,       1),
        ('BBa_R1062',    0.0005,  0.03,       2),
        ('BBa_K121011',  0.0007,  0.0005,     2),
        ('BBa_K808000',  0.0475,  0.4,        1),
        ('BBa_K091110',  0.07,    0.0013,     1),
        ('BBa_R0040',    0.07,    5.6,        3),
        ('BBa_I756014',  0.12,    0.00000012, 4),
        ('BBa_R1051',    0.17,    0.0002,     1.9),
        ('BBa_I12006',   0.13,    0.2,        1.9),
        ('BBa_R0075',    0.03,    0.2,        1.9),
        ('BBa_R1053',    0.02,    2,          2),
        ('BBa_R0073',    0.28,    0.0000008,  2),
        ('BBa_K091104',  0.2,     80,         2),
        ('BBa_K346002',  0.122,   0.0021,     1.2),
        ('BBa_R006',     0.02,    0.03,       1.5),
        ('BBa_K190016',  0.00022, 0.02,       1),
        ('BBa_K1170000 (high As)', 0.0023,  0.000068,   1),
        ('BBa_K1170000 (low As)', 0.0002,  0.00033,    2),
    ]
    for p in promoters:
        _(Promoter(promoter_name=p[0], gamma=p[1], K=p[2], n=p[3]))
    db.session.commit()


def receptors():
    _(Receptor(receptor_name='BBa_K346001'))
    _(Receptor(receptor_name='BBa_C0012'))
    _(Receptor(receptor_name='BBa_I732100'))
    _(Receptor(receptor_name='BBa_C0040'))
    _(Receptor(receptor_name='AsrD (high As)'))
    _(Receptor(receptor_name='AsrR (low As)'))
    _(Receptor(receptor_name='BBa_C0051'))
    _(Receptor(receptor_name='K1195004'))
    _(Receptor(receptor_name='BBa_C0062'))
    _(Receptor(receptor_name='BBa_K588000'))
    _(Receptor(receptor_name='BBa_K1088017'))
    _(Receptor(receptor_name='BBa_C0079'))
    _(Receptor(receptor_name='ZntR'))
    _(Receptor(receptor_name='NahR'))
    _(Receptor(receptor_name='BBa_K1014000'))
    _(Receptor(receptor_name='T7ptag'))
    db.session.commit()


def suggestions():
    def S(i, r, p, relationship):
        i = Input.query.filter_by(input_name=i).one().input_id
        r = Receptor.query.filter_by(receptor_name=r).one().receptor_id
        p = Promoter.query.filter_by(promoter_name=p).one().promoter_id
        _(_Suggestions(input_id=i, receptor_id=r, promoter_id=p,
                       relationship=relationship))

    S('Mercury ions', 'BBa_K346001', 'BBa_K346002', 'PROMOTE')
    # S('IPTG', 'BBa_C0012', 'BBa_R0010', 'PROMOTE')
    # S('IPTG', 'BBa_I732100', 'BBa_R0010', 'PROMOTE')
    S('aTc', 'BBa_C0040', 'BBa_R0040', 'PROMOTE')
    S('Arsenic ions', 'AsrD (high As)', 'BBa_K1170000 (high As)', 'PROMOTE')
    S('Arsenic ions', 'AsrR (low As)', 'BBa_K1170000 (low As)', 'PROMOTE')

    # S('HSL', 'BBa_C0062', 'BBa_R0063', 'REPRESS')
    # S('Tryptophan', 'BBa_K588000', 'BBa_K588001', 'REPRESS')

    # S('Arabinose (without glucose)', 'BBa_K1088017', 'BBa_I0500', 'PROMOTE')
    S('PAI', 'BBa_C0079', 'BBa_R0079', 'PROMOTE')
    # S('HSL', 'BBa_C0062', 'BBa_R0062', 'PROMOTE')
    S('Zinc ions', 'ZntR', 'BBa_K346002', 'PROMOTE')
    # S('Sal', 'NahR', 'Psal', 'PROMOTE')
    # S('hrpR', 'BBa_K1014000', 'BBa_1014002', 'PROMOTE')
    # S('supD', 'T7ptag', 'PT7', 'PROMOTE')

    db.session.commit()


def outputs():
    _(Output(output_name='RFP'))
    _(Output(output_name='YFP'))
    _(Output(output_name='CFP'))
    _(Output(output_name='GFP'))
    db.session.commit()


def RBSs():
    _(RBS(RBS_name='BBa_B0034', alpha=1))
    _(RBS(RBS_name='BBa_B0072', alpha=0.24))
    _(RBS(RBS_name='BBa_B0073', alpha=1))
    _(RBS(RBS_name='BBa_B0074', alpha=0.84))
    _(RBS(RBS_name='BBa_B0029', alpha=0.08))
    _(RBS(RBS_name='BBa_B0035', alpha=0.116))
    _(RBS(RBS_name='BBa_B0030', alpha=0.9184))
    _(RBS(RBS_name='BBa_B0031', alpha=0.126))
    _(RBS(RBS_name='BBa_B0032', alpha=0.34))
    _(RBS(RBS_name='BBa_J61100', alpha=0.05))
    _(RBS(RBS_name='BBa_J61101', alpha=0.12))
    _(RBS(RBS_name='BBa_J61107', alpha=0.065))
    _(RBS(RBS_name='BBa_J61117', alpha=0.04))
    _(RBS(RBS_name='BBa_J61127', alpha=0.09))
    db.session.commit()


def terminators():
    _(Terminator(terminator_name='BBa_K864600'))
    _(Terminator(terminator_name='BBa_K864601'))
    _(Terminator(terminator_name='BBa_J61048'))
    _(Terminator(terminator_name='BBa_B1001'))
    _(Terminator(terminator_name='BBa_B1002'))
    _(Terminator(terminator_name='BBa_B1003'))
    _(Terminator(terminator_name='BBa_B1004'))
    _(Terminator(terminator_name='BBa_B1005'))
    _(Terminator(terminator_name='BBa_B1006'))
    _(Terminator(terminator_name='BBa_B1007'))
    _(Terminator(terminator_name='BBa_B1008'))
    _(Terminator(terminator_name='BBa_B1009'))
    _(Terminator(terminator_name='BBa_B10010'))
    _(Terminator(terminator_name='BBa_B0024'))
    _(Terminator(terminator_name='BBa_B0025'))
    _(Terminator(terminator_name='BBa_B0023'))
    _(Terminator(terminator_name='BBa_B0012'))
    _(Terminator(terminator_name='BBa_B0011'))
    _(Terminator(terminator_name='BBa_B0022'))
    _(Terminator(terminator_name='BBa_B0014'))
    db.session.commit()


def logics():
    rbs = RBS.query.first().to_dict()
    T = Terminator.query.first().to_dict()
    P = lambda x: Promoter.query.filter_by(promoter_name=x).one().to_dict()
    R = lambda x: Receptor.query.filter_by(receptor_name=x).one().to_dict()
    G = lambda x: {'name': x, 'type': 'output'}

    _(Logic(logic_name='Repressilator-MerR-TetR-Cl_lambda',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_K346002'), rbs, R('BBa_C0040'), T],
                [P('BBa_R0040'), rbs, R('BBa_C0051'), T],
                [P('BBa_R1051'), rbs, R('BBa_K346001'), T]])))

    inverter_data = [('BBa_K346001', 'BBa_K346002'),
                     # ('BBa_C0012', 'BBa_R0010'),
                     # ('BBa_I732100', 'BBa_R0010'),
                     ('BBa_C0040', 'BBa_R0040'),
                     ('AsrD (high As)', 'BBa_K1170000 (high As)'),
                     ('AsrR (low As)', 'BBa_K1170000 (low As)'),
                     # ('BBa_C0062', 'BBa_R0063'),
                     # ('BBa_K588000', 'BBa_K588001'),
                     ('BBa_C0051', 'BBa_R1051'),
                     # ('BBa_K1195004', 'BBa_KI23003')
                     ]
    for i, (gene, promoter) in enumerate(inverter_data):
        _(Logic(logic_name='Inverter %d' % i,
                logic_type='inverter', n_inputs=1, truth_table='TF',
                inputparts=json.dumps([[rbs, R(gene), T]]),
                outputparts=json.dumps([[P(promoter), rbs]])))

    _(Logic(logic_name='Toggle switch 1', logic_type='toggle_switch_1',
            n_inputs=2, inputparts=json.dumps([[rbs], [rbs]]),
            outputparts='[[]]'))

    _(Logic(logic_name='Toggle switch 2 (Cl_lambda)', n_inputs=1,
            logic_type='toggle_switch_2',
            inputparts=json.dumps([[rbs, R('BBa_C0051')], [rbs]]),
            outputparts=json.dumps([[P('BBa_R1051'), rbs], []])))

    _(Logic(logic_name='Simple Logic', n_inputs=1,
            logic_type='simple', truth_table='FT',
            inputparts=json.dumps([[rbs]]), outputparts='[[]]'))

    # _(Logic(logic_name='Toggle switch 2 (Cro)', n_inputs=1,
    #         truth_table='XX', logic_type='toggle_switch_2',
    #         inputparts=json.dumps([[rbs, R('K1195004')], [rbs]]),
    #         outputparts=json.dumps([[P('BBa_KI23003'), rbs], []])))

    db.session.commit()


if __name__ == '__main__':
    # from server import app
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'
    db.drop_all()
    db.create_all()
    inputs()
    promoters()
    receptors()
    suggestions()
    outputs()
    RBSs()
    terminators()
    logics()
