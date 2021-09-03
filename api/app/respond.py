from flask import Response, json

def respond(response, status_code=200):
    return Response(
        response=json.dumps(response),
        status=status_code,
        mimetype='application/json'
    )
