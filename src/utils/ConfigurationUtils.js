module.exports = {
  parseConfigurations: function(configurationDiv) {
    var parsedConfiguration = {};
    parsedConfiguration.searchPath = configurationDiv.getAttribute('data-search-url');

    return parsedConfiguration;
  }
}
