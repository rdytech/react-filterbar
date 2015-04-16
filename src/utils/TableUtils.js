module.exports = {
  parseRawColumns: function(rawColumns) {
    var rawColumnList = rawColumns.querySelectorAll('dt.column'),
        rawColumn,
        parsedColumnList = {};

    for (var i = 0; i < rawColumnList.length; i++) {
      rawColumn = rawColumnList[i];
      parsedColumnList[rawColumn.getAttribute('data-field')] = {
        heading: rawColumn.getAttribute('data-heading')
      };
    }
    return parsedColumnList;
  },
  parseRawConfiguration: function(rawConfiguration) {
    var parsedConfiguration = {
      dataUrl: rawConfiguration.getAttribute('data-url')
    };
    return parsedConfiguration;
  },
};
