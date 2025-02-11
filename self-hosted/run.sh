#!/bin/bash

set -e

./run_backend.sh &
BACKEND_PID=$!

# Wait for the backend to start
while ! curl -f http://127.0.0.1:3210/instance_name >/dev/null 2>&1; do
    sleep .1
done

ADMIN_KEY=$(./generate_admin_key.sh)

# Make a .env.local file with the admin key
echo "CONVEX_SELF_HOSTED_ADMIN_KEY=$ADMIN_KEY" >>.env.local
echo "CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210" >>.env.local

# Deploy the current code to the backend
npx convex self-host dev --until-success

# Handle SIGTERM
# shellcheck disable=SC2064
trap "kill $BACKEND_PID" SIGTERM

# Run the backend, handling SIGTERM
wait $BACKEND_PID
