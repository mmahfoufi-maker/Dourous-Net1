# Dourous-Net1


Plateforme web de gestion éducative permettant de connecter les élèves, professeurs et séances dans un environnement cloud moderne.

##  Description du projet

Dourous-Net est une application web développée dans le cadre d’un projet de fin de module “Build & Ship”.

Elle permet :
- La gestion des élèves
- La gestion des professeurs
- La création de séances (réservations / interactions)
- L’upload de fichiers liés aux séances

L’objectif est de simuler une plateforme éducative moderne en utilisant une architecture cloud serverless.


##  Architecture du système

###  Frontend
- Next.js (App Router)
- React
- Vercel (déploiement CI/CD)

###  Backend (BaaS)
- Supabase
  - Authentification
  - Base de données PostgreSQL
  - Storage (fichiers)



##  Modélisation des données (Supabase)

###  Table A : Users (Élèves)
- id
- name
- email
- role

###  Table B : Profs
- id
- name
- subject
- description

###  Table C : Séances / Interactions
- id
- user_id (FK → Users)
- prof_id (FK → Profs)
- date
- status

###  Storage
- Fichiers liés aux séances :
  - PDF
  - images
  - documents


##  Sécurité (RLS - Row Level Security)

- Chaque utilisateur peut uniquement accéder à ses propres séances
- Isolation des données entre utilisateurs
- Sécurité gérée côté Supabase


##  Fonctionnalités principales

- Authentification (login / signup)
- Liste des professeurs
- Réservation de séances
- Dashboard utilisateur
- Upload de fichiers
- Navigation entre pages



##  Déploiement

- Code source hébergé sur GitHub
- Déploiement automatique via Vercel (CI/CD)
- Chaque `git push` déclenche un build et un déploiement automatique

 Lien de production :  
dourous-net-inky.vercel.app



##  Analyse d’architecture (Cloud)

### 1. Pourquoi Vercel + Supabase ?
L’utilisation de Vercel et Supabase permet de réduire fortement les coûts de départ.

- **CAPEX (coût initial)** : presque nul (pas de serveurs physiques)
- **OPEX (coût opérationnel)** : paiement à l’usage uniquement

Cela permet un lancement rapide sans investissement matériel.



### 2. Scalabilité

Vercel utilise une architecture serverless :
- mise à l’échelle automatique
- pas de gestion de serveurs
- performance optimisée globalement

Contrairement à un data center classique :
- pas de maintenance matérielle
- pas de gestion de climatisation ou serveurs physiques


### 3. Données structurées et non structurées

- **Structurées** : tables Supabase (Users, Profs, Séances)
- **Non structurées** : fichiers uploadés dans Supabase Storage (PDF, images)


##  Identifiants de test
