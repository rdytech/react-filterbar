export class FilterBarActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  getFilter(filterUid) {
    return this.filterBarStore.getFilter(filterUid)
  }

  enableFilter(filterUid) {
    this.filterBarStore.enableFilter(filterUid);
  }

  disableFilter(filterUid) {
    this.filterBarStore.disableFilter(filterUid);
  }

  disableAllFilters() {
    this.filterBarStore.disableAllFilters();
    this.applyFilters();
  }

  updateFilter(filterUid, value) {
    this.filterBarStore.updateFilter(filterUid, value)
  }

  getEnabled() {
    return this.filterBarStore.getEnabled();
  }

  getDisabled() {
    return this.filterBarStore.getDisabled();
  }

  applyFilters() {
    var base64Query = this.filterBarStore.getBase64Query();
    var tableBaseUrl = this.tableStore.getBaseUrl();
    var newUrl = tableBaseUrl + "?q=" + base64Query + "&";

    localStorage[window.location.pathname.replace(/\//,'')] = base64Query;
    history.pushState({}, "", newUrl);

    this.tableStore.setUrl(newUrl);
    this.tableStore.fetchData();
  }

  saveFilters(name) {
    var enabledFilters = this.filterBarStore.getEnabled(),
        savedFiltersPacket = {};
    savedFiltersPacket.search_title = name;
    savedFiltersPacket.filters = {}
    for (var filterUid in enabledFilters) {
      savedFiltersPacket.filters[filterUid] = enabledFilters[filterUid].value;
    }
  }
}