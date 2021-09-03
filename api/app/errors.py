from app.respond import respond

from app import app

@app.errorhandler(404)
def not_found_error(error):
    return respond({'message': 'Page not found'}, 404)

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return respond({'message': 'Internal error occurred.'}, 500)
