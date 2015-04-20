import * as SharedUtils from '../utils/SharedUtils';

export class FilterBarActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  getSavedSearches() {
    return this.filterBarStore.getSavedSearches() || [];
  }

  getFilter(filterUid) {
    return this.filterBarStore.getFilter(filterUid)
  }

  enableFilter(filterUid, value) {
    this.filterBarStore.enableFilter(filterUid, value);
  }

  disableFilter(filterUid) {
    this.filterBarStore.disableFilter(filterUid);
  }

  disableAllFilters() {
    this.filterBarStore.disableAllFilters();
    this.applyFilters();
  }

  updateFilter(filterUid, propKey, propValue) {
    this.filterBarStore.updateFilter(filterUid, propKey, propValue)
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

    if (this.filterBarStore.persistent) {
      SharedUtils.updateUrl('q', queryObject);
    }

    this.tableStore.setUrl(window.location.href);
    this.tableStore.setCurrentPage(1);
    this.tableStore.fetchData();
  }

  loadSavedSearch(searchId) {
    this.disableAllFilters();

    var savedSearch = this.filterBarStore.getSavedSearch(searchId);
    var filters = JSON.parse(savedSearch.configuration);

    for (var filter in filters) {
      this.enableFilter(filter, filters[filter]);
    }

    this.applyFilters();
  }

  saveFilters(name) {
    var enabledFilters = this.filterBarStore.getEnabled(),
        savedFiltersPacket = {};
    savedFiltersPacket.search_title = name;
    savedFiltersPacket.filters = {}
    for (var filterUid in enabledFilters) {
      savedFiltersPacket.filters[filterUid] = enabledFilters[filterUid].value;
    }
    SharedUtils.ajaxPost(this.filterBarStore.getSaveSearchUrl(), 'json', savedFiltersPacket);
    this.applyFilters();
  }

  getOptionsFromServer(filterUid) {
    var filter = this.getFilter(filterUid);

    var url = filter.url;

    SharedUtils.ajaxGet(url, 'json', function(response) { this.updateFilter(filterUid, 'options', response)}.bind(this));
  }
}