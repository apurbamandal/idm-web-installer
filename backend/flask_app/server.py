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
                                 error_log=logging)
        print("Server started at: {0}:{1}".format(ip, port))
        http_server.serve_forever()
    except Exception as exc:
        logger.error(exc.message)
        logger.exception(traceback.format_exc())
    finally:
        # Do something here
        pass


@app.route('/idmtools/api/download', methods=['POST'])
@jwt_required
def download():

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

    hostname = vaultip
    port = 22
    username = boxusername
    password = boxpass
    buildISO='http://164.99.91.109:8080/job/IDMLinuxInstaller_idm4.7.0/80/artifact/Identity_Manager_4.7_Linux.iso'
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
    command1 = 'sed -i -e "/ID_VAULT_ADMIN_LDAP=/ s/=.*/=' + vaultadminname + '/" -e "/ID_VAULT_ADMIN=/ s/=.*/=' + vaultadminname + '/" -e "/ID_VAULT_TREENAME=/ s/=.*/=' + vaulttreename + '/" -e "/ID_VAULT_PASSWORD=/ s/=.*/=' + vaultadminpass + '/" -e "/ID_VAULT_HOST=/ s/=.*/=' + vaultip + '/" -e "/TOMCAT_SERVLET_HOSTNAME=/ s/=.*/=' + vaultip + '/" -e "/SSO_SERVER_HOST=/ s/=.*/=' + vaultip + '/" -e "/SSO_SERVER_HOST=/ s/=.*/=' + vaultip + '/" -e "/CONFIGURATION_PWD=/ s/=.*/=' + ssopass + '/" -e "/SSO_SERVICE_PWD=/ s/=.*/=' + ssopass + '/" -e "/UA_ADMIN=/ s/=.*/=' + appsadminname + '/" -e "/UA_ADMIN_PWD=/ s/=.*/=' + appsadminpass + '/" -e "/UA_DATABASE_USER=/ s/=.*/=' + postgresusername + '/" -e "/UA_DATABASE_PWD=/ s/=.*/=' + postgresusername + '/" -e "/SENTINEL_AUDIT_SERVER=/ s/=.*/=' + sentinelip + '/" /tmp/silent.properties'
    print(command1)
    command2 = 'sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/IDM/sys_req.sh'
    command3 = 'sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/user_application/sys_req.sh'
    command4 = 'cd /tmp/idm/'
    command5 = './install.sh -s -f /tmp/a/silent.properties'
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
    # global vaultip
    # global boxusername
    # global boxpass
    # global buildid
    # global vaulttreename
    # global vaultadminname
    # global vaultadminpass
    # global ssopass
    # global appsadminname
    # global appsadminpass
    # global postgresusername
    # global postgresuserpass
    # global sentinelip
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

@app.route('/idmtools/api/copysilent', methods=['POST'])
def copysilent():

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
    sftp.put('../front/src/assets/files/a.sh', '/tmp/install_idm.sh')
    sftp.close()

    client.close()
    return jsonify("return"), 200

    # channel.close()


@app.route('/idmtools/api/s_install', methods=['POST'])
def s_install():
    logger.info('s_install api called')
    hostname = ''
    port = 22
    username = ''
    password = ''

    # command2='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/IDM/sys_req.sh'
    # command3='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/user_application/sys_req.sh'
    command1 = 'cd /tmp/idm/'
    command2 = './install.sh -s -f /tmp/a/silent.properties'
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    channel = client.get_transport().open_session()
    channel.settimeout(180000)

    try:
        channel.exec_command(command1 + "\n" + command2)
        contents = StringIO()
        error = StringIO()
        while not channel.exit_status_ready():
            if channel.recv_ready():
                data = channel.recv(1024)
                print (data)
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

    #channel.exec_command(command1 + "\n" + command2)
    ret = "Identity Manager successfully installed in " + hostname
    print(ret)
    return jsonify(ret), 200


@app.route('/idmtools/api/s_configure', methods=['POST'])
def s_configure():
    logger.info('s_install api called')
    hostname = ''
    port = 22
    username = ''
    password = ''

    # command2='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/IDM/sys_req.sh'
    # command3='sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/user_application/sys_req.sh'
    command1 = 'cd /tmp/idm/'
    command2 = './configure.sh -s -f /tmp/a/silent.properties'
    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=hostname, username=username, password=password, port=port)
    channel = client.get_transport().open_session()
    channel.settimeout(180000)

    try:
        channel.exec_command(command1 + "\n" + command2)
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

    #channel.exec_command(command1 + "\n" + command2)
    ret = "Identity Manager successfully configured in " + hostname
    print(ret)
    return jsonify(ret), 200


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
