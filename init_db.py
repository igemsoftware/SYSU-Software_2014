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
    _(Input(input_name='Blue light'))
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
        ('BBa_R0040',    0.07,    0.0056,     3),
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
        ('BBa_I712074',  0.0,     1.0,        1),
        ('BBa_R0010',    0.03,    5.4e-4,     2),
        ('BBa_R0063',    0.02,    3.2e-2,     2),
        ('BBa_K588001',  0.07,    3.9e-3,     2),
        ('BBa_I0500',    0.06,    8.3e-4,     1),
        ('BBa_R0062',    0.07,    3.3e-2,     2),
        ('BBa_K1014002', 0.08,    4.8e-4,     1),
        ('BBa_KI23003',  0.02,    6.4e-3,     1),
        ('BBa_K360023',  0.02,    6.4e-3,     1),
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
    _(Receptor(receptor_name='BBa_K1195004'))
    _(Receptor(receptor_name='BBa_K360121'))
    db.session.commit()


def suggestions():
    def S(i, r, p, relationship):
        i = Input.query.filter_by(input_name=i).one().input_id
        r = Receptor.query.filter_by(receptor_name=r).one().receptor_id
        p = Promoter.query.filter_by(promoter_name=p).one().promoter_id
        _(_Suggestions(input_id=i, receptor_id=r, promoter_id=p,
                       relationship=relationship))

    S('Mercury ions', 'BBa_K346001', 'BBa_K346002', 'BIREPRESS')
    S('IPTG', 'BBa_C0012', 'BBa_R0010', 'BIREPRESS')
    S('IPTG', 'BBa_I732100', 'BBa_R0010', 'BIREPRESS')
    S('aTc', 'BBa_C0040', 'BBa_R0040', 'BIREPRESS')
    S('Arsenic ions', 'AsrD (high As)', 'BBa_K1170000 (high As)', 'BIREPRESS')
    S('Arsenic ions', 'AsrR (low As)', 'BBa_K1170000 (low As)', 'BIREPRESS')

    S('HSL', 'BBa_C0062', 'BBa_R0063', 'REPRESS')
    S('Tryptophan', 'BBa_K588000', 'BBa_K588001', 'REPRESS')
    S('Blue light', 'BBa_K360121', 'BBa_K360023', 'REPRESS')

    S('Arabinose (without glucose)', 'BBa_K1088017', 'BBa_I0500', 'PROMOTE')
    S('PAI', 'BBa_C0079', 'BBa_R0079', 'PROMOTE')
    S('HSL', 'BBa_C0062', 'BBa_R0062', 'PROMOTE')
    S('Zinc ions', 'ZntR', 'BBa_K346002', 'PROMOTE')
    # S('Sal', 'NahR', 'Psal', 'PROMOTE')
    S('hrpR', 'BBa_K1014000', 'BBa_K1014002', 'PROMOTE')
    S('supD', 'T7ptag', 'BBa_I712074', 'PROMOTE')

    db.session.commit()


def outputs():
    _(Output(output_name='RFP'))
    _(Output(output_name='YFP'))
    _(Output(output_name='CFP'))
    _(Output(output_name='GFP'))
    db.session.commit()


def RBSs():
    _(RBS(RBS_name='BBa_B0034',   alpha=1))
    _(RBS(RBS_name='BBa_B0033',   alpha=0.01))
    _(RBS(RBS_name='BBa_B0072',   alpha=0.24))
    _(RBS(RBS_name='BBa_B0073',   alpha=1))
    _(RBS(RBS_name='BBa_B0074',   alpha=0.84))
    _(RBS(RBS_name='BBa_B0029',   alpha=0.08))
    _(RBS(RBS_name='BBa_B0035',   alpha=0.116))
    _(RBS(RBS_name='BBa_B0030',   alpha=0.9184))
    _(RBS(RBS_name='BBa_B0031',   alpha=0.126))
    _(RBS(RBS_name='BBa_B0032',   alpha=0.34))
    _(RBS(RBS_name='BBa_J01010',  alpha=0.1136))
    _(RBS(RBS_name='BBa_J01080',  alpha=0.34))
    _(RBS(RBS_name='BBa_J63003',  alpha=0.714))
    _(RBS(RBS_name='BBa_K165002', alpha=0.326))
    _(RBS(RBS_name='BBa_J61100',  alpha=0.047513))
    _(RBS(RBS_name='BBa_J61101',  alpha=0.119831))
    _(RBS(RBS_name='BBa_J61102',  alpha=0.098594))
    _(RBS(RBS_name='BBa_J61103',  alpha=0.089778))
    _(RBS(RBS_name='BBa_J61104',  alpha=0.112321))
    _(RBS(RBS_name='BBa_J61105',  alpha=0.023423))
    _(RBS(RBS_name='BBa_J61106',  alpha=0.076879))
    _(RBS(RBS_name='BBa_J61107',  alpha=0.065))
    _(RBS(RBS_name='BBa_J61108',  alpha=0.098899))
    _(RBS(RBS_name='BBa_J61109',  alpha=0.056455))
    _(RBS(RBS_name='BBa_J61110',  alpha=0.067689))
    _(RBS(RBS_name='BBa_J61111',  alpha=0.088756))
    _(RBS(RBS_name='BBa_J61112',  alpha=0.073845))
    _(RBS(RBS_name='BBa_J61113',  alpha=0.023847))
    _(RBS(RBS_name='BBa_J61114',  alpha=0.034533))
    _(RBS(RBS_name='BBa_J61115',  alpha=0.043566))
    _(RBS(RBS_name='BBa_J61116',  alpha=0.132344))
    _(RBS(RBS_name='BBa_J61117',  alpha=0.038518))
    _(RBS(RBS_name='BBa_J61118',  alpha=0.045644))
    _(RBS(RBS_name='BBa_J61119',  alpha=0.012389))
    _(RBS(RBS_name='BBa_J61120',  alpha=0.034985))
    _(RBS(RBS_name='BBa_J61121',  alpha=0.086997))
    _(RBS(RBS_name='BBa_J61122',  alpha=0.087594))
    _(RBS(RBS_name='BBa_J61123',  alpha=0.096894))
    _(RBS(RBS_name='BBa_J61124',  alpha=0.099876))
    _(RBS(RBS_name='BBa_J61125',  alpha=0.096895))
    _(RBS(RBS_name='BBa_J61126',  alpha=0.099854))
    _(RBS(RBS_name='BBa_J61127',  alpha=0.087334))
    _(RBS(RBS_name='BBa_J61128',  alpha=0.122343))
    _(RBS(RBS_name='BBa_J61129',  alpha=0.122312))
    _(RBS(RBS_name='BBa_J61130',  alpha=0.086564))
    _(RBS(RBS_name='BBa_J61131',  alpha=0.093335))
    _(RBS(RBS_name='BBa_J61132',  alpha=0.123223))
    _(RBS(RBS_name='BBa_J61133',  alpha=0.037862))
    _(RBS(RBS_name='BBa_J61134',  alpha=0.055658))
    _(RBS(RBS_name='BBa_J61135',  alpha=0.058872))
    _(RBS(RBS_name='BBa_J61136',  alpha=0.059871))
    _(RBS(RBS_name='BBa_J61137',  alpha=0.054521))
    _(RBS(RBS_name='BBa_J61138',  alpha=0.055466))
    _(RBS(RBS_name='BBa_J61139',  alpha=0.057656))
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

    _(Logic(logic_name='Repressilator-Hg-MerR-TetR-Cl_lambda',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_K346002'), rbs, R('BBa_C0040'), T],
                [P('BBa_R0040'), rbs, R('BBa_C0051'), T],
                [P('BBa_R1051'), rbs, R('BBa_K346001'), T]])))

    _(Logic(logic_name='Repressilator-Hg-MerR-TetR-TrpR',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_K346002'), rbs, R('BBa_C0040'), T],
                [P('BBa_R0040'), rbs, R('BBa_K588000'), T],
                [P('BBa_K588001'), rbs, R('BBa_K346001'), T]])))

    _(Logic(logic_name='Repressilator-IPTG-TetR-Cl_lambda-LacI',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_R0010'), rbs, R('BBa_C0040'), T],
                [P('BBa_R0040'), rbs, R('BBa_C0051'), T],
                [P('BBa_R1051'), rbs, R('BBa_C0012'), T]])))

    _(Logic(logic_name='Repressilator-IPTG-TetR-TrpR-LacI',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_R0010'), rbs, R('BBa_C0040'), T],
                [P('BBa_R0040'), rbs, R('BBa_K588000'), T],
                [P('BBa_K588001'), rbs, R('BBa_C0012'), T]])))

    _(Logic(logic_name='Repressilator-aTc-Cl_lambda-LacI-TetR',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_R0040'), rbs, R('BBa_C0051'), T],
                [P('BBa_R1051'), rbs, R('BBa_C0012'), T],
                [P('BBa_R0010'), rbs, R('BBa_C0040'), T]])))

    _(Logic(logic_name='Repressilator-aTc-TrpR-LacI-TetR',
            logic_type='repressilator', n_inputs=1,
            inputparts='[[]]',
            outputparts=json.dumps([
                [P('BBa_R0040'), rbs, R('BBa_K588000'), T],
                [P('BBa_K588001'), rbs, R('BBa_C0012'), T],
                [P('BBa_R0010'), rbs, R('BBa_C0040'), T]])))

    inverter_data = [('BBa_K346001', 'BBa_K346002'),
                     ('BBa_C0012', 'BBa_R0010'),
                     ('BBa_I732100', 'BBa_R0010'),
                     ('BBa_C0040', 'BBa_R0040'),
                     ('AsrD (high As)', 'BBa_K1170000 (high As)'),
                     ('AsrR (low As)', 'BBa_K1170000 (low As)'),
                     ('BBa_C0062', 'BBa_R0063'),
                     ('BBa_K588000', 'BBa_K588001'),
                     ('BBa_C0051', 'BBa_R1051'),
                     ('BBa_K1195004', 'BBa_KI23003')
                     ]
    for i, (gene, promoter) in enumerate(inverter_data):
        _(Logic(logic_name='Inverter %d' % i,
                logic_type='inverter', n_inputs=1, truth_table='TF',
                inputparts=json.dumps([[rbs, R(gene), T]]),
                outputparts=json.dumps([[P(promoter), rbs]])))

    _(Logic(logic_name='Toggle switch 1', logic_type='toggle_switch_1',
            n_inputs=2, inputparts=json.dumps([[rbs], [rbs]]),
            outputparts='[]'))

    _(Logic(logic_name='Toggle switch 2 (Cl_lambda)', n_inputs=1,
            logic_type='toggle_switch_2',
            inputparts=json.dumps([[rbs, R('BBa_C0051'), T], [rbs]]),
            outputparts=json.dumps([[P('BBa_R1051'), rbs]])))

    _(Logic(logic_name='Toggle switch 2 (Cro)', n_inputs=1,
            truth_table='XX', logic_type='toggle_switch_2',
            inputparts=json.dumps([[rbs, R('K1195004'), T], [rbs]]),
            outputparts=json.dumps([[P('BBa_KI23003'), rbs]])))

    _(Logic(logic_name='Simple Logic', n_inputs=1,
            logic_type='simple', truth_table='FT',
            inputparts=json.dumps([[rbs]]), outputparts='[]'))

    _(Logic(logic_name='And Gate - T7', n_inputs=2,
            logic_type='and_gate', truth_table='FFFT',
            inputparts=json.dumps([[rbs, G('supD'), T],
                                   [rbs, G('T7ptag'), T]]),
            outputparts=json.dumps([[P('BBa_I712074'), rbs]])))

    _(Logic(logic_name='And Gate - PhrpL', n_inputs=2,
            logic_type='and_gate', truth_table='FFFT',
            inputparts=json.dumps([[rbs, G('BBa_K1014001'), T],
                                   [rbs, G('BBa_K1014000'), T]]),
            outputparts=json.dumps([[P('BBa_K1014002'), rbs]])))

    _(Logic(logic_name='Or Gate', n_inputs=2,
            logic_type='or_gate', truth_table='FTTT',
            inputparts=json.dumps([[rbs], [rbs]]),
            outputparts='[]'))

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
