module.exports = {
  parseRawFilters: function(rawFilters) {
    var rawFilterList = rawFilters.querySelectorAll('dt.filter'),
        rawFilter,
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
  },
  parseRawConfiguration: function(rawConfiguration) {
    return '';
  },
};
