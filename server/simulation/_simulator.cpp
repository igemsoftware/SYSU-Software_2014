#include <cmath>
#include <stdexcept>
#include <functional>
//boost will fail to build without the following include
#include <boost/numeric/odeint/util/ublas_wrapper.hpp>
#include <boost/numeric/odeint/integrate/integrate.hpp>
#include "_simulator.h"

using boost::numeric::odeint::integrate;
using namespace std::placeholders;


void _Simulator::relationship(RELATIONSHIP_TYPE type, size_t from, size_t to,
        const std::vector<double> &parameters)
{
    if(from >= n_var || to >= n_var)
        throw std::out_of_range("invalid index");
    _relationships.emplace_back(type, from, to, parameters);
}

std::vector<std::pair<double, STATE_t>> _Simulator::simulate(const STATE_t &x0, double t, double dt)
{
    if(x0.size() != n_var)
        throw std::invalid_argument("invalid length of x0");

    //move SIMPLE relationships to the end
    decltype(_relationships) _tmp_rel;
    for(auto i  = _relationships.begin(); i != _relationships.end();) {
        if(i->type == SIMPLE) {
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

void _Simulator::_f(const STATE_t &x, STATE_t &dxdt, double /* t */)
{
    for(auto &i: dxdt)
        i = 0;
    for(auto &r: _relationships) {
        switch(r.type) {
            case SIMPLE:
                dxdt[r.to] += dxdt[r.from];
                break;
            case REPRESS:
                dxdt[r.to] += _repress(x[r.to], x[r.from],
                        r.parameters[0], r.parameters[1], r.parameters[2],
                        r.parameters[3], r.parameters[4]);
                break;
            case PROMOTE:
                dxdt[r.to] += _promote(x[r.to], x[r.from],
                        r.parameters[0], r.parameters[1], r.parameters[2],
                        r.parameters[3], r.parameters[4]);
                break;
        }
    }
}

inline double _Simulator::_repress(double P, double R,
        double alpha, double beta, double gamma, double K, double n)
{
    return alpha / (1 + pow(R / K, n)) - beta * P + gamma;
}

inline double _Simulator::_promote(double P, double A,
        double alpha, double beta, double gamma, double K, double n)
{
    return (alpha * pow(A / K, n)) / (1 + pow(A / K, n)) - beta * P + gamma;
}

