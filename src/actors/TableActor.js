export class TableActor {
  constructor(tableStore) {
    this.tableStore = tableStore;
  }

  getColumnHeadings() {
    return this.tableStore.getColumnHeadings();
  }

  getRows() {
    return this.tableStore.getRows();
  }

  getCurrentPage() {
    return this.tableStore.getCurrentPage();
  }

  getTotalPages() {
    return this.tableStore.getTotalPages();
  }

  fetchPagedData(page) {
    var currentUrl = this.tableStore.getUrl();
    var newUrl = currentUrl + 'page=' + page + '&';

    history.pushState({}, "", newUrl);
    localStorage[window.location.pathname.replace(/\//g,'')] = window.location.search;

    this.tableStore.setCurrentPage(page);
    this.tableStore.fetchData();
  }
}
