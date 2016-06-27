var uri = require("URIjs");

export class FilterVerificator {
  constructor(configuration) {
    this.configurationFilters = configuration.filterBarConfiguration.filters;
    this.urlFiltersJson = uri(window.location).query(true).q;
  }

  verify() {
    if (!this.urlFiltersJson) {
      return true;
    }

    var urlFilters = JSON.parse(this.urlFiltersJson),
        configurationMap = this.configurationFiltersMap();

    for (var filter of urlFilters) {
      var signature = this.filterSignature(filter.uid, filter);
      
      if (typeof configurationMap[signature] === 'undefined') {
        return false;
      }
    }

    return true;
  }

  configurationFiltersMap() {
    var map = {};

    Object.keys(this.configurationFilters).map(function(filterUid) {
      var filter = this.configurationFilters[filterUid],
          signature = this.filterSignature(filterUid, filter);
      
      map[signature] = true;
    }.bind(this));

    return map;
  }

  filterSignature(uid, filter) {
    return [uid, filter.type, filter.field].join(',');
  }
}


