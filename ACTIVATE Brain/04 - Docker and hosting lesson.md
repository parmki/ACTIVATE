# Docker and hosting: a hands-on lesson

## What you are building

You will package ACTIVATE into an image, run it in a container on your own computer, and open it in a browser. This is local practice. A public website needs a hosting service and is a separate decision.

```text
Your browser -> localhost:3001 -> container port 3000 -> Next.js
                                         |
                           app files inside the image
Personal data -> browser storage on this origin (not the container)
```

An **image** is a packaged, read-only template. A **container** is a running instance of that image. A **Dockerfile** is the recipe used to build the image. **Compose** describes how to build and run one or more containers; ACTIVATE currently has one service.

## 1. Check the tools

Open a terminal in this folder:

```bash
cd /home/prsib/projects/ACTIVATE
docker --version
docker compose version
```

If Docker is missing, this computer was detected as Fedora 44. Docker Engine was not available in the Codex execution environment. You can use your own existing Docker installation if these commands work in your normal terminal. Otherwise follow Docker's official Fedora installation instructions: https://docs.docker.com/engine/install/fedora/ . Read the supported-version and prerequisite checks first. Installing system software or enabling a system service changes your computer and may require your administrator password; do that yourself when ready.

Docker's documented Fedora installation commands configure Docker's package repository, install Docker Engine and its Compose plugin, and start the daemon. Use the latest official instructions rather than copying an old installation script. On Linux, the daemon may require `sudo`; granting the `docker` group access is effectively root-level access, so understand the security implications before following optional post-installation steps.

## 2. Start ACTIVATE

If Docker commands need elevated privileges, prefix each with `sudo` consistently. Then run:

```bash
docker compose up --build
```

Open **http://localhost:3001**. `up` starts the service; `--build` creates or rebuilds the image first. Compose maps `127.0.0.1:3001` on your computer to port `3000` in the container. `127.0.0.1` restricts this local practice setup to this computer. Port 3001 leaves your existing development app on port 3000 alone. If 3001 is already in use, change the host side in `compose.yaml`, e.g. `127.0.0.1:3002:3000`, and use that port in the browser.

Keep the terminal open to see logs. Press **Ctrl+C** to stop the foreground process. To remove the stopped container and its Compose network:

```bash
docker compose down
```

Alternatively use `docker compose up --build -d` to run in the background; inspect it with `docker compose ps` and `docker compose logs -f`, then stop with `docker compose down`. Press Ctrl+C to leave `logs -f`; this does not stop a background container.

## 3. Inspect and experiment

```bash
docker image ls
docker compose ps
docker compose logs
```

Make a small visible change to a source file, then run `docker compose up --build` again. The container is a production-style snapshot: editing source files does not automatically update the running container. Compare this with `npm run dev`, which reloads while you edit.

## 4. Read the Dockerfile

1. **deps** starts with Node 22 Alpine, copies the package manifest and lockfile, and runs `npm ci`. The lockfile makes dependency installation reproducible.
2. **builder** copies dependencies and source files, then runs the Next.js production build. `output: standalone` tells Next.js to prepare a smaller runnable server.
3. **runner** copies the standalone server, static files, and `public` assets. It runs as a non-root user and starts `server.js` on port 3000.

Read the actual [Dockerfile](../Dockerfile) alongside these instructions:

- `FROM node:22-alpine AS deps`: use the official Node 22 Alpine image as a starting point and name this stage `deps`.
- `WORKDIR /app`: set `/app` as the working folder **inside** the image.
- `COPY package.json package-lock.json ./`: copy just the dependency files first. Docker can reuse this layer if application code changes but dependencies do not.
- `RUN npm ci --no-audit --no-fund`: install the dependency versions from the lockfile. `npm ci` is designed for clean, repeatable installs.
- `FROM node:22-alpine AS builder`: start a separate build stage.
- `COPY --from=deps /app/node_modules ./node_modules`: bring the dependencies from the first stage into the build stage.
- `COPY . .`: copy the project files in the build context into `/app`; `.dockerignore` filters the files sent to the build.
- `RUN npm run build`: make the optimized Next.js production build.
- `FROM node:22-alpine AS runner`: start a clean final stage so the image does not contain everything from the build stage.
- `ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0`: configure the Node server for production and let it listen on the container's network interface. Compose still binds the published port to your own computer.
- `RUN addgroup ... && adduser ...`: create a dedicated, non-root app user.
- The three `COPY --from=builder --chown=app:app` lines bring in the standalone server, Next.js static assets, and `public` assets respectively. I added the `public` copy because the logo and background would otherwise be missing.
- `USER app`: run the app as that non-root user.
- `EXPOSE 3000`: document the port the app listens on; it does not publish the port by itself.
- `CMD ["node", "server.js"]`: start the standalone Next.js server when the container starts.

The final image does not include the whole build workspace. [`.dockerignore`](../.dockerignore) excludes local dependencies, generated builds, Git metadata, and environment files from the build context. This makes builds cleaner and prevents accidentally including those local files in the image.

### Why `next.config.mjs` matters

[`next.config.mjs`](../next.config.mjs) sets `output: 'standalone'`, which asks Next.js to prepare the standalone server copied into the runner stage. It also uses separate folders for development (`.next-dev`) and production (`.next`), so building the production app doesn't overwrite files used by a running development server.

### What Compose adds

[`compose.yaml`](../compose.yaml) defines a single service named `activate`. `build: .` tells Docker Compose to build from this folder. The `ports` line maps the host address and port to the container port. Compose doesn't add a database or logins; it simply makes the build/run settings repeatable.


## 5. Understand your data before switching URLs

ACTIVATE's tasks, habits, goals, and profile are stored in browser localStorage. Motivation items and files are stored in browser IndexedDB. They are not stored in the image or container, and deleting a container does not delete browser storage. However, `http://localhost:3000`, `http://localhost:3001`, and a future `https://` hosted URL are **different browser origins**: each has separate data. Your existing data will not automatically appear at a new URL.

Before changing anything, use Profile → Export backup at your existing URL. You may import that JSON at the new URL. **Motivation items and their files are not in that backup yet**, so keep the old browser data and origin until an export/migration feature exists. Clearing browser storage removes local data. This app has no login or cross-device sync yet.

## 6. Docker versus public hosting

Running a container locally is not the same as publishing a site. For AWS practice, a practical future path is to keep Docker for local reproducibility and deploy the Next.js app from a Git repository with Amplify Hosting. Amplify builds and serves the app itself; it does not need this Docker image. AWS documentation says Amplify Hosting supports Next.js versions through 15, including the App Router: https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html .

A public hosted version of today's app would still save data only in each visitor's browser. To use the same account and data across devices, first build Cognito authentication, server-side authorization, and DynamoDB persistence. For uploaded files, a cloud storage design such as S3 would also be needed. Those services are planned, not implemented.

Before creating AWS resources, review current Amplify, Cognito, DynamoDB, data transfer, and logging prices and your account's current free-tier eligibility; configure an AWS Budget alert. A budget alerts you but does not guarantee spending stops. Ask for approval before deploying resources that may incur charges. No AWS resources have been created by this lesson.

## Troubleshooting

- **`docker: command not found`:** Docker Engine/CLI are not installed or are unavailable in your terminal. Follow the official Fedora instructions above.
- **Cannot connect to daemon / permission denied:** Confirm Docker is running, and use `sudo docker ...` if needed. Consult Docker's official install and post-install docs rather than granting broad group access without understanding it.
- **Port already in use:** Change only the first port in Compose, and use the matching URL.
- **App looks unstyled or logo is missing:** Rebuild with `docker compose up --build`; check logs and make sure the image includes `public` and `.next/static`.
- **Build fails downloading packages or base image:** Check your network access and registry availability; the first build needs to fetch dependencies and a base image.
- **Data seems missing:** Check the exact browser, hostname, port, and protocol; browser storage is origin-specific. Don't clear the original origin.

Official Docker concepts: https://docs.docker.com/get-started/docker-overview/ .
