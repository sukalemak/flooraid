import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask import render_template, flash, redirect, url_for, request, jsonify
from werkzeug.urls import url_parse
import pyrebase
import requests.exceptions
import requests
import json
import os
import google.auth.transport.requests
import google.oauth2.id_token
import sys

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(variable_start_string='%%',variable_end_string='%%'))

app = CustomFlask(__name__)

from FlaskApp import routes

if __name__=="__main__":
    app.run(debug=True)
