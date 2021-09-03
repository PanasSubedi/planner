from app import app
from app.respond import respond

@app.route('/api/')
def index():
    return respond({'message': 'Home page'})
