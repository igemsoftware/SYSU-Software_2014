#include <cmath>
#include <stdexcept>
#include <functional>
//boost will fail to build without the following include
#include <boost/numeric/odeint/util/ublas_wrapper.hpp>
#include <boost/numeric/odeint/integrate/integrate.hpp>
#include "_simulator.h"

using boost::numeric::odeint::integrate;
using namespace std::placeholders;


inline double _repress(double P, double R,
        double alpha, double beta, double gamma, double K, double n)
{
    return alpha / (1 + pow(R / K, n)) - beta * P + gamma;
}

inline double _promote(double P, double A,
        double alpha, double beta, double gamma, double K, double n)
{
    return (alpha * pow(A / K, n)) / (1 + pow(A / K, n)) - beta * P + gamma;
}

inline double _bipromote(double P, double S1, double S2,
        double alpha, double beta, double gamma, double K, double n)
{
    return alpha * pow(S1 / K, n) / (1 + pow(S1 / K, n)) *
        pow(S2 / K, n) / (1 + pow(S2 / K, n)) -
        beta * P + gamma;
}


Relationship::Relationship(RELATIONSHIP_TYPE type, size_t from, size_t to,
        const std::vector<double> &parameters):
    type(type), from(from), to(to), parameters(parameters) { }

void Relationship::f(const STATE_t &x, STATE_t &dxdt) const
{
    switch(this->type) {
        case SIMPLE:
            dxdt[to] += dxdt[from];
            break;
        case REPRESS:
            dxdt[to] += _repress(x[to], x[from],
                    parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
            break;
        case PROMOTE:
            dxdt[to] += _promote(x[to], x[from],
                    parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
            break;
        default:
            throw std::runtime_error("Relationship class cannot handle BIPROMOTE");
    }
}


BiControl::BiControl(RELATIONSHIP_TYPE type, size_t from_1, size_t from_2, size_t to, const std::vector<double> &parameters)
    :Relationship(BIPROMOTE, from_1, to, parameters), from_2(from_2)
{
    if(type != BIPROMOTE)
        throw std::runtime_error("invalid relationship type for BiControl");
}

void BiControl::f(const STATE_t &x, STATE_t &dxdt) const
{
    if(this->type == BIPROMOTE)
        dxdt[to] += _bipromote(x[to], x[from], x[from_2],
                parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
}


void _Simulator::relationship(RELATIONSHIP_TYPE type, size_t from, size_t to,
        const std::vector<double> &parameters)
{
    if(type != SIMPLE && type != REPRESS && type != PROMOTE)
        throw std::runtime_error("invalid relationship type for unary control");
    if(from >= n_var || to >= n_var)
        throw std::out_of_range("invalid index");
    _relationships.push_back(new Relationship(type, from, to, parameters));
}

void _Simulator::relationship(RELATIONSHIP_TYPE type, size_t from_1, size_t from_2, size_t to,
        const std::vector<double> &parameters)
{
    if(type != BIPROMOTE)
        throw std::runtime_error("invalid relationship type for binary control");
    if(from_1 >= n_var || from_2 >= n_var || to >= n_var)
        throw std::out_of_range("invalid index");
    _relationships.push_back(new BiControl(type, from_1, from_2, to, parameters));
}

_Simulator::~_Simulator()
{
    for(auto p: _relationships) {
        if(p)
            delete p;
    }
}

std::vector<std::pair<double, STATE_t>> _Simulator::simulate(const STATE_t &x0, double t, double dt)
{
    if(x0.size() != n_var)
        throw std::invalid_argument("invalid length of x0");

    //move SIMPLE relationships to the end
    decltype(_relationships) _tmp_rel;
    for(auto i  = _relationships.begin(); i != _relationships.end();) {
        if((*i)->type == SIMPLE) {
            _tmp_rel.push_back(*i);
            i = _relationships.erase(i);
        }
        else
            ++i;
    }
    _relationships.insert(_relationships.end(), _tmp_rel.begin(), _tmp_rel.end());

    std::vector<std::pair<double, STATE_t>> logger;
    STATE_t _x0 = x0;
    integrate(std::bind(&_Simulator::_f, this, _1, _2, _3), _x0, 0.0, t, dt,
            [&logger](const STATE_t &x, double t)
                {logger.push_back(std::make_pair(t, x));}
    );
    return logger;
}

void _Simulator::_f(const STATE_t &x, STATE_t &dxdt, double /* t */) const
{
    for(auto &i: dxdt)
        i = 0;
    for(auto &r: _relationships)
        r->f(x, dxdt);
}

