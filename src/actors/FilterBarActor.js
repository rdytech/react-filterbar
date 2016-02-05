import * as SearchClient from "../clients/SearchClient";
import * as URLHelper from "../helpers/URLHelper";

function updateTable(tableStore) {
  return function (tableStateObject) {
    tableStore.setRows(tableStateObject.results);
    tableStore.setCurrentPage(tableStateObject.current_page);
    tableStore.setTotalPages(tableStateObject.total_pages);
    tableStore.setSelectedValues(tableStateObject.selectedValues);
    tableStore.emitChange();
  };
}

export class FilterBarActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
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

  applyFilters() {
    var url = URLHelper.updateUrlSearch(
                this.filterBarStore.getSearchUrl(),
                "q",
                this.filterBarStore.getQuery()
              ).toString();

    this.tableStore.setUrl(url);
    this.tableStore.setCurrentPage(1);
    this.tableStore.setSelectedValues([]);

    url = this.tableStore.getUrl();

    SearchClient.search(url, updateTable(this.tableStore));

    if (this.filterBarStore.persistent) {
      URLHelper.updateApplicationUrlState(url);
    }
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
    var savedSearchPacket = {
      saved_search: {
        filters: {},
        search_title: name
      }
    };

    for (var [filterUid, filter] of this.filterBarStore.enabledFilters()) {
      savedSearchPacket.saved_search.filters[filterUid] = filter.value;
    }

    SearchClient.saveSearch(
      this.filterBarStore.getSavedSearchesUrl(),
      savedSearchPacket,
      function() {
        SearchClient.getSavedSearches(
          this.filterBarStore.getSavedSearchesUrl(),
          this.filterBarStore.setSavedSearches.bind(this.filterBarStore)
        );
      }.bind(this)
    );

    this.applyFilters();
  }
}

