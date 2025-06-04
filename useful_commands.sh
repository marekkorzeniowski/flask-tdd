### To decommission after testing
#1 CODE BUILD
#2 ECR - CONTAINER REGISTRY
#3 ALB - load balancer - deleted
  #* listeners - deleted
  #* target groups - deleted
#4 RDS - deleted
#5 ECS - container service - deleted
#6 Cloud Watch - deleted
   #* log groups deleted


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


# Check DB status
aws --region eu-north-1 rds describe-db-instances \
  --db-instance-identifier flask-react-db \
  --query 'DBInstances[].{DBInstanceStatus:DBInstanceStatus}'

# Get db endpoint
aws --region eu-north-1 rds describe-db-instances \
  --db-instance-identifier flask-react-db \
  --query 'DBInstances[].{Address:Endpoint.Address}'

# DB URI example
postgres://webapp:<YOUR_RDS_PASSWORD>@<YOUR_RDS_ADDRESS>:5432/api_prod

# ssh into EC2 instance
ssh -i ~/.ssh/ecs.pem ec2-user@<EC2_PUBLIC_IP>

# find container id
docker ps

# Enter the container
docker exec -it e55cfc18f1c1 bash


### Fargate/Terraform part
docker build \
  --platform linux/amd64 \
  -f services/users/Dockerfile.prod \
  -t $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users-fargate:prod \
  ./services/users

docker build \
  --platform linux/amd64 \
  -f services/client/Dockerfile.prod \
  -t $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client-fargate:prod \
  --build-arg NODE_ENV=production \
  --build-arg VITE_API_SERVICE_URL=http://flask-react-fargate-alb-1722024578.eu-north-1.elb.amazonaws.com \
  ./services/client

aws ecr get-login-password --region eu-north-1 \
  | docker login --username AWS --password-stdin $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com

docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users-fargate:prod
docker push $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client-fargate:prod



### dockex rebuild
#docker buildx build \
#  --platform linux/amd64 \
#  -t 992487938048.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users-fargate:prod \
#  --push .

aws ecr get-login-password --region eu-north-1 \
  | docker login --username AWS --password-stdin $FLASK_REACT_AWS_ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com

docker manifest inspect 992487938048.dkr.ecr.eu-north-1.amazonaws.com/test-driven-users-fargate:prod
docker manifest inspect 992487938048.dkr.ecr.eu-north-1.amazonaws.com/test-driven-client-fargate:prod