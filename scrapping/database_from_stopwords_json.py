import pymongo
import os
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew2"]
mycol = mydb["stopwords"]

FILE_NAME = 'stopwords.json'
DIR = 'stopwords'

if FILE_NAME.endswith(".json"):
    with open(os.path.join(DIR, FILE_NAME)) as json_file:
        data = json.load(json_file)
        mycol.insert_one(data)
