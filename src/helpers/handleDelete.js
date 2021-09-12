export const handleDelete = (
  taskID,
  setLoading,
  dateRange, setDateRange,
  setErrorMessage,
) => {

  setLoading(true);
  fetch('/api/tasks/'+ taskID, {
    method: 'DELETE',
  }).then(
    response => {
      if (response.status === 200){
        setDateRange({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        setLoading(false);
        return {};
      }

      else {
        return response.json();
      }
    }
  ).then(
    data => {
      if ('error' in data){
        setErrorMessage('Error: ' + data.error);
        setLoading(false);
      }
    }
  ).catch( err => {
    setErrorMessage('Internal error. Failed to delete task.');
    setLoading(false);
  });
}
