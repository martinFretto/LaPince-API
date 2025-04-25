# projet-la-pince-back

## Etapes pour démarrer l'API en local

1 - git clone du projet en local<br>
2 - se placer à la racine du projet et faire un npm i pour installer les dépendances<br>
3 - créer un fichier .env sur le modèle du .env.example<br>
4 - Créer une base de données en local avec les données que vous aurez renseignées dans le .env
    (PG_USER PG_HOST PG_NAME PG_PASSWORD PG_PORT, et DATABASE_URL qui découle des autres données)<br>
5 - Créer les Tables de la BDD avec la commande psql -U <PG_USER> - d <PG_NAME> -f ./data/create_sql (commande à éxécuter en se plaçant à la racine du projet pour avoir accès au fichier create_data.sql)<br> 
6 - Lancer la commande npm run dev

## Pour démarrer l'appli avec Docker 

On se passe de l'étape 2 car les dépendances seront installées grâce au Dockerfile du conteneur node
On se passe des étapes 4 et 5, car la base de données et ses tables sont créées grâce aux instructions du docker-compose.yml<br>

Pour résumer, on a:<br>
1 - git clone du projet en local<br>
2 - créer un fichier .env sur le modèle du .env.example<br>
3 - Lancer la commande docker compose up --build<br>

Pour accéder à la BDD du conteneur: docker exec -it <NOM_DU_CONTENEUR_PG> psql -U <PG_USER> -d <PG_NAME>

## Lancement des tests

Si vous voulez lancer les tests:<br>
1 - Faire un npm install à la racine du projet (certains modules, dont jest, sont indispensables au lancement des tests)<br>
2 - Créer un fichier .env.test sur le modèle de .env.test.example<br>
3 - Créer une base de données en local avec les données que vous aurez renseignées dans le .env.test
    (PG_USER PG_HOST PG_NAME PG_PASSWORD PG_PORT, et DATABASE_URL qui découle des autres données)<br>
4 - Créer les lables de la BDD avec la commande psql -U <PG_USER> - d <PG_NAME> -f ./data/create_sql (commande à éxécuter en se plaçant à la racine du projet pour avoir accès au fichier create_data.sql) <br>
5 - A la racine du projet, lancer la commande: npm run test:func