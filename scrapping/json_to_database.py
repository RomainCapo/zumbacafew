import pymongo
import os
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew3"]
mycol = mydb["artists"]


if __name__ == '__main__':
    with open("artists.json") as json_file:
        data = json.load(json_file)
        for artist in data:
            mycol.insert_one(artist)
