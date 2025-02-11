![ss1](media/ss1.png)
![ss2](media/ss2.png)
![ss3](media/ss3.png)

# OurFiles

A simple private file storage system powered by Convex.

Simply drag and drop files onto the inteface to add files, then drag them out to download them.

The project is built using React, Vite, Typescript, Convex, Tailwind

# Running

This project is designed to work with [Convex self-hosted](https://github.com/get-convex/convex-backend/blob/main/self-hosted/README.md).

The simplest way to get everything running together is:

```sh
bun install
bun run build
docker compose up
```

Then open your browser to: http://localhost:5173/

### Convex Dashboard

Visit `http://localhost:6791`

To generate an admin key, run the following command:

```bash
docker compose exec backend ./generate_admin_key.sh
```

# Development

You can develop this like any other convex project, just run `bun dev` and go through the convex setup proceedures, this will then target convex cloud.

If you want to target localhost via self-hosting then checkout the convex docs for help on that: https://docs.convex.dev/self-hosting