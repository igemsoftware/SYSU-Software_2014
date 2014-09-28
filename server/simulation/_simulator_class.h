#include <vector>
#include <utility>

typedef std::vector<double> STATE_t;
enum RELATIONSHIP_TYPE{PROMOTE, REPRESS};

class Simulator
{
public:
    Simulator(int n): n_var(n) {}
    void relationship(RELATIONSHIP_TYPE type, int A, int B, const std::vector<double> &parameters);
    std::vector<std::pair<double, double>> simulate(const STATE_t &x0);

private:
    const int n_var;
    std::vector<std::pair<RELATIONSHIP_TYPE, std::vector<double>>> _system_functions;

    void _f(STATE_t &x, STATE_t &dxdt, double t);
    static inline double _repress(double P, double R, double alpha, double beta, double gamma, double K, double n);
    static inline double _promote(double P, double A, double alpha, double beta, double gamma, double K, double n);
};

