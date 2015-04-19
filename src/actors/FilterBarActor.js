import * as SharedUtils from '../utils/SharedUtils';

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
    var id = this.filterBarStore.getId();
    var searchUrl = this.filterBarStore.getSearchUrl();
    var queryObject = this.filterBarStore.getQuery();
    var newUrl = searchUrl + "?q=" + queryObject + '&';

    SharedUtils.updateUrl(id, 'filters', queryObject);

    this.tableStore.setUrl(newUrl);
    this.tableStore.setCurrentPage(1);
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
    console.log(savedFiltersPacket);
    this.applyFilters();
  }
}