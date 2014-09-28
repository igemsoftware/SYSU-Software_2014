#include <boost/numeric/odeint.hpp>
#include "_simulator_class.h"

using boost::numeric::odeint::integrate;


void Simulator::relationship(RELATIONSHIP_TYPE type,
        int A, int B, const std::vector<double> &parameters)
{
}

std::vector<std::pair<double, double>> Simulator::simulate(const STATE_t &x0)
{
}

void Simulator::_f(STATE_t &x, STATE_t &dxdt, double t)
{
}

inline double Simulator::_repress(double P, double R,
        double alpha, double beta, double gamma, double K, double n)
{
}

inline double Simulator::_promote(double P, double A,
        double alpha, double beta, double gamma, double K, double n)
{
}

