var uri = require("URIjs");

export class FilterVerificator {
  constructor(configurationFilters, filtersToApply = null) {
    this.configurationFilters = configurationFilters;
    this.filtersToApply = filtersToApply || this.urlFilters();
  }

  verify() {
    return Object.keys(this.filtersToApply)
            .every(function(i) {
              return this.validateFilter(this.filtersToApply[i]);
            }.bind(this));
  }

  validateFilter(appliedFilter) {
    return Object.keys(this.configurationFilters)
            .some(function(filterUid) {
              var confFilter = this.configurationFilters[filterUid];
              return (
                this.validateFilterProperties(appliedFilter.field, confFilter.field) &&
                this.validateFilterProperties(appliedFilter.type, confFilter.type) &&
                this.validateFilterProperties(appliedFilter.uid, filterUid)
              );
            }.bind(this));
  }

  validateFilterProperties(appliedFilterProperty, confFilterProperty) {
    return (typeof appliedFilterProperty == 'undefined' ||
                   appliedFilterProperty == confFilterProperty);
  }

  urlFilters() {
    var urlFiltersJson = uri(window.location).query(true).q;
    return urlFiltersJson && JSON.parse(urlFiltersJson) || {};
  }
}


