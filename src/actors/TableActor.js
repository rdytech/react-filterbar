import * as SearchClient from "../clients/SearchClient";

export class TableActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  fetchData(page) {
    if (page !== undefined) {
      this.tableStore.setCurrentPage(page);
    }

    var url = this.tableStore.getUrl();
    SearchClient.search(url, this.tableStore.updateTable.bind(this.tableStore));

    if (this.filterBarStore.persistent) {
      history.pushState({}, "", window.location.origin + url);
      localStorage[window.location.pathname.replace(/\//g, "")] = url.removeSearch("page").search();
    }
  }
}
