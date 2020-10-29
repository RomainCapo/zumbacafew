import pymongo
import os
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew"]
mycol = mydb["artists"]

DIR = "..\\artists"

for filename in os.listdir(DIR):
    if filename.endswith(".json"):
        with open(os.path.join(DIR, filename)) as json_file:
            data = json.load(json_file)
            mycol.insert_one(data)
