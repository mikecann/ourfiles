![ss1](media/ss1.png)
![ss2](media/ss2.png)
![ss3](media/ss3.png)

# OurFiles

A simple private file storage system powered by Convex.

Simply drag and drop files onto the inteface to add files, then drag them out to download them.

The project is built using React, Vite, Typescript, Convex, Tailwind

# Installation

This project is designed to work with [Convex self-hosted](https://github.com/get-convex/convex-backend/blob/main/self-hosted/README.md).

```sh
bun i
```

## Running the frontend & backend together

```sh
bun dev
```

## Self-hosted Docker Instructions

To run just the frontend, you can run `bun run dev:frontend`.

You can run the backend and dashboard with the following command:

```sh
docker compose up
```

## To use the Convex Dashboard

Visit `http://localhost:6791`

To generate an admin key, run the following command:

```bash
docker compose exec backend ./generate_admin_key.sh
```
