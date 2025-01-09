import pytest

from src import app, db

# Alternative
# @pytest.fixture(scope='module')
# def test_client():
#     # Set the Testing configuration prior to creating the Flask application
#     os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
#     flask_app = create_app()
#
#     # Create a test client using the Flask application configured for testing
#     with flask_app.test_client() as testing_client:
#         # Establish an application context
#         with flask_app.app_context():
#             yield testing_client  # this is where the testing happens!


@pytest.fixture(scope='module')
def test_app():
    app.config.from_object('src.config.TestingConfig')
    with app.app_context():
        yield app  # testing happens here


@pytest.fixture(scope='module')
def test_database():
    db.create_all()
    yield db  # testing happens here
    db.session.remove()
    db.drop_all()