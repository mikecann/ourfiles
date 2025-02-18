![ss1](media/ss1.png)
![ss2](media/ss2.png)
![ss3](media/ss3.png)

# Our Files

A simple private file storage system powered by Convex.

Simply drag and drop files onto the inteface to add files, then drag them out to download them.

The project is built using React, Vite, Typescript, Convex, Tailwind

# Running on Localhost

This project is designed to work with [Convex self-hosted](https://github.com/get-convex/convex-backend/blob/main/self-hosted/README.md).

The simplest way to get everything running together is:

```sh
docker compose up
```

Then open your browser to: http://localhost:5173/

## Convex Dashboard

The dashboard is started as part of the docker compose, simply visit `http://localhost:6791`

You will need an admin key, run the following command to generate one:

```bash
docker compose exec ourfiles-backend ./generate_admin_key.sh
```

## Access from other devices on the LAN

If you want to access the app from your devices you will need to set the "HOST_IP" environment variable before running docker compose. For example:

```sh
bunx cross-env HOST_IP=192.168.1.165 docker compose up
```

Where 192.168.1.165 is the LAN IP address for your machine. You should then be able to open http://192.168.1.165:5173 on another device on your LAN. Note: if you are on Windows you may need to allow access to port 5173 in your windows firewall.

Most of the features should now work.

There is one exception however, the multi-file drag out uses the [FileSystemAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). This API requires a "secure" context to work, so that means the entire app needs to be run over "https" instead of "http". This means you need to access it from `https://192.168.1.150:5173` not `http://` AND the backend needs to be running securely so that its websocket is `wss` not just `ws`

I currently dont know what the best way of doing this is. Some have suggested using [tailscale serve](https://tailscale.com/kb/1242/tailscale-serve) others have suggested caddy or traefik to do this. Im not certain. If you have a way to solve this in a clean way I am very open to suggestions.

# Development

You can develop this like any other convex project, just run `bun dev` and go through the convex setup proceedures, this will then target convex cloud.

If you want to target localhost via self-hosting then checkout the convex docs for help on that: https://docs.convex.dev/self-hosting