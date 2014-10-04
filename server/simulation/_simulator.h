#ifndef _SIMULATOR_H
#define _SIMULATOR_H

#include <cstddef>
#include <vector>
#include <utility>

typedef std::vector<double> STATE_t;
enum RELATIONSHIP_TYPE{SIMPLE, PROMOTE, REPRESS, BIPROMOTE};

class Relationship
{
public:
    RELATIONSHIP_TYPE type;

    Relationship(RELATIONSHIP_TYPE type, size_t from, size_t to,
            const std::vector<double> &parameters);
    virtual void f(const STATE_t &x, STATE_t &dxdt) const;
    virtual ~Relationship() {};

protected:
    size_t from, to;
    std::vector<double> parameters;
};

class BiControl: public Relationship
{
public:
    BiControl(RELATIONSHIP_TYPE type, size_t from_1, size_t from_2, size_t to,
            const std::vector<double> &parameters);
    void f(const STATE_t &x, STATE_t &dxdt) const;

protected:
    size_t from_2;
};

class _Simulator
{
public:
    _Simulator(size_t n): n_var(n) {}
    ~_Simulator();
    void relationship(RELATIONSHIP_TYPE type, size_t from, size_t to,
            const std::vector<double> &parameters);
    void relationship(RELATIONSHIP_TYPE type, size_t from_1, size_t from_2, size_t to,
            const std::vector<double> &parameters);
    std::vector<std::pair<double, STATE_t>> simulate(const STATE_t &x0, double t, double dt = 0.1);

private:
    const size_t n_var;
    std::vector<Relationship *> _relationships;
};

#endif
