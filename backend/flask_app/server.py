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
import socket,time


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


@app.route("/idmtools/api/logout", methods=['POST'])
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


@app.route('/idmtools/api/login', methods=['POST'])
def login():
    """View function for login view."""


    params = request.get_json()
    username = params.get('username', None)
    password = params.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}), Status.HTTP_BAD_REQUEST
    if not password:
        return jsonify({"msg": "Missing password parameter"}), Status.HTTP_BAD_REQUEST

    # TODO Check from DB here
    if (username == 'admin' or username == 'user') and password == 'admin':
        logger.info('Logged in %s', username)
    else:
        return jsonify({"msg": "Bad username or password"}), Status.HTTP_BAD_UNAUTHORIZED
    # Identity can be any data that is json serializable
    # TODO: rather than passing expiry time here explicitly, decode token on client side. But I'm lazy.
    ret = {'jwt': create_jwt(identity=username), 'exp': datetime.utcnow() + current_app.config['JWT_EXPIRES']}
    return jsonify(ret), 200


@app.route('/idmtools/api/protected', methods=['GET'])
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
                                 error_log=logging,
                                 )
        print("Server started at: {0}:{1}".format(ip, port))
        http_server.serve_forever()
    except Exception as exc:
        logger.error(exc.message)
        logger.exception(traceback.format_exc())
    finally:
        # Do something here
        pass


@app.route('/idmtools/api/install_standalone', methods=['POST'])
@jwt_required
def install_standalone():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    buildid = params.get('buildid', None)


    jwt_data = get_jwt()
    print("Session Expired")
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    if (vaultip == None or boxusername == None or boxpass == None or buildid == None):
        logger.info("Params Missing ")
        # return jsonify(msg="Params Missing"), Status.HTTP_BAD_CONFLICT

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    #command = 'wget -P /tmp/ http://blr-iam-jenkins.labs.blr.novell.com:8080/view/IDM_4.7.0/view/Install/job/IDMLinuxInstaller_idm4.7.0/lastSuccessfulBuild/artifact/Identity_Manager_4.7_Linux.iso'
    command = './install_idm.sh &> output.log '+buildid+' &'
    command2 = 'cd /tmp/'
    command3 = 'chmod 777 /tmp/install_idm.sh'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(1800000)
    status = False;
    msg = 'Downloaded'
    sendStat = Status.HTTP_OK_BASIC
    logger.info("Downloading ... ")
    try:
        # Execute the given command
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command2+'\n'+command3+'\n'+command)
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

@app.route('/idmtools/api/install_vault', methods=['POST'])
@jwt_required
def install_vault():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    buildid = params.get('buildid', None)


    jwt_data = get_jwt()
    print("Session Expired")
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    if (vaultip == None or boxusername == None or boxpass == None or buildid == None):
        logger.info("Params Missing ")
        # return jsonify(msg="Params Missing"), Status.HTTP_BAD_CONFLICT

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    #command = 'wget -P /tmp/ http://blr-iam-jenkins.labs.blr.novell.com:8080/view/IDM_4.7.0/view/Install/job/IDMLinuxInstaller_idm4.7.0/lastSuccessfulBuild/artifact/Identity_Manager_4.7_Linux.iso'
    command = './install_idm.sh &> output.log '+buildid+' &'
    command2 = 'cd /tmp/'
    command3 = 'chmod 777 /tmp/install_idm.sh'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(1800000)
    status = False;
    msg = 'Downloaded'
    sendStat = Status.HTTP_OK_BASIC
    logger.info("Downloading ... ")
    try:
        # Execute the given command
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command2+'\n'+command3+'\n'+command)
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

@app.route('/idmtools/api/install_apps', methods=['POST'])
@jwt_required
def install_apps():

    params = request.get_json()
    vaultip = params.get('appsip', None)
    boxpass = params.get('boxappspass', None)
    boxusername = params.get('boxappsusername', None)
    buildid = params.get('buildid', None)


    jwt_data = get_jwt()
    print("Session Expired")
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    if (vaultip == None or boxusername == None or boxpass == None or buildid == None):
        logger.info("Params Missing ")
        # return jsonify(msg="Params Missing"), Status.HTTP_BAD_CONFLICT

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    #command = 'wget -P /tmp/ http://blr-iam-jenkins.labs.blr.novell.com:8080/view/IDM_4.7.0/view/Install/job/IDMLinuxInstaller_idm4.7.0/lastSuccessfulBuild/artifact/Identity_Manager_4.7_Linux.iso'
    command = './install_idm.sh &> output.log '+buildid+' &'
    command2 = 'cd /tmp/'
    command3 = 'chmod 777 /tmp/install_idm.sh'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username,password=password)
    chan = ssh.get_transport().open_session()
    chan.settimeout(1800000)
    status = False;
    msg = 'Downloaded'
    sendStat = Status.HTTP_OK_BASIC
    logger.info("Downloading ... ")
    try:
        # Execute the given command
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command2+'\n'+command3+'\n'+command)
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

@app.route('/idmtools/api/copyIso', methods=['POST'])
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

    hostname = ''
    port = 22
    username = ''
    password = ''
    mkdirCommand = ' mkdir /mnt/idm'
    mountCommand = ' mount -o loop /tmp/Identity_Manager_4.7_Linux.iso /mnt/idm'
    copyCommand = ' cp -r /mnt/idm  /tmp/idm'

    command1 = 'mkdir /mnt/idm'
    command2 = 'mount -o loop /tmp/Identity_Manager_4.7_Linux.iso /mnt/idm'
    command3 = 'cp -r /mnt/idm  /tmp/idm'
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
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command1)
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
    chan.settimeout(180000)
    try:
        # Execute the given command
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command2)
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
    chan.settimeout(180000)
    try:
        # Execute the given command
        # chan.exec_command("wget -P /tmp/ http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux_Framework.iso")
        chan.exec_command(command3)
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


@app.route('/idmtools/api/saveProperties', methods=['POST'])
def saveProperties():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    ssopass = params.get('ssopass', None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)


    logger.info('edit called')
    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    command1 = 'sed -i -e "/ID_VAULT_ADMIN_LDAP=/ s/=.*/=' + vaultadminname + '/" -e "/ID_VAULT_TREENAME=/ s/=.*/=' + vaulttreename + '/" -e "/ID_VAULT_PASSWORD=/ s/=.*/=' + vaultadminpass + '/" -e "/ID_VAULT_HOST=/ s/=.*/=' + vaultip + '/" -e "/TOMCAT_SERVLET_HOSTNAME=/ s/=.*/=' + vaultip + '/" -e "/SSO_SERVER_HOST=/ s/=.*/=' + vaultip + '/" -e "/SSO_SERVER_HOST=/ s/=.*/=' + vaultip + '/" -e "/CONFIGURATION_PWD=/ s/=.*/=' + ssopass + '/" -e "/SSO_SERVICE_PWD=/ s/=.*/=' + ssopass + '/" -e "/UA_ADMIN=/ s/=.*/=' + appsadminname + '/" -e "/UA_ADMIN_PWD=/ s/=.*/=' + appsadminpass + '/" -e "/UA_DATABASE_USER=/ s/=.*/=' + postgresusername + '/" -e "/UA_DATABASE_PWD=/ s/=.*/=' + postgresusername + '/" -e "/SENTINEL_AUDIT_SERVER=/ s/=.*/=' + sentinelip + '/" /tmp/silent.properties'
    print(command1)

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    channel = client.get_transport().open_session()
    channel.settimeout(1800000)
    try:
        channel.exec_command(command1)
        contents = StringIO()
        error = StringIO()
        while not channel.exit_status_ready():
            if channel.recv_ready():
                data = channel.recv(1024)
                print(data)
                while data:
                    contents.write(data)
                    data = channel.recv(1024)
            if channel.recv_stderr_ready():
                error_buff = channel.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = channel.recv_stderr(1024)
        exit_status = channel.recv_exit_status()

    except socket.timeout:
        raise socket.timeout
    client.close()

    ret = 'All properties successfully saved in ' + vaultip+'.'
    print(ret)
    return jsonify(ret), 200

@app.route('/idmtools/api/saveProperties_vault', methods=['POST'])
def saveProperties_vault():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    ssopass = params.get('ssopass', None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)


    logger.info('saveProperties for vault called')
    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    command1 = 'sed -i -e "/ID_VAULT_ADMIN_LDAP=/ s/=.*/=' + vaultadminname + '/" -e "/ID_VAULT_TREENAME=/ s/=.*/=' + vaulttreename + '/" -e "/ID_VAULT_PASSWORD=/ s/=.*/=' + vaultadminpass + '/" /tmp/silent.properties'
    print(command1)

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    channel = client.get_transport().open_session()
    channel.settimeout(1800000)
    try:
        channel.exec_command(command1)
        contents = StringIO()
        error = StringIO()
        while not channel.exit_status_ready():
            if channel.recv_ready():
                data = channel.recv(1024)
                print(data)
                while data:
                    contents.write(data)
                    data = channel.recv(1024)
            if channel.recv_stderr_ready():
                error_buff = channel.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = channel.recv_stderr(1024)
        exit_status = channel.recv_exit_status()

    except socket.timeout:
        raise socket.timeout
    client.close()

    ret = 'All properties successfully saved in ' + vaultip+'.'
    print(ret)
    return jsonify(ret), 200

@app.route('/idmtools/api/saveProperties_apps', methods=['POST'])
def saveProperties_apps():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxappspass', None)
    boxusername = params.get('boxappsusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    ssopass = params.get('ssopass', None)
    appsip = params.get('appsip',None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)


    logger.info('edit called')
    hostname = appsip
    port = 22
    username = boxusername
    password = boxpass
    command1 = 'sed -i -e "/ID_VAULT_ADMIN_LDAP=/ s/=.*/=' + vaultadminname + '/" -e "/ID_VAULT_HOST=/ s/=.*/=' + vaultip + '/" -e "/ID_VAULT_PASSWORD=/ s/=.*/=' + vaultadminpass + '/" -e "/TOMCAT_SERVLET_HOSTNAME=/ s/=.*/=' + appsip + '/" -e "/SSO_SERVER_HOST=/ s/=.*/=' + appsip + '/" -e "/CONFIGURATION_PWD=/ s/=.*/=' + ssopass + '/" -e "/SSO_SERVICE_PWD=/ s/=.*/=' + ssopass + '/" -e "/UA_ADMIN=/ s/=.*/=' + appsadminname + '/" -e "/UA_ADMIN_PWD=/ s/=.*/=' + appsadminpass + '/" -e "/UA_DATABASE_USER=/ s/=.*/=' + postgresusername + '/" -e "/UA_DATABASE_PWD=/ s/=.*/=' + postgresuserpass + '/" -e "/SENTINEL_AUDIT_SERVER=/ s/=.*/=' + sentinelip + '/" /tmp/silent.properties'
    print(command1)

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    channel = client.get_transport().open_session()
    channel.settimeout(1800000)
    try:
        channel.exec_command(command1)
        contents = StringIO()
        error = StringIO()
        while not channel.exit_status_ready():
            if channel.recv_ready():
                data = channel.recv(1024)
                print(data)
                while data:
                    contents.write(data)
                    data = channel.recv(1024)
            if channel.recv_stderr_ready():
                error_buff = channel.recv_stderr(1024)
                while error_buff:
                    error.write("error")
                    error_buff = channel.recv_stderr(1024)
        exit_status = channel.recv_exit_status()

    except socket.timeout:
        raise socket.timeout
    client.close()

    ret = 'All properties successfully saved in ' + vaultip+'.'
    print(ret)
    return jsonify(ret), 200

@app.route('/idmtools/api/save', methods=['POST'])
def save():

    logger.info('api called')

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    ssopass = params.get('ssopass', None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)

    logger.info(vaultip)

    if not vaultip:
        return jsonify(
            {"msg": "Please provide a proper ip where you want to create Identity Vault."}), Status.HTTP_BAD_REQUEST
    if not vaulttreename:
        return jsonify({"msg": "Plese provide a valid and unique Tree name."})
    if not boxusername:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not boxpass:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not vaultadminname:
        return jsonify({"msg": "Please provide your vault admin username in LDAP format"}), Status.HTTP_BAD_REQUEST
    if not appsadminname:
        return jsonify(
            {"msg": "Please provide you Identity apps admin username in LDAP format."}), Status.HTTP_BAD_REQUEST
    if not buildid:
        buildid = 'lastSuccessfulBuild'
    if not vaultadminpass:
        vaultadminpass = "novell"
    if not ssopass:
        ssopass = "novell"
    # if buildid == None:
    #     buildid = "lastSuccessfulBuild"
    if not appsadminpass:
        appsadminpass = "novell"
    if not postgresusername:
        postgresusername = "idmadmin"
    if not postgresuserpass:
        postgresuserpass = "novell"
    if not postgresadminpass:
        postgresadminpass = "novell"
    if not sentinelip:
        sentinelip = "127.0.0.1"

    # var=download()
    #asd
    #asd
    # var1=copyIso()
    #copysilent()
    #download()

    return jsonify("Installation will be started shortly in "+vaultip+'.'), 200

@app.route('/idmtools/api/save5', methods=['POST'])
def save5():

    logger.info('api called')

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    ssopass = params.get('ssopass', None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)

    logger.info(vaultip)

    if not vaultip:
        return jsonify(
            {"msg": "Please provide a proper ip where you want to create Identity Vault."}), Status.HTTP_BAD_REQUEST
    if not vaulttreename:
        return jsonify({"msg": "Plese provide a valid and unique Tree name."})
    if not boxusername:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not boxpass:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not vaultadminname:
        return jsonify({"msg": "Please provide your vault admin username in LDAP format"}), Status.HTTP_BAD_REQUEST
    if not appsadminname:
        return jsonify(
            {"msg": "Please provide you Identity apps admin username in LDAP format."}), Status.HTTP_BAD_REQUEST
    if not buildid:
        buildid = 'lastSuccessfulBuild'
    if not vaultadminpass:
        vaultadminpass = "novell"
    if not ssopass:
        ssopass = "novell"
    # if buildid == None:
    #     buildid = "lastSuccessfulBuild"
    if not appsadminpass:
        appsadminpass = "novell"
    if not postgresusername:
        postgresusername = "idmadmin"
    if not postgresuserpass:
        postgresuserpass = "novell"
    if not postgresadminpass:
        postgresadminpass = "novell"
    if not sentinelip:
        sentinelip = "127.0.0.1"

    # var=download()
    #asd
    #asd
    # var1=copyIso()
    #copysilent()
    #download()

    return jsonify("Installation will be started shortly in "+vaultip+'.'), 200

@app.route('/idmtools/api/copyRequiredFiles', methods=['POST'])
def copyRequiredFiles():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    logger.info('copy silent called.')

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    # channel = client.get_transport().open_session()
    # channel.settimeout(180000)

    sftp = client.open_sftp()
    sftp.put('../front/src/assets/files/silent.properties', '/tmp/silent.properties')
    sftp.close()
    sftp = client.open_sftp()
    sftp.put('../front/src/assets/files/install_standalone.sh', '/tmp/install_idm.sh')
    sftp.close()

    client.close()
    return jsonify("return"), 200

    # channel.close()

@app.route('/idmtools/api/copyRequiredFiles_vault', methods=['POST'])
def copyRequiredFiles_vault():

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)

    logger.info('copy for vault box called.')

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    sftp = client.open_sftp()
    sftp.put('../front/src/assets/files/silent_apps.properties', '/tmp/silent.properties')
    sftp.close()
    sftp = client.open_sftp()
    sftp.put('../front/src/assets/files/install_apps.sh', '/tmp/install_idm.sh')
    sftp.close()
    client.close()
    return jsonify("return"), 200

    # channel.close()

@app.route('/idmtools/api/copyRequiredFiles_apps', methods=['POST'])
def copyRequiredFiles_apps():

    params = request.get_json()
    vaultip = params.get('appsip', None)
    boxpass = params.get('boxappspass', None)
    boxusername = params.get('boxappsusername', None)

    logger.info('copy for vault box called.')

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    sftp = client.open_sftp()
    sftp.put('../front/src/assets/files/silent_apps.properties', '/tmp/silent.properties')
    sftp.close()
    sftp = client.open_sftp()
    sftp.put('backend/flask_app/assets/files/install_standalone.sh', '/tmp/install_idm.sh')
    sftp.close()
    client.close()
    return jsonify("return"), 200

    # channel.close()


@app.route('/idmtools/api/save_distributed', methods=['POST'])
def save_distributed():
    logger.info('api called')

    params = request.get_json()
    vaultip = params.get('vaultip', None)
    boxpass = params.get('boxpass', None)
    boxusername = params.get('boxusername', None)
    vaulttreename = params.get('vaulttreename', None)
    vaultadminname = params.get('vaultadminname', None)
    vaultadminpass = params.get('vaultadminpass', None)
    appsip = params.get('appsip',None)
    boxappsusername= params.get('boxappsusername',None)
    boxappspass= params.get('boxappspass',None)
    ssopass = params.get('ssopass', None)
    appsadminname = params.get('appsadminname', None)
    appsadminpass = params.get('appsadminpass', None)
    postgresusername = params.get('postgresusername', None)
    postgresuserpass = params.get('postgresuserpass', None)
    postgresadminpass = params.get('postgresadminpass', None)
    sentinelip = params.get('sentinelip', None)
    buildid = params.get('buildid', None)

    logger.info(vaultip)

    if not vaultip:
        return jsonify(
            {"msg": "Please provide a proper ip where you want to create Identity Vault."}), Status.HTTP_BAD_REQUEST
    if not appsip:
        return jsonify(
            {"msg": "Please provide a proper ip where you want to Install Identity apps."}), Status.HTTP_BAD_REQUEST
    if not vaulttreename:
        return jsonify({"msg": "Plese provide a valid and unique Tree name."})
    if not boxusername:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not boxpass:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not boxappsusername:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not boxappspass:
        return jsonify({"msg": "Please provide your machine login credentials."}), Status.HTTP_BAD_REQUEST
    if not vaultadminname:
        return jsonify({"msg": "Please provide your vault admin username in LDAP format"}), Status.HTTP_BAD_REQUEST
    if not appsadminname:
        return jsonify(
            {"msg": "Please provide you Identity apps admin username in LDAP format."}), Status.HTTP_BAD_REQUEST
    if not buildid:
        buildid = 'lastSuccessfulBuild'
    if not vaultadminpass:
        vaultadminpass = "novell"
    if not ssopass:
        ssopass = "novell"
    # if buildid == None:
    #     buildid = "lastSuccessfulBuild"
    if not appsadminpass:
        appsadminpass = "novell"
    if not postgresusername:
        postgresusername = "idmadmin"
    if not postgresuserpass:
        postgresuserpass = "novell"
    if not postgresadminpass:
        postgresadminpass = "novell"
    if not sentinelip:
        sentinelip = "127.0.0.1"

    # var=download()
    #asd
    #asd
    # var1=copyIso()
    #copysilent()
    #download()

    return jsonify("Installation will be started shortly in "+boxappsusername+'.'), 200


@app.route('/idmtools/api/loginCheck', methods=['GET'])
@jwt_required
def LoginCheck():
    """Get dummy data returned from the server."""
    jwt_data = get_jwt()
    if jwt_data['roles'] != 'admin':
        return jsonify(msg="Permission denied"), Status.HTTP_BAD_FORBIDDEN

    identity = get_jwt_identity()
    if not identity:
        return jsonify({"msg": "Token invalid"}), Status.HTTP_BAD_UNAUTHORIZED

    data = {"msg": "Loggeed In"}
    json_response = json.dumps(data)
    return Response(json_response,
                    status=Status.HTTP_OK_BASIC,
                    mimetype='application/json')

@app.route('/idmtools/api/Logs', methods=['POST'])
@jwt_required
def Logs():
        """Get dummy data returned from the server."""
       # time.sleep(100)
        params = request.get_json()
        hostname = params.get('vaultip', '164.99.91.35')
        password = params.get('boxpass', 'novell')
        username = params.get('boxusername', 'root')
        port = 22
        logType = 'download'
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname=hostname, username=username, password=password, port=port)

        try:
            print('configure')
            logType= 'configure'
            sftp = client.open_sftp()
            stdin = sftp.open('/var/opt/netiq/idm/log/idmconfigure.log','r')
            # sftp.close();
        except Exception:
            try:
                print('install')
                logType= 'install'
                # sftp = client.open_sftp()
                stdin = sftp.open('/var/opt/netiq/idm/log/idminstall.log','r')
            except Exception:
                #sftp.close()
                print('download')
                logType= 'download'
                try:
                    stdin = sftp.open('/tmp/download.log','r')
                except Exception:
                    sftp.close()
                    return jsonify('no file'),200
        #sftp.close()
        log = stdin.readlines()
        data={'type':logType,'log':log}
        return jsonify(data),200

