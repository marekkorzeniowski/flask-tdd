# Rebuild docker image after modification of one the building layer e.g. pip intall -r requirements.txt
docker-compose up -d --build

# Run command inside container
docker-compose exec api python -m pytest "src/tests"

# Go to db
docker-compose exec api-db psql -U postgres

# Postgres cmd
# \c api_dev
# \dt
#\q

# Recreate db
docker-compose exec api python manage.py recreate_db

# seed db
docker-compose exec api python manage.py seed_db