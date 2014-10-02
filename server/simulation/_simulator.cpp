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
        throw std::out_of_range("invalid index for 'other'");
    Relationship r;
    r.from = from;
    r.to = to;
    r.type = type;
    r.parameters = parameters;
    _relationships[from] = r;
    _relationships.push_back(r);
}

std::vector<std::pair<double, STATE_t>> _Simulator::simulate(const STATE_t &x0, double t, double dt)
{
    if(x0.size() != n_var)
        throw std::invalid_argument("invalid length of x0");
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
    for(size_t i = 0; i < n_var; ++i) {
        auto &r = _relationships[i];
        switch(r.type) {
            case NONE:
                dxdt[i] = 0;
                break;
            case REPRESS:
                dxdt[i] = _repress(x[i], x[r.to],
                        r.parameters[0], r.parameters[1], r.parameters[2],
                        r.parameters[3], r.parameters[4]);
                break;
            case PROMOTE:
                dxdt[i] = _promote(x[i], x[r.to],
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

