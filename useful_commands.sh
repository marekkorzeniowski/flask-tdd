# Build images with docker compose
docker compose build
docker compose up

# Create db
docker compose exec api python manage.py recreate_db

# Seed db
docker compose exec api python manage.py seed_db


################################## AWS ##################################
# Create ECR repo
aws ecr create-repository --repository-name test-driven-client --region eu-north-1

### NOTE! Remeber to replase regions! us-west-1 -> eu-north-1
# Build images
docker build \
  -f services/users/Dockerfile \
  -t $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users:dev \
  ./services/users

# Authenticate the Docker CLI to use the ECR registry
aws ecr get-login-password --region eu-north-1 \
  | docker login --username AWS --password-stdin $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com


# Push images to ECR
docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users:dev

docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client:dev


# build images with prod tag and then push to ECR
docker build \
  -f services/users/Dockerfile.prod \
  -t $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users:prod \
  ./services/users

docker build \
  -f services/client/Dockerfile.prod \
  -t $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client:prod \
  --build-arg NODE_ENV=production \
  --build-arg VITE_API_SERVICE_URL=${VITE_API_SERVICE_URL} \
  ./services/client

docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users:prod

docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client:prod



docker-compose exec -T api python -m pytest "src/tests" -p no:warnings --cov="src"
docker-compose exec -T api flake8 src
docker-compose exec -T api black src --check
docker-compose exec -T api isort src --check-only
docker-compose exec -T client npm run lint
docker-compose exec -T client npm run prettier:check
docker-compose exec -T client npm run prettier:write