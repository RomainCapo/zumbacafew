import lyricsgenius
import json
import re
import string
import os
import unidecode
import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew2"]
mycol = mydb["artists"]

l = []

for x in mycol.find({},{ "_id": 0}):
    l.append(x)

with open('artists.json', 'w') as outfile:
    json.dump(l, outfile, indent=4)