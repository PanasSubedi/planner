export const handleAddEdit = (
  url, method,
  title, date, getDateInFormat,
  setLoading, setDateRange, setShowCreateDialog, setDateRangeLabel, setCreateError,
) => {

  setLoading(true);
  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'title': title,
      'date': getDateInFormat(date, 'api'),
    })
  }).then(
    response => {
      if (response.status === 200){
        setDateRange({
          startDate: date,
          endDate: date,
        });

        setLoading(false);
        setShowCreateDialog(false);
        return {};
      }

      else {
        return response.json();
      }
    }
  ).then(
    data => {
      if ('error' in data){
        setCreateError('Error: ' + data.error);
        setLoading(false);
      }
    }
  ).catch( err => {
    setCreateError('Internal error. Failed to create task.');
    setLoading(false);
  });
}
