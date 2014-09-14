#!/bin/sh

if which pip > /dev/null;
then
    sudo python get-pip.py
fi

sudo pip install -r requirements.txt
