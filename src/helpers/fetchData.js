export const fetchData = (
  setLoading, setErrorMessage, setTasks, setTotalTasks, setLinks,
  startDate, endDate, currentPage
) => {
  setLoading(true);
  setErrorMessage('');
  setTasks([]);
  setTotalTasks(0);
  setLinks({});

  fetch('api/tasks/'+startDate+'/'+endDate+'?page='+currentPage)
    .then(response => response.json())
    .then(data => {

      if ('error' in data){
        setErrorMessage(data.error);
        setLoading(false);
      }

      else {
        setTotalTasks(data.total_items);
        setTasks(data.items);
        setLoading(false);
        setLinks(data.links);
      }
    })
    .catch(() => {
      setErrorMessage('Internal error. Failed to retrieve tasks.');
      setLoading(false);
    });
}
