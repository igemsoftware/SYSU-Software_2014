#include <cmath>
#include <stdexcept>
#include <functional>
//boost will fail to build without the following include
#include <boost/numeric/odeint/util/ublas_wrapper.hpp>
#include <boost/numeric/odeint/integrate/integrate.hpp>
#include "_simulator_class.h"

using boost::numeric::odeint::integrate;
using namespace std::placeholders;


void Simulator::relationship(RELATIONSHIP_TYPE type,
        size_t other, const std::vector<double> &parameters)
{
    if(other >= n_var)
        throw std::out_of_range("invalid index for 'other'");
    Relationship r;
    r.A = _relationships.size();
    r.B = other;
    r.type = type;
    r.parameters = parameters;
    _relationships.push_back(r);
}

std::vector<std::pair<double, STATE_t>> Simulator::simulate(const STATE_t &x0, double t, double dt)
{
    if(x0.size() != n_var)
        throw std::invalid_argument("invalid length of x0");
    std::vector<std::pair<double, STATE_t>> logger;
    STATE_t _x0 = x0;
    integrate(std::bind(&Simulator::_f, this, _1, _2, _3), _x0, 0.0, t, dt,
            [&logger](const STATE_t &x, double t)
                {logger.push_back(std::make_pair(t, x));}
    );
    return logger;
}

void Simulator::_f(const STATE_t &x, STATE_t &dxdt, double /* t */)
{
    for(size_t i = 0; i < n_var; ++i) {
        auto &r = _relationships[i];
        switch(r.type) {
            case REPRESS:
                dxdt[i] = _repress(x[i],
                        r.parameters[0], r.parameters[1], r.parameters[2],
                        r.parameters[3], r.parameters[4]);
                break;
            case PROMOTE:
                dxdt[i] = _promote(x[i], x[r.B],
                        r.parameters[0], r.parameters[1], r.parameters[2],
                        r.parameters[3], r.parameters[4]);
                break;
        }
    }
}

inline double Simulator::_repress(double P,
        double alpha, double beta, double gamma, double K, double n)
{
    return alpha / (1 + pow(P / K, n)) - beta * P + gamma;
}

inline double Simulator::_promote(double P, double A,
        double alpha, double beta, double gamma, double K, double n)
{
    return (alpha * pow(A / K, n)) / (1 + pow(A / K, n)) - beta * P + gamma;
}

