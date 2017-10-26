# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""Entry point for the server application."""

import json
import logging
import traceback
from datetime import datetime
from flask import Response, request, jsonify, current_app
from gevent.wsgi import WSGIServer
from flask_jwt_simple import (
    JWTManager, jwt_required, create_jwt, get_jwt_identity, get_jwt
)
import paramiko
import socket

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

from .http_codes import Status
from .factory import create_app, create_user,get_all_user


logger = logging.getLogger(__name__)
app = create_app()
jwt = JWTManager(app)


@app.before_first_request
def init():
    """Initialize the application with defaults."""
    create_user(app)
    get_all_user()


@jwt.jwt_data_loader
def add_claims_to_access_token(identity):
    """Explicitly set identity and claims for jwt."""
    if identity == 'admin':
        roles = 'admin'
    else:
        roles = 'peasant'

    now = datetime.utcnow()
    return {
        'exp': now + current_app.config['JWT_EXPIRES'],
        'iat': now,
        'nbf': now,
        'sub': identity,
        'roles': roles
    }


@app.route("/api/logout", methods=['POST'])
@jwt_required
def logout():
    """Logout the currently logged in user."""
    # TODO: handle this logout properly, very weird implementation.
    identity = get_jwt_identity()
    if not identity:
        print("Session Expired")
        return jsonify({"msg": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED
    logger.info('Logged out user !!')
    return 'logged out successfully', Status.HTTP_OK_BASIC


@app.route('/api/login', methods=['POST'])
def login():
    """View function for login view."""
    logger.info('Logged in user')

    params = request.get_json()
    username = params.get('username', None)
    password = params.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), Status.HTTP_BAD_REQUEST
    if not password:
        return jsonify({"msg": "Missing password parameter"}), Status.HTTP_BAD_REQUEST

    # TODO Check from DB here
    if username != 'admin' or password != 'admin':
        return jsonify({"msg": "Bad username or password"}), Status.HTTP_BAD_UNAUTHORIZED

    # Identity can be any data that is json serializable
    # TODO: rather than passing expiry time here explicitly, decode token on client side. But I'm lazy.
    ret = {'jwt': create_jwt(identity=username), 'exp': datetime.utcnow() + current_app.config['JWT_EXPIRES']}
    return jsonify(ret), 200


@app.route('/api/protected', methods=['GET'])
@jwt_required
def get_data():
    """Get dummy data returned from the server."""
    jwt_data = get_jwt()
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"msg": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    data = {'Heroes': ['Hero1', 'Hero2', 'Hero3']}
    json_response = json.dumps(data)
    return Response(json_response,
                    status=Status.HTTP_OK_BASIC,
                    mimetype='application/json')


def main():
    """Main entry point of the app."""
    try:
        port = 8080
        ip = '0.0.0.0'
        http_server = WSGIServer((ip, port),
                                 app,
                                 log=logging,
                                 error_log=logging)
        print("Server started at: {0}:{1}".format(ip, port))
        http_server.serve_forever()
    except Exception as exc:
        logger.error(exc.message)
        logger.exception(traceback.format_exc())
    finally:
        # Do something here
        pass

@app.route('/api/download',methods=['POST'])
@jwt_required
# def download():
#     jwt_data = get_jwt()
#     print("Session Expired")
#     if jwt_data['roles'] != 'admin':
#         return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN
#
#     identity = get_jwt_identity()
#     if not identity:
#         return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED
#
#     hostname = '164.99.91.35'
#     port = 22
#     username = 'root'
#     password = 'novell'
#     ssh = paramiko.SSHClient()
#     ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#     ssh.connect(hostname, username=username,password=password)
#
#     chan = ssh.get_transport().open_session()
#     chan.settimeout(10800)
#     status =False;
#
#     output=""
#     msg='Download Failed'
#     sendStat = Status.HTTP_Failed
#     logger.info("Downloading ... ")
#     try:
#         # Execute the given command
#         # chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
#         chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux.iso")
#         contents = StringIO()
#         error = StringIO()
#
#         while not chan.exit_status_ready():
#             if chan.recv_ready():
#                 data = chan.recv(1024)
#                 print (data)
#                 while data:
#                     contents.write(data)
#                     data = chan.recv(1024)
#
#             if chan.recv_stderr_ready():
#                 error_buff = chan.recv_stderr(1024)
#                 while error_buff:
#                     error.write("error")
#                     error_buff = chan.recv_stderr(1024)
#
#         exit_status = chan.recv_exit_status()
#
#     except socket.timeout:
#         raise socket.timeout
#     ssh.close()
#
#
#
#
#
#     output = contents.getvalue()
#     error_value = error.getvalue()
#     logger.info(output)
#     logger.info(exit_status)
#
#     data = {"sucess":status,'result':msg}
#     json_response = json.dumps(data)
#     return Response(json_response,
#                     status=sendStat,
#                     mimetype='application/json')
def download():
    jwt_data = get_jwt()
    print("Session Expired")
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    params = request.get_json()
    hostname = params.get('hostname', None)
    username = params.get('hostUsername', None)
    password = params.get('hostPassword', None)
    buildISO = params.get('buildLocation', None)

    if (hostname == None or username == None or password == None or buildISO == None):
        logger.info("Params Missing ")
        # return jsonify(msg="Params Missing"), Status.HTTP_BAD_CONFLICT

    hostname = '164.99.91.35'
    port = 22
    username = 'root'
    password = 'novell'
    buildISO='http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux.iso'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(10800)
    status = False;
    msg = 'Downloaded'
    sendStat = Status.HTTP_OK_BASIC
    logger.info("Downloading ... ")
    try:
        # Execute the given command
        # chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux.iso")
        contents = StringIO()
        error = StringIO()
        while not chan.exit_status_ready():
            if chan.recv_ready():
                data = chan.recv(1024)
                print (data)
                while data:
                    contents.write(data)
                    data = chan.recv(1024)
            if chan.recv_stderr_ready():
                error_buff = chan.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = chan.recv_stderr(1024)
        exit_status = chan.recv_exit_status()

    except socket.timeout:
        raise socket.timeout

    ssh.close()
    data = {"sucess":status,'result':msg}
    json_response = json.dumps(data)
    return Response(json_response,
                    status=sendStat,
                    mimetype='application/json')

@app.route('/api/copyIso',methods=['POST'])
@jwt_required
def copyIso():
    jwt_data = get_jwt()
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    # params = request.get_json()
    # hostname = params.get('hostname', None)
    # username = params.get('hostUsername', None)
    # password = params.get('hostPassword', None)

    # if (hostname == None or username == None or password == None ):
    #     logger.info("Params Missing ")
    #     # return jsonify(msg="Params Missing"), Status.HTTP_BAD_CONFLICT

    hostname = '164.99.91.35'
    port = 22
    username = 'root'
    password = 'novell'
    mkdirCommand = ' mkdir /mnt/idm'
    mountCommand = ' mount -o loop /home/Identity_Manager_4.7_Linux.iso /mnt/idm'
    copyCommand = ' cp -r /mnt/idm  /home/idm'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(10800)
    status = False;
    msg = 'Copping'
    sendStat = Status.HTTP_OK_BASIC
    logger.info("Copping ... ")
    try:
        # Execute the given command
        # chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command("mkdir /mnt/idm")
        contents = StringIO()
        error = StringIO()
        while not chan.exit_status_ready():
            if chan.recv_ready():
                data = chan.recv(1024)
                print (data)
                while data:
                    contents.write(data)
                    data = chan.recv(1024)
            if chan.recv_stderr_ready():
                error_buff = chan.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = chan.recv_stderr(1024)
        exit_status = chan.recv_exit_status()

    except socket.timeout:
        raise socket.timeout
    ssh.close()
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(108000)
    try:
        # Execute the given command
        # chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command("mount -o loop /home/Identity_Manager_4.7_Linux.iso /mnt/idm")
        contents = StringIO()
        error = StringIO()
        while not chan.exit_status_ready():
            if chan.recv_ready():
                data = chan.recv(1024)
                print (data)
                while data:
                    contents.write(data)
                    data = chan.recv(1024)
            if chan.recv_stderr_ready():
                error_buff = chan.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = chan.recv_stderr(1024)
        exit_status = chan.recv_exit_status()

    except socket.timeout:
        raise socket.timeout
    ssh.close()
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(108000)
    try:
        # Execute the given command
        # chan.exec_command("wget -P /home/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command("cp -r /mnt/idm  /home/idm")
        contents = StringIO()
        error = StringIO()
        while not chan.exit_status_ready():
            if chan.recv_ready():
                data = chan.recv(1024)
                print (data)
                while data:
                    contents.write(data)
                    data = chan.recv(1024)
            if chan.recv_stderr_ready():
                error_buff = chan.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = chan.recv_stderr(1024)
        exit_status = chan.recv_exit_status()

    except socket.timeout:
        raise socket.timeout

    data = {"sucess":status,'result':msg}
    json_response = json.dumps(data)
    return Response(json_response,
                    status=sendStat,
                    mimetype='application/json')


@app.route('/api/save', methods=['POST'])
def save():

    logger.info('api called')

    params = request.get_json()
    a = params.get('a', None)
    b = params.get('b', None)

    # if not a:
    #     return jsonify({"msg": "Missing a parameter"}), Status.HTTP_BAD_REQUEST
    # if not b:
    #     return jsonify({"msg": "Missing b parameter"}), Status.HTTP_BAD_REQUEST

    hostname = '164.99.91.35'
    port = 22
    username = 'root'
    password = 'novell'
    command1='sed -i -e "/ID_VAULT_PASSWORD=/ s/=.*/=novell@123/" -e "/CONFIGURATION_PWD=/ s/=.*/=novell@123/" /home/a/silent.properties'
    command2='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /home/idm/IDM/sys_req.sh'
    command3='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /home/idm/user_application/sys_req.sh'
    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username,password=password, port=port)
    channel = client.get_transport().open_session()
    channel.exec_command(command1+"\n"+command2+"\n"+command3)
    ret = "sucees"
    return jsonify(ret), 200
