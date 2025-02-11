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

# Running remotely

Running this remotely is possible but isnt currently the simplest thing to do. 

Say you want to run this on your internal sever. You can simply `docker compose up` then access it from other machines on your lan (say `http://192.168.1.150:5173`). 

This will open the "frontend" however it wont be able to talk to the backend. You will need to edit `docker-compose.yml` and change all the `http://127.0.0.1` IP addresses to to `http://192.168.1.150`.

You then start `docker compose up` once again and everything should connect.

Most of the features should now work, except the ones that involve the [FileSystemAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) however. That API requires a "secure" context to work, so that means the entire app needs to be run over "https" instead of "http". This means you need to access it from `https://192.168.1.150:5173` not `http://` AND the backend needs to be running securely so that its websocket is `wss` not just `ws`

I currently dont know what the best way of doing this is. Some have suggested using [tailscale serve](https://tailscale.com/kb/1242/tailscale-serve) others have suggested caddy or traefik to do this. Im not certain. If you have a way to solve this in a clean way I am very open to suggestions.

# Development

You can develop this like any other convex project, just run `bun dev` and go through the convex setup proceedures, this will then target convex cloud.

If you want to target localhost via self-hosting then checkout the convex docs for help on that: https://docs.convex.dev/self-hosting