# ZumbaCafew
**Lien :** https://www.zumbacafew.ch/

## Public cible
* **Public prioritaire :** Personnes écoutant de la musique française (Hip-hop).
* **Public secondaire :** Personnes curieuses et interessé par les statistiques diverse (Personnes tombant sur cet article sur les réseaux sociaux par hasard).

## Intention/objectif
* Présentation de la richesse du vocabulaire (nombre de mot unique) utilisé par chaque artiste de Hip-Hop français. 
* Présentation des mots les plus fréquemment utilisé dans le Hip-hop français et par artiste.
* Présentation de l'utilisation d'un mot au cours du temps dans le Hip-Hop français.

## Source de données
[API Genius](https://docs.genius.com/)

## Description du projet
Le but du projet est de présenter via differentes représentations des statistiques sur les musiques de Hip-hop française ainsi que ces artistes. 

L'objectif est de comparer le nombre de mot utilisé par chaque artiste Hip-Hop francophone. Différents critères de peut être appliqué au graphique comme comparer le vocabulaire des artistes en fonction de la décennie et du sexe. 

Un second objectif est de présenter les mots les plus utilisés dans la musique française et également d'effectuer cette recherche par artiste.

Le dernier objectif est de pouvoir visualiser l'utilisation d'un mot au cours du temps dans les différentes musqiues de Hip-hop francophone.

# Arboresence
* **admin** : contient le rapport et la présentation.
* **docker** : fichier Docker pour le developpement (pour la version de production voir le fichier docker-compose.yml de la branche __deploy__).
* **scrapping** : fichier relatif au scrapping des données et au peuplement de la base de données.
* **server** : fichier du backend NodeJS.
* **vue-zumbacafew** : fichier du frontend VueJS.

# À utiliser en dev mode

In /server remember to :

```sh
cp .env.example .env
```
