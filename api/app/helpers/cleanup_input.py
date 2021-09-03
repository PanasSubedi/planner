from datetime import datetime

def cleanup_task_input(data):
    try:
        if 'start_date' in data:
            data['start_date'] = datetime.strptime(data['start_date'], '%d-%m-%Y')
        if 'end_date' in data:
            data['end_date'] = datetime.strptime(data['end_date'], '%d-%m-%Y')
    except:
        return (False, {'error': 'invalid date format. Please provide date in the format dd-mm-yyyy'})
        
    return (True, data)


def cleanup_input(collection, data):
    if collection == 'tasks':
        return cleanup_task_input(data)
