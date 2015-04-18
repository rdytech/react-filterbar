var SharedUtils = require('../utils/SharedUtils');

export class FilterBarStore {
  constructor(filterBarOptions) {
    this.CHANGE_EVENT = 'change';
    this.eventEmitter = new EventEmitter();

    // this.searchUrl        = parseSearchUrl();
    // this.saveSearchUrl    = parseSaveSearchUrl();
    // this.savedSearchUrl   = parseSavedSearchUrl();
    // this.exportResultsUrl = parseexportResultsUrl();
    // this.filters          = parseFilters();

    this.filters = this.parseRawFilterList(
      filterBarOptions.configuration.querySelector('dl.filters').querySelectorAll('dt.filter')
    );

    this.url = filterBarOptions.configuration.querySelector('dt.search-url').getAttribute('data-url');
    this.searchUrl = filterBarOptions.configuration.querySelector('dt.search-url').getAttribute('data-url');

    if (window.location.search != '') {
      var queries = window.location.search.split('?')[1].split('&'),
          enabledFilters,
          query;
      for (var i = 0; i < queries.length; i++) {
        query = queries[i];
        if (query.match(/^q=/)) {
          enabledFilters = JSON.parse(decodeURI(query).substring(2,query.length));
        }
      }
      var filter;
      for (var i = 0; i < enabledFilters.length; i++) {
        filter = enabledFilters[i];
        this.enableFilter(filter.uid, filter.value)
      }
    }
  }

  getSearchUrl() {
    return this.searchUrl;
  }

  getFilter(filterUid) {
    return this.filters[filterUid]
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
      }
    },this);
    return enabledFilters.length > 0 ? 'q=' + JSON.stringify(enabledFilters) + '&' : '';
  }

  getBase64Query() {
    var enabledFilters = Object.keys(this.getEnabled()).map(function(filterUid) {
      var filter = this.getFilter(filterUid);
      return {
        uid: filterUid,
        type: filter.type,
        field: filter.field,
        value: filter.value
      }
    },this);
    enabledFilters = enabledFilters.length > 0 ? btoa(JSON.stringify(enabledFilters)): '';
    console.log(enabledFilters);
    return enabledFilters;
  }

  getQueryString() {
    var enabledFilters = this.getEnabled();
    var filter,
        prefix,
        query_object,
        query_string = '';

    for (var filterUid in enabledFilters) {
      filter = enabledFilters[filterUid];
      prefix = '';
      prefix += 'q';
      prefix += '[' + filter.type + ']';
      query_object = {};
      query_object[filter.field] = filter.value;

      query_string += SharedUtils.serialize(query_object, prefix) + '&';
    }
    return query_string;
  }

  parseRawFilterList(rawFilterList) {
    var rawFilter,
        parsedFilterList = {};

    for (var i = 0; i < rawFilterList.length; i++) {
      rawFilter = rawFilterList[i];
      parsedFilterList[rawFilter.getAttribute('data-uid')] = {
        label: rawFilter.getAttribute('data-label'),
        type: rawFilter.getAttribute('data-type'),
        field: rawFilter.getAttribute('data-field'),
        value: '',
        enabled: false
      };
    }
    return parsedFilterList;
  }

  /* Mutation Methods */
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

  updateFilter(filterUid, value) {
    this.filters[filterUid].value = value;
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
