from datetime import datetime

def cleanup_task_input(data):
    try:
        if 'date' in data:
            data['date'] = datetime.strptime(str(data['date']), '%d-%m-%Y')
    except ValueError:
        return (False, {'error': 'invalid date format. Please provide date in the format dd-mm-yyyy'})

    return (True, data)


def cleanup_input(collection, data):
    if collection == 'tasks':
        return cleanup_task_input(data)
