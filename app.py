from flask import Flask, render_template, request
import xml.etree.ElementTree as ET
import dicttoxml
import requests

from constants import Connection

app = Flask(__name__)

IP = '192.168.0.118'
PORT = '8090'


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/key', methods=['POST'])
def key_action():
    key = request.form['key']
    url = Connection.URL.format(ip=IP, port=PORT) + '/key'

    payload = "<key state=\"press\" sender=\"Gabbo\">" + key + "</key>"
    headers = {
        'Content-Type': 'application/xml'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text.encode('utf8'))

    return 'key pressed for ' + key


@app.route('/nowPlaying', methods=['GET'])
def now_playing():
    url = Connection.URL.format(ip=IP, port=PORT) + "/now_playing"

    payload = {}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    root = ET.fromstring(response.text.encode('utf8'))
    print(response.text.encode('utf8'))

    if root.find('ContentItem').attrib['source'] == 'STANDBY':
        track = 'NO TRACK'
        artist = 'NO ARTIST'
        album = 'NO ALBUM'
        art_text = ''
    else:
        track = root.find('track').text
        artist = root.find('artist').text
        album = root.find('album').text
        art = root.find('art')
        art_text = art.text

    # art = root.find('art')
    # if art.attrib['artImageStatus'] == 'IMAGE_PRESENT':
    #     art_text = art.text
    # else:
    #     art_text = ''

    print(track)
    print(artist)
    print(album)

    return {'track': track, 'artist': artist, 'album': album, 'art_text': art_text}

if __name__ == '__main__':
    app.run()

# <?xml version="1.0" encoding="UTF-8" ?>
# <nowPlaying deviceID="F45EABFBD157" source="STANDBY">
#     <ContentItem source="STANDBY" isPresetable="false" />
# </nowPlaying>