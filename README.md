# SharkPark Monorepo - Local Dev Guide

This repo contains backend (NestJS), mobile (React Native), ML (planned), and shared packages in a single PNPM/Turbo monorepo.

- Root: `pnpm` workspaces + `turbo`
- Backend: `apps/backend` (Nest 11, TS, Jest)
- Mobile: `apps/mobile` (React Native CLI)
- Shared: `packages/types`, `packages/utils`
- ML/service layer (planned): `services/ml/`
- Local infra: DynamoDB Local + LocalStack (S3) via `./scripts/start-local.sh`

---

* [SharkPark Monorepo — Local Dev Guide](#sharkpark-monorepo--local-dev-guide)

  * [Tech choices](#tech-choices)
  * [Prerequisites](#prerequisites)
  * [Clone and install](#clone-and-install)
  * [Local infra (DynamoDB + LocalStack)](#local-infra-dynamodb--localstack)
  * [Build / lint / typecheck (root)](#build--lint--typecheck-root)
  * [Run the backend (NestJS)](#run-the-backend-nestjs)
  * [Run tests (backend)](#run-tests-backend)
  * [Run the mobile app](#run-the-mobile-app)
  * [services/ml (planned)](#servicesml-planned)
  * [File / workspace layout](#file--workspace-layout)
  * [CI (GitHub Actions)](#ci-github-actions)
  * [Env / secrets](#env--secrets)
  * [Deployment (later)](#deployment-later)
  * [Local quickstart](#local-quickstart)

---

## Tech choices

**PNPM + Turbo**  
One workspace to install once and build/lint/test all apps. Turbo lets the CI reuse builds and run tasks per package.

**NestJS (backend)**  
Opinionated, modular, TS-first, easy testing, and easy to add Swagger, auth, and modules.

**React Native CLI (mobile)**  
Full control over native iOS/Android, good for geofencing and background location.

**Shared packages (`packages/types`, `packages/utils`)**  
Single source of truth for contracts between mobile and backend.

**Local infra (DynamoDB Local + LocalStack)**  
Local DB and S3 so no one needs real AWS creds to run the app.

**CI (GitHub Actions)**  
Runs build, lint, typecheck, and backend tests on every push/PR. No deploy in CI.

**services/ml (planned)**  
Keeps ML / AI code separate from Nest and RN. Lets us use heavier deps (PyTorch, transformers, or TS-based inference) without polluting the Node apps, and makes it easy to run ML as its own container.

---

## Prerequisites

- Node: v22.x
- pnpm: `pnpm@10.20.0`
- Docker running
- Xcode (for iOS) or Android Studio (for Android)
- Git

Optional for iOS:
```bash
xcode-select --switch /Applications/Xcode.app
````

---

## Clone and install

```bash
git clone <repo-url> SharkPark
cd SharkPark
pnpm install
```

If you don’t want local infra to start during install (CI, or no Docker):

```bash
SKIP_LOCAL_INFRA=1 pnpm install
```

---

## Local infra (DynamoDB + LocalStack)

```bash
./scripts/start-local.sh
```

This starts:

* `sharkpark-dynamodb` on `8000`
* `sharkpark-localstack` on `4566`

To skip:

```bash
SKIP_LOCAL_INFRA=1 pnpm install
SKIP_LOCAL_INFRA=1 pnpm build
```

In CI:

```yaml
env:
  SKIP_LOCAL_INFRA: "1"
```

---

## Build / lint / typecheck (root)

```bash
pnpm build
pnpm lint
pnpm typecheck
```

---

## Run the backend (NestJS)

```bash
cd apps/backend
pnpm dev
```

API:

```text
http://localhost:3000/api/v1/health
```

Response:

```json
{
  "ok": true,
  "service": "sharkpark-backend"
}
```

---

## Run tests (backend)

From root:

```bash
pnpm -C apps/backend test
pnpm -C apps/backend test:e2e
```

Or inside backend:

```bash
cd apps/backend
pnpm test
pnpm test:e2e
```

* `pnpm test` → unit tests
* `pnpm test:e2e` → hits `/api/v1/health`

---

## Run the mobile app

```bash
cd apps/mobile
npm install
npm run ios
# or
npm run android
```

If you see the `xcodebuild ... requires Xcode` error:

```bash
sudo xcode-select --switch /Applications/Xcode.app
```

RN config files (`metro.config.js`, `babel.config.js`) stay CommonJS so `require(...)` works.

---

## services/ml (planned)

Path: `services/ml/`

Purpose:

* isolate ML/AI logic from Nest and RN
* keep heavy deps (Python or TS ML) out of the app packages
* let backend/mobile call ML over HTTP/gRPC

What goes here:

* model / inference code
* HTTP wrapper (e.g. `/predict`)
* Dockerfile for ML service
* unit tests / sample payloads

Local shape (TS example):

```bash
cd services/ml
pnpm install
pnpm dev
# service on http://localhost:8001
```

Backend → ML:

* backend calls `http://localhost:8001/predict` in local dev
* in real deployment this becomes an internal URL (ECS/K8s)
* keeps versioning of ML independent from Nest

---

## File / workspace layout

```text
SharkPark/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── eslint.config.mjs
├── scripts/
│   └── start-local.sh
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   └── app.service.ts
│   │   ├── test/
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── jest.config.js
│   │   ├── jest-e2e.js
│   │   └── package.json
│   └── mobile/
│       ├── App.tsx
│       ├── android/
│       ├── ios/
│       ├── metro.config.js
│       ├── babel.config.js
│       └── package.json
├── services/
│   └── ml/              # future ML/inference service
└── packages/
    ├── types/
    └── utils/
```

---

## CI (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    env:
      SKIP_LOCAL_INFRA: "1"
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.20.0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install deps
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Backend unit tests
        run: pnpm -C apps/backend test

      - name: Backend e2e tests
        run: pnpm -C apps/backend test:e2e
```

What it does:

* installs
* builds all workspaces
* lints
* typechecks
* runs backend unit + e2e tests
* does not start Docker
* does not deploy

---

## Env / secrets

Local:

```bash
cp .env.example .env.local
```

Put AWS, DB, and service creds in `.env.local`. Do not commit it.

Nest loads env via `@nestjs/config`.

CI: add secrets in GitHub → Actions → Repository secrets.

---

## Deployment (later)

* build Docker for `apps/backend`
* push to registry
* deploy to ECS/Lambda/K8s
* mobile is shipped separately (Expo/EAS or native)
* CI stays as quality gate

`services/ml` can be built and deployed as a separate image, versioned independently.

---

## Local quickstart

```bash
pnpm install
./scripts/start-local.sh
pnpm build
pnpm lint
pnpm typecheck

cd apps/backend
pnpm dev
# http://localhost:3000/api/v1/health

# new terminal
cd apps/mobile
npm install
npm run ios   # or npm run android

# (future)
cd services/ml
pnpm dev
```
