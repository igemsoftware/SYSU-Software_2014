FLAME
==============

Introduction
------------

Currently genetic circuits in synthetic biology are complicated thus are difficult for biologists to design.
In our project, we developed the **Framework-based Layout And Metacircuit design Engine (FLAME)**,
to simplify the whole design procedure by characterizing numerous published genetic circuits and abstract these circuits into 3 parts:
inputs, outputs and logic relationships. A novel simulation module using ordinary differential equations is integrated into our software.
Our simulation results were precisely validated by results from published literature and our self-designed wetlab experiments.
In conclusion, the combination of a simplified design procedure, a new and effective simulation module and wetlab validation makes
complex biological circuits more accessible to synthetic biologists.

Installation
------------

### Online version

You can just use [FLAME online](http://flame.sysusoftware.info)!

### Prebuilt package

If you prefer to run the software on your computer, you can download
the prebuilt package of FLAME on the [releases page](https://github.com/igemsoftware/SYSU-Software_2014/releases).

### Manually build & install

If you prefer the hacker-way, you can build FLAME manually. You can build FLAME on Linux, MacOS and Windows
with a proper build toolchain.

1. Build dependencies
(the development packages of them are required. E.g. `boost-devel`, `libev-devel` and `python-devel` on openSUSE)

    * gcc-c++ 4.7 +
    * boost (only `boost/numeric/odeint` is required)
    * libev
    * Python 2.7

    And the following Python packages are required.

    * Cython
    * Flask
    * SQLAlchemy
    * Flask-SQLAlchemy
    * gevent
    * nose (for unit testing)
    * Flask-Testing (for unit testing)
    * coverage (for unit testing)

    You can install the Python packages using pip.

    ```shell
    pip install -r requirements.txt
    ```

2. Build

    ```shell
    python setup.py build_ext -i
    python init_db.py
    python runtests.py -v  # optional
    ```

3. Run

    ```shell
    python run.py
    ```

### Deployment on your own server

You can deploy FLAME on you own server (VPS, AWS EC2 instance, etc).
FLAME is just a Python WSGI application and the WSGI application object
is `server.app`. You can deploy it with some common WSGI containers.
In fact, `run.py` is an example of deploying FLAME with `gevent`.

We also prepare a `Dockerfile` for those who favour deploying with [Docker](http://docker.com),
and `Dockerrun.aws.json` for those who want to deploy FLAME on AWS Elastic Beanstalk.
