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
