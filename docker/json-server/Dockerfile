FROM node

RUN npm install -g json-server

COPY db.json .
COPY routes.json .

EXPOSE 3030

CMD ["json-server","-w","db.json","-r","routes.json","-H","0.0.0.0","-p","3030"]
# json-server -w db.json -r routes.json -H 0.0.0.0 -p 3030