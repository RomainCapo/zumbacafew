import lyricsgenius
import json
import re
import string
import os
import unidecode
import pymongo

from collections import Counter, OrderedDict

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["zumba_cafew3"]
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
"Casseurs Flowters",
"columbine"]


MAX_SONGS = 50
LYRICS_THRESHOLD = 20000

with open(FILENAME, encoding='utf-8') as file:
    for artist_name in file.read().split('\n'):
        artist_dict = {}
        artist = genius.search_artist(artist_name, max_songs=MAX_SONGS, sort="popularity")
        
        artist_dict["name"] = unidecode.unidecode(artist.name)
        artist_dict["image_url"] = artist.image_url
        artist_dict["sexe"] = ("Woman" if artist_name in womans else "Men")
        artist_dict["type"] = ("Group" if artist_name in groups else "Individual")

        vocab_year = []
        vocab = []
        years = []
        songs_names = []
        num_songs = 0
        year_value = "0"
        i = 0
        index_year = {}
        for song in artist.songs:
            if song.lyrics and song.year: 
                if len(vocab) > LYRICS_THRESHOLD:
                    break

                year_value = int(song.year.split("-")[0])
                years.append(year_value)
                lyrics_processed = process_lycrics(song.lyrics)
                vocab.extend(lyrics_processed)
                songs_names.append(unidecode.unidecode(song.title))
                num_songs+=1



                if year_value not in index_year:
                    index_year[year_value] = i
                    vocab_year.append({'year':year_value, 'words':lyrics_processed})
                    i+=1

                else:
                    vocab_year[index_year[year_value]]['words'].extend(lyrics_processed)

        for i,v in enumerate(vocab_year):
            vocab_year[i]["words"] = [{'word': word, 'count': count} for word, count in Counter(v["words"]).items()]


        artist_dict["vocab_length"] = (len(vocab) if len(vocab) < LYRICS_THRESHOLD else LYRICS_THRESHOLD)
        artist_dict["vocab_number_unique_word"] = len(list(set(vocab[0:LYRICS_THRESHOLD])))
        artist_dict["is_complete"] = (False if len(vocab) < LYRICS_THRESHOLD else True)
        artist_dict["num_songs"] = num_songs
        artist_dict["titles"] = songs_names
        years.sort()
        artist_dict["years"] = years
        artist_dict["vocab"] = vocab_year 
        
        mycol.insert_one(artist_dict)
