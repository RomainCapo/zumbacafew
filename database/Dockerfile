FROM mongo
COPY init.json /init.json
CMD mongoimport --db zumba_cafew --collection artists --type json --file /init.json