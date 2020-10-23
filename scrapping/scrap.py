from bs4 import BeautifulSoup
import requests

def save_csv(artists, output='artists.csv'):
    with open(output, 'a') as f:
        for artist in artists:
            f.write(artist + "\n")

def scrap_wikipedia(url='https://fr.wikipedia.org/wiki/Cat%C3%A9gorie:Rappeur_fran%C3%A7ais'):
    artists = []
    
    r = requests.get(url)
    if r.status_code == 200:
        soup = BeautifulSoup(r.text, 'lxml')
        artists = [a.text.split(' ')[0] for a in soup.find('div', {'class': 'mw-category'}).find_all('a')]
    
    return artists


if __name__ == '__main__':
    artists = scrap_wikipedia()
    save_csv(artists)
