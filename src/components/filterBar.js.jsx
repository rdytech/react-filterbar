var FilterList = require('./filterList.js.jsx');
var ApplyConfigurationButton = require('./applyConfigurationButton.js.jsx');
var ClearConfigurationButton = require('./clearConfigurationButton.js.jsx');
var SaveConfigurationButton = require('./saveConfigurationButton.js.jsx');
var ConfigurationList = require('./configurationList.js.jsx');
var FilterDisplay = require('./filterDisplay.js.jsx');

var FilterBar = React.createClass({
  getInitialState: function() {
    return {
      filters: [],
      configurations: [],
    };
  },
  componentDidMount: function() {
    var filters = window.filterList.map(function(filter) {
      filter.enabled = false;
      filter.query_string = "q["+filter.type+"]["+filter.field+"]";
      return filter;
    });

    this.loadConfigurations();
    this.setState({filters: filters});
  },
  loadConfigurations: function() {
    var configurations = [];

    $.ajax({
      url: this.props.configurations_url,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
        for (var i in data) {
          var name = data[i].name;
          var configuration = JSON.parse(data[i].configuration);

          configurations.push({"name":name,"configuration":configuration});
        }
        this.setState({configurations: configurations});
      }.bind(this),
      error: function(xhr,status,error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      }
    });
  },
  loadConfiguration: function(configuration) {
    this.clearConfiguration();

    configuration = $.extend(true,[],configuration);
    var filters = this.state.filters.slice(0);

    for (var cFilter of configuration) {
      for (var filter of filters) {
        if (cFilter.uid === filter.uid) {
          filter.value = cFilter.value;
          this.setState({filters: filters});
          this.enableFilter(filter);
        }
      }
    }

    this.applyConfiguration();
  },
  saveConfiguration: function(search_title) {
    var filteredArray = this.state.filters.filter(function(filter) {
      return ((filter.enabled === true) && (Object.keys(filter.value !== 0)));
    });

    var filters = filteredArray.map(function(filter) {
      var filterConfig = {};
      filterConfig.uid = filter.uid;
      filterConfig.value= filter.value;
      return filterConfig;
    });

    var payload = {"saved_search": {"search_title": search_title, "filters": filters}};

    $.ajax({
      url: this.props.configurations_url,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(payload),
      dataType: "script",
      success: function(data) {
        this.loadConfigurations();
        this.applyConfiguration();
      }.bind(this),
      error: function(xhr,status,error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      }
    });
  },
  applyConfiguration: function() {
    var filteredArray = this.state.filters.filter(function(filter) {
      return ((filter.enabled === true) && (Object.keys(filter.value !== 0)));
    });

    var payload = filteredArray.map(function(filter) {
      var filterConfig = {};
      filterConfig[filter.query_string] = filter.value;
      var filterParams = $.param(filterConfig);
      return filterParams;
    });

    var result = payload.join("&");

    $.ajax({
      url: this.props.resource_url + "?" + result,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "script",
      success: function(data) {
      },
      error: function(xhr,status,error) {
        console.error("XHR:",xhr);
        console.error("STATUS:",status);
        console.error("ERROR:",error);
      }
    });
  },
  clearConfiguration: function() {
    var filters = this.state.filters.slice(0);
    for (var filter of filters) {
      this.disableFilter(filter);
    }
    this.applyConfiguration();
  },
  enableFilter: function(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = true;
        break;
      }
    }

    this.setState({filters: filters});
  },
  disableFilter: function(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = false;
        filters[i].value = null;
        break;
      }
    }
    this.setState({filters: filters});
  },
  updateFilter: function(filter) {
    var filters = this.state.filters.slice(0);

    for (var i in filters) {
      if (filters[i].uid === filter.uid) {
        filters[i].value = filter.value;
        filters[i].query_string = filter.query_string;
        break;
      }
    }
    this.setState({filters: filters});
  },
  render: function() {
    return (
      <div>
        <div className="btn-group margin-bottom-sm">
          <FilterList filters={this.state.filters} enableFilter={this.enableFilter} />
          <button type="button" className="btn btn-default disabled"><i className="icon icon-download"></i>Export CSV</button>
          <ApplyConfigurationButton onClick={this.applyConfiguration} />
          <ClearConfigurationButton onClick={this.clearConfiguration} />
        </div>
        <SaveConfigurationButton onClick={this.saveConfiguration} onChange={this.updateConfigurationName} />
        <ConfigurationList configurations={this.state.configurations} loadConfiguration={this.loadConfiguration} />
        <FilterDisplay filters={this.state.filters} disableFilter={this.disableFilter} updateFilter={this.updateFilter} />
      </div>
    );
  }
});

module.exports = FilterBar;
