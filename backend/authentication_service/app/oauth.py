import os
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

config_data = {
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
    "SECRET_KEY": os.getenv("SECRET_KEY")
}
config = Config(environ=config_data)

oauth = OAuth(config)
oauth.register(
    name="google",
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)
