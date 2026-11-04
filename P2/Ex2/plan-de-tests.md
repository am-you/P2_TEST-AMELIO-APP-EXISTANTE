# Ex2 — plan de tests

Les tests exécutables restent à leur place habituelle, sinon Maven, Jest et Cypress ne les lancent pas.

- Back : `P2/backend/src/test`
- Front Jest : à côté des services et des composants
- Cypress : `P2/frontend`
- Ce dossier : le plan, puis les rapports de couverture

## Déjà lu et lancé

`UserServiceTest` — Mockito, inscription.

- utilisateur null → exception
- login déjà pris → exception
- inscription correcte → `save` appelé

`UserControllerTest` — MockMvc, MySQL 8.0 dans Docker, `POST /api/register`.

- corps vide → 400
- login déjà pris → 400
- inscription correcte → 201

Les 6 tests passent.

## Priorité 1 — back, JUnit et Mockito

| Cas | Entrée | Sortie attendue |
|---|---|---|
| Créer un étudiant | prénom, nom, email libre | étudiant renvoyé |
| Email déjà pris | même email | erreur 400 |
| Liste | aucun id | tous les étudiants |
| Détail | id connu | la fiche |
| Détail inconnu | id absent | 404 |
| Modifier | nom et email libres | fiche mise à jour |
| Modifier vers l'email d'un autre | email déjà utilisé | 400 |
| Supprimer | id connu | 204, puis 404 |
| Login | bon login et bon mot de passe | JWT en texte |
| Login refusé | mauvais mot de passe ou login inconnu | erreur |
| JWT | token signé, expiré, ou d'un autre login | valide, ou refusé |
| Étudiants sans JWT | pas de Bearer | 401 |

Objectif : au moins 80 % de couverture back, avec le rapport dans ce dossier.

## Priorité 2 — front, Jest

Services jeton, garde, intercepteur, service étudiant, puis les composants login et étudiants.

Objectif : au moins 80 % de couverture front, avec le rapport dans ce dossier.

## Priorité 3 — Cypress

Inscription, connexion refusée, connexion réussie, puis liste, ajout, détail, modification, suppression, déconnexion.

Objectif : au moins 80 % de couverture des parcours, avec le rapport dans ce dossier.
