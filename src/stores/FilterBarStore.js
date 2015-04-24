import * as SharedUtils from '../utils/SharedUtils';

import * as FilterClient from '../clients/FilterClient';

export class FilterBarStore {
  constructor(configuration) {
    this.CHANGE_EVENT = 'change';
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.saveSearchUrl = configuration.saveSearchUrl;
    this.savedSearchUrl = configuration.savedSearchUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.filters = configuration.filters;

    var filter, filterUid;

    for (var i = 0; i < Object.keys(this.filters).length; i++) {
      filterUid = Object.keys(this.filters)[i];
      filter = this.filters[filterUid];

      if (filter.url) {
        FilterClient.updateFilterOptions(filter);
      }
    }

    this.receieveSavedSearches();
  }

  getId() {
    return this.id;
  }

  getSearchUrl() {
    return this.searchUrl;
  }

  getSaveSearchUrl() {
    return this.saveSearchUrl;
  }

  getSavedSearches() {
    return this.savedSearches || [];
  }

  getSavedSearch(searchId) {
    return this.savedSearches[searchId];
  }

  getFilter(filterUid) {
    return this.filters[filterUid];
  }

  getDisabled() {
    var disabledFilters = {};
    for (var filterUid in this.filters) {
      if (this.filters[filterUid].enabled === false) {
        disabledFilters[filterUid] = this.filters[filterUid];
      }
    }
    return disabledFilters;
  }

  getEnabled() {
    var enabledFilters = {};
    for (var filterUid in this.filters) {
      if (this.filters[filterUid].enabled === true) {
        enabledFilters[filterUid] = this.filters[filterUid];
      }
    }
    return enabledFilters;
  }

  getQuery() {
    var enabledFilters = Object.keys(this.getEnabled()).map(function(filterUid) {
      var filter = this.getFilter(filterUid);
      return {
        uid: filterUid,
        type: filter.type,
        field: filter.field,
        value: filter.value
      };
    }, this);
    return enabledFilters.length > 0 ? JSON.stringify(enabledFilters) : '';
  }

  /* Mutation Methods */
  receieveSavedSearches() {
    SharedUtils.ajaxGet(
      this.savedSearchUrl,
      'json',
      function(response) {
        this.savedSearches = response;
        this.emitChange();
      }.bind(this)
    );
  }

  disableAllFilters() {
    var enabledFilters = this.getEnabled();

    for (var filterUid in enabledFilters) {
      this.disableFilter(filterUid);
    }
    this.emitChange();
  }

  disableFilter(filterUid) {
    this.filters[filterUid].enabled = false;
    this.filters[filterUid].value = '';
    this.emitChange();
  }

  enableFilter(filterUid, value) {
    this.filters[filterUid].enabled = true;
    this.filters[filterUid].value = value || '';
    this.emitChange();
  }

  updateFilter(filterUid, propKey, propValue) {
    this.filters[filterUid][propKey] = propValue;
    this.emitChange();
  }

  emitChange() {
    this.eventEmitter.emit(this.CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.eventEmitter.on(this.CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
  }
}
