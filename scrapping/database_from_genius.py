import lyricsgenius
import json
import re
import string
import os
import unidecode
import pymongo

from collections import Counter, OrderedDict

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew1"]
mycol = mydb["artists"]

FILENAME = "artists.txt"

string.punctuation+='’'

genius = lyricsgenius.Genius("BXGKadnQ5NCjtaEUJwfZ3SdVupRMyNW0B6endNpKPc3Awb46F8_4GpVzqe5mdw0M")

def process_lycrics(lyrics):
    lyrics = lyrics.lower()
    lyrics = unidecode.unidecode(lyrics)
    lyrics = re.sub(r"\[(.*?)\]", " ",lyrics)
    lyrics = re.sub('[%s]' % re.escape(string.punctuation), " ",  lyrics)
    lyrics = re.sub("\n", " ", lyrics)
    lyrics = lyrics.split(" ")
    
    return  [l for l in lyrics if l != '' and l != ' ' ]

def count_words_by_year(vocab):
    counter_vocab = {}
    for y in vocab:
        counter_vocab[str(y)] = Counter(vocab[y])
    return counter_vocab

womans = ["Wejdene", "Diam's", "Aya Nakamura", "imen es"]
groups = ["13 Organisé", 
"Suprême NTM", 
"Sexion d’Assaut", 
"IAM", 
"1995", 
"Sniper",
"Casseurs Flowters"]


MAX_SONGS = 50
LYRICS_THRESHOLD = 20000

with open(FILENAME, encoding='utf-8') as file:
    for artist_name in file.read().split('\n'):
        artist_dict = {}
        artist = genius.search_artist(artist_name, max_songs=MAX_SONGS, sort="popularity")
        
        artist_dict["name"] = artist.name
        artist_dict["image_url"] = artist.image_url

        if artist_name in womans:
            artist_dict["sexe"] = "Woman"
        else:
            artist_dict["sexe"] = "Men"

        if artist_name in groups:
            artist_dict["type"] = "Group"
        else:
            artist_dict["type"] = "Individual"
            
        vocab = {}
        years = []
        year_value = "0"
        for song in artist.songs:
            if song.year:
                year_value = int(song.year.split("-")[0])
                years.append(year_value)
            vocab[year_value] = process_lycrics(song.lyrics)

        vocab_list = list(vocab.values())[0]

        artist_dict["vocab_length"] = len(vocab_list) if len(vocab_list) < LYRICS_THRESHOLD else LYRICS_THRESHOLD
        artist_dict["vocab_number_unique_word"] = len(list(set(vocab_list[0:LYRICS_THRESHOLD])))
        artist_dict["is_complete"] = False if len(vocab_list) < LYRICS_THRESHOLD else True
        artist_dict["num_songs"] = artist.num_songs
        years.sort()
        artist_dict["years"] = years
        artist_dict["vocab"] = count_words_by_year(vocab)
        
        mycol.insert_one(artist_dict)
