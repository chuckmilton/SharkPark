#!/usr/bin/env bash
set -e
docker compose -f docker/docker-compose.yml up -d
echo "✅ Local infra up (DynamoDB + LocalStack)"
