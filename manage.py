from flask.cli import FlaskGroup

from src import create_app, db   # new
from src.api.users.models import User  # new


app = create_app()  # new
# thanks to create_app=create_app @app.shell_context_processor ->  def ctx() is accesible
cli = FlaskGroup(create_app=create_app)  # new


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@cli.command('seed_db')
def seed_db():
    db.session.add(User(username='michael', email="hermanmu@gmail.com"))
    db.session.add(User(username='michaelherman', email="michael@mherman.org"))
    db.session.commit()

if __name__ == '__main__':
    cli()