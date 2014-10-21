FROM centos:centos7

RUN yum install epel-release -y && yum makecache && yum install python-flask python-gevent python-sqlalchemy python-pip -y
RUN pip install Flask-SQLAlchemy

COPY ./run.py /app/
RUN mkdir /app/server
COPY ./server /app/server/

EXPOSE 5000
WORKDIR /app
CMD ["python", "/app/run.py", "-s"]
