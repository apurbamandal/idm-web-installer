#!/usr/bin/python
from wsgiref.handlers import CGIHandler
from flask_app import server

CGIHandler().server.main()