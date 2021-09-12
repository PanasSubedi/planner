import {
  Button, Typography
} from '@material-ui/core';

export const renderPagination = (links, currentPage, setCurrentPage) => {

  if (Object.keys(links).length === 0){
    return
  }

  else if (links.next_page === null && links.prev_page === null){
    return
  }

  else {
    return (
      <>
        <Button onClick={() => setCurrentPage(currentPage-1)} disabled={links.prev_page === null}>&lt;</Button>
        <Typography variant="caption">Page { currentPage }</Typography>
        <Button onClick={() => setCurrentPage(currentPage+1)} disabled={links.next_page === null}>&gt;</Button><br/>
      </>
    )
  }

}
