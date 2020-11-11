import pymongo
import os
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew3"]
mycol = mydb["artists"]

if __name__ == '__main__':
    l = []
    for x in mycol.find({},{ "_id": 0}):
        l.append(x)

    with open('artists.json', 'w') as outfile:
        json.dump(l, outfile, indent=4)