#ifndef _SIMULATOR_CLASS
#define _SIMULATOR_CLASS

#include <cstddef>
#include <vector>
#include <utility>

typedef std::vector<double> STATE_t;
enum RELATIONSHIP_TYPE{PROMOTE, REPRESS};

struct Relationship
{
    RELATIONSHIP_TYPE type;
    int A, B;
    std::vector<double> parameters;
};

class Simulator
{
public:
    Simulator(size_t n): n_var(n) {}
    void relationship(RELATIONSHIP_TYPE type, size_t other, const std::vector<double> &parameters);
    std::vector<std::pair<double, STATE_t>> simulate(const STATE_t &x0, double t, double dt = 0.1);

private:
    const size_t n_var;
    std::vector<Relationship> _relationships;

    void _f(const STATE_t &x, STATE_t &dxdt, double /* t */);
    static inline double _repress(double P, double alpha, double beta, double gamma, double K, double n);
    static inline double _promote(double P, double A, double alpha, double beta, double gamma, double K, double n);
};

#endif
