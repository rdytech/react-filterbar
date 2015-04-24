import * as SharedUtils from '../utils/SharedUtils';

import * as SearchClient from '../clients/SearchClient';

export class FilterBarActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  getSavedSearches() {
    return this.filterBarStore.getSavedSearches() || [];
  }

  getFilter(filterUid) {
    return this.filterBarStore.getFilter(filterUid);
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
    this.filterBarStore.updateFilter(filterUid, propKey, propValue);
  }

  getEnabled() {
    return this.filterBarStore.getEnabled();
  }

  getDisabled() {
    return this.filterBarStore.getDisabled();
  }

  applyFilters() {
    var url = this.filterBarStore.getSearchUrl();
    var query = this.filterBarStore.getQuery();
    var page = this.tableStore.getCurrentPage();

    SearchClient.search(url, query, page, this.tableStore.updateTable.bind(this.tableStore));

    if (this.filterBarStore.persistent) {
      SharedUtils.updateUrl('q', query);
    }
  }

  loadSavedSearch(searchId) {
    this.disableAllFilters();

    var tim = setTimeout(function() {
      var savedSearch = this.filterBarStore.getSavedSearch(searchId);
      var filters = JSON.parse(savedSearch.configuration);

      for (var filter in filters) {
        this.enableFilter(filter, filters[filter]);
      }

      this.applyFilters();
    }.bind(this), 1000);
  }

  saveFilters(name) {
    var enabledFilters = this.filterBarStore.getEnabled(),
        savedFiltersPacket = {};
    savedFiltersPacket.search_title = name;
    savedFiltersPacket.filters = {};
    for (var filterUid in enabledFilters) {
      savedFiltersPacket.filters[filterUid] = enabledFilters[filterUid].value;
    }
    SharedUtils.ajaxPost(this.filterBarStore.getSaveSearchUrl(), 'json', savedFiltersPacket);
    this.applyFilters();
  }

  getOptionsFromServer(filterUid) {
    var filter = this.getFilter(filterUid);

    var url = filter.url;

    SharedUtils.ajaxGet(url, 'json', function(response) {
      this.updateFilter(filterUid, 'options', response);
    }.bind(this));
  }
}

