from flask import Flask, render_template, request
import xml.etree.ElementTree as ET
import dicttoxml
import requests
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/key', methods=['POST'])
def key_action():
    key = request.form['key']
    url = "http://192.168.0.118:8090/key"

    payload = "<key state=\"press\" sender=\"Gabbo\">"+key+"</key>"
    headers = {
        'Content-Type': 'application/xml'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text.encode('utf8'))

    return 'key pressed for ' + key

if __name__ == '__main__':
    app.run()
