import logging
from logging.handlers import RotatingFileHandler
from FlaskApp import app
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
import FlaskApp.config


if 'Documents' in os.getcwd():
    config = FlaskApp.config.configLocal
else:
    config = FlaskApp.config.configRemote

HTTP_REQUEST = google.auth.transport.requests.Request()

firebase = pyrebase.initialize_app(config)
db = firebase.database()

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Home')

@app.route('/get', methods=['GET'])
def list_notes():
    """Returns a list of notes added by the current Firebase user."""
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(
        id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    else:
        notes = []
        try:
            users = db.child("users").child(claims['sub']).order_by_child('timestamp').limit_to_first(10).get()
            #users = db.child("users").child(claims['sub']).get() 
            if not users.each() == None:
                for user in users.each():
                    try:
                        notes.append({'messageKey':user.key(),
                            'message':user.val()['message'],
                            'timestamp':user.val()['timestamp'],
                            'imagePresent':user.val()['imagePresent']
                        })
                    except KeyError as e:
                        app.logger.error(repr(e))
            else:
                raise ValueError('No content returned by server')
        except ValueError as e:
            app.logger.error(repr(e))
        except Exception as e:
            app.logger.error('Some other error in reading data from server')
            app.logger.error(repr(e))
        else:
            pass
        finally:
            return jsonify(notes)

@app.route('/post', methods=['POST'])
def add_note():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    data = request.get_json()
    messageKey = data.pop('messageKey')
    db.child("users").child(claims['sub']).child(messageKey).set(data)
    return 'OK', 200

@app.route('/del', methods=['POST'])
def del_note():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(
      id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    data = request.get_json()
    db.child("users").child(claims['sub']).child(data['messageKey']).remove()
    return 'OK',200

@app.route('/update', methods=['POST'])
def update_note():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(
      id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    data = request.get_json()
    db.child("users").child(claims['sub']).child(data['messageKey']).update({'message':data['message']})
    return 'OK',200

@app.route('/test/<inputString>')
def test_route(inputString='ariba'):
    return render_template('index.html',title=inputString)
