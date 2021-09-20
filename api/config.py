import os

class Config(object):
    DATABASE = os.environ['DATABASE'] or 'plannerDB'
    DATABASE_HOST = os.environ['DATABASE_HOST'] or 'mongodb://localhost:27017/'
    ITEMS_PER_PAGE = 10
