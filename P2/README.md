Vous allez explorer les starters code fournis et lire les codes back-end et front-end. Cette étape est cruciale pour comprendre l’architecture actuelle du projet. Essayez de comprendre l’organisation des fichiers, les classes principales et les interactions front/back.

 

Prérequis
Avoir :

    installé les technologies utilisées : 

        Java 21 et Maven 3.9.3

        Angular 19

        Docker, Docker Compose et Docker Desktop sur votre environnement de travail local

    cloné et ouvert les starters code dans votre environnement de travail ;

    lancé l’application en local :

        le back-end pour confirmer qu’elle démarre avec la base de données

        le front-end pour confirmer qu’elle démarre

Résultat attendu

    Compréhension des starters code front et back et leurs intéractions.

    Les applications back-end et front-end démarrent normalement et communiquent entre elles.

        On arrive à créer un utilisateur agent de la bibliothèque.

Recommandations

    D’abord, suivez les instructions dans le fichier README.md du dépôt back-end afin de lancer le projet.

        Assurez-vous d’avoir installé Docker, Docker Compose et Docker Desktop sur votre environnement de travail local.

    Démarrez le code back-end : 

        Ouvrez le fichiersrc/main/resources/application.yml. Les credentials d’accès à la base de données sont masqués par des variables d’environnement. Ces variables d’environnement sont définies dans le fichier .env

        Ouvrez le fichiercompose.yaml. Il définit la base de données MySQL qui est démarrée avec l’application et qui contient les données nécessaires au fonctionnement du back-end.

        Parcourez les configurations et les couches de l’application

        Lancez le back-end. Pour cela, veuillez lire la documentation README.md du projet, section Démarrage du back-end.

    Démarrez le code front-end :

        Installez les dépendances du projet avec la commande :npm install

        Parcourez les fichiers contenus dans le répertoiresrc/apppour comprendre les configurations.

        Lancez le front-end (npm run start)

    Testez l'enregistrement d’un agent de la bibliothèque :

        Lorsque le front-end est lancé, ouvrez votre navigateur et saisissez l’adresse : http://localhost:4200/register

        Remplissez le formulaire d’enregistrement d’un nouvel utilisateur et valider.

        Lisez les logs du back-end. Vous devez voir la trace d’insertion d’un nouvel utilisateur dans la table des utilisateurs.

    Vous pouvez vous connecter aussi à la base de données via Docker Desktop et consulter la tableuser.

        Un nouvel utilisateur doit apparaître dans cette table de données.

        Pour rappel, dans le README.md du projet, il est indiqué pas à pas comment se connecter à la base de données et consulter le contenu de la tableuser.

    Prenez des notes lors de vos explorations des starters code, en particulier des endroits où vous avez besoin de creuser plus profondément.

Points de vigilance

    Ne modifiez pas encore le code à cette étape.

    Ne vous arrêtez pas seulement à la structure des fichiers : regardez aussi le contenu logique.

    Vérifiez le comportement visuel (même si c’est encore simple).

Outils

    Les IDE :

        VS Code

        IntelliJ

    Angular CLI

    Java 21

    Maven 3.9.3

    Docker, Docker Compose et Docker Desktop

Ressources

    Documentation sur l'installation de Docker, Docker Compose et Docker Desktop :

        https://docs.docker.com/desktop/

        https://docs.docker.com/engine/install/
