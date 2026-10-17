# No Quarter

No Quarter is the Vue.js frontend for **Deathwish**, a League of Legends specialized tracking project.
It displays player statistics collected by a Python data collector stored in a JSON file on Cloudflare R2.

## Stack

- **Vue 3**, **Vite**
- **Docker**, **Nginx**, **Google Cloud Build**
- **Google Cloud Run** & **Cloudflare R2** for data storage since it's really light, might be upgraded to a standard database later.

## Deployment

GitHub-triggered CI/CD pipeline automatically builds and deploys whenever changes are pushed to `main`.

## The Deathwish project

No Quarter is a frontpage for the Deathwish project, for the data pipeline check out github/theopopelin/violentometre.
