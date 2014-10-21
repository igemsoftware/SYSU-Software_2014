FLAME
==============

Copyright 2014 SYSU-Software

Installation
------------

### Online version

You can just use [FLAME online](http://flame.sysusoftware.info)!

### Prebuilt package

If you prefer to run the software on your computer, you can download
the prebuilt package of FLAME on the [releases page](https://github.com/igemsoftware/SYSU-Software_2014/releases).

### Manually build & install

If you prefer the hacker-way, you can build FLAME manually.

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
