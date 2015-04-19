import * as SharedUtils from '../utils/SharedUtils';

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
    var id = this.tableStore.getId();
    var currentUrl = this.tableStore.getUrl();
    var newUrl = currentUrl + 'page=' + page + '&';

    SharedUtils.updateUrl(id, 'page', page);

    this.tableStore.setCurrentPage(page);
    this.tableStore.fetchData();
  }
}
