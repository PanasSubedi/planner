from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

from app.routes import crud_routes, task_routes
from app import errors
