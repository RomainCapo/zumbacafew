import lyricsgenius
import json
import re
import string
import os
import unidecode

from collections import Counter, OrderedDict

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

womans = ["Wejdene", "Diam's", "Aya Nakamura", "imen es"]
groups = ["13 Organisé", 
"Suprême NTM", 
"Sexion d’Assaut", 
"IAM", 
"1995", 
"Sniper",
"Casseurs Flowters"]

MAX_SONGS = 50
ARTIST_FOLDER = "artists"

if not os.path.exists(ARTIST_FOLDER):
    os.makedirs(ARTIST_FOLDER)

for artist_name in artists:
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
        
    vocab = []
    years = []
    for song in artist.songs:
        vocab.extend(process_lycrics(song.lyrics))
        if song.year:
            years.append(int(song.year.split("-")[0]))
    
    vocab_length = len(set(vocab))
    artist_dict["vocab_length"] = vocab_length
    artist_dict["vocab_ratio"] = vocab_length/artist.num_songs
    artist_dict["num_songs"] = artist.num_songs
    artist_dict["year_avg"] = round(sum(years)/len(years))
    artist_dict["vocab"] = Counter(vocab)
    
    with open(os.path.join(ARTIST_FOLDER, artist.name.replace(" ", "_") + ".json"), "w") as file:  
        json.dump(artist_dict, file) 