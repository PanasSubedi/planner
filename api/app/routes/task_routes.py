from datetime import datetime, timedelta

from flask import request

from app.respond import respond
from app.mongoapi import MongoAPI

from app import app

@app.route('/api/tasks/<start_date_in>/<end_date_in>')
def get_tasks_by_date_range(start_date_in, end_date_in):
    if start_date_in == "0":
        start_date = datetime.now()
    else:
        try:
            start_date = datetime.strptime(start_date_in, '%d-%m-%Y')
        except ValueError:
            return respond({'error': 'invalid date format. Please provide date in the format dd-mm-yyyy'}, 400)


    if end_date_in == "0":
        end_date = datetime.now()
    else:
        try:
            end_date = datetime.strptime(end_date_in, '%d-%m-%Y')
        except ValueError:
            return respond({'error': 'invalid date format. Please provide date in the format dd-mm-yyyy'}, 400)

    if start_date > end_date:
        return respond({'error': 'Start date cannot be later than end date'}, 400)

    if start_date == end_date:
        end_date = end_date + timedelta(days=1)

    page = int(request.args.get('page', 1))
    per_page = app.config['ITEMS_PER_PAGE']

    db = MongoAPI('tasks')
    (total, data) = db.read(
        page=page,
        per_page=per_page,
        filter={'date': {'$gte': start_date, '$lte': end_date}}
    )

    prev_page = '/api/tasks/{}/{}?page={}'.format(start_date_in, end_date_in, page-1) if page > 1 else None
    next_page = '/api/tasks/{}/{}?page={}'.format(start_date_in, end_date_in, page+1) if page * per_page < total else None
    current_page = '/api/tasks/{}/{}?page={}'.format(start_date_in, end_date_in, page)

    response = {}
    response['links'] = {
        'self': current_page,
        'prev_page': prev_page,
        'next_page': next_page,
    }
    response['total_items'] = total
    response['items'] = data

    return respond(response, 200)
