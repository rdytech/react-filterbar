(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var FilterBar = require("./components/filterBar.js.jsx");
window.FilterBar = FilterBar;

},{"./components/filterBar.js.jsx":5}],2:[function(require,module,exports){
"use strict";

var ApplyConfigurationButton = React.createClass({
  displayName: "ApplyConfigurationButton",

  render: function render() {
    return React.createElement(
      "button",
      { className: "btn btn-primary", onClick: this.props.onClick },
      React.createElement("i", { className: "icon icon-tick" }),
      "Apply"
    );
  }
});

module.exports = ApplyConfigurationButton;

},{}],3:[function(require,module,exports){
"use strict";

var ClearConfigurationButton = React.createClass({
  displayName: "ClearConfigurationButton",

  render: function render() {
    return React.createElement(
      "button",
      { className: "btn btn-warning", onClick: this.props.onClick },
      React.createElement("i", { className: "icon icon-delete" }),
      "Clear"
    );
  }
});

module.exports = ClearConfigurationButton;

},{}],4:[function(require,module,exports){
"use strict";

var ConfigurationList = React.createClass({
  displayName: "ConfigurationList",

  render: function render() {
    var configurations = this.props.configurations.map(function (configuration) {
      return React.createElement(ConfigurationList.Configuration, {
        configuration: configuration,
        onClick: this.props.loadConfiguration
      });
    }, this);
    if (configurations.length !== 0) {
      return React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
            React.createElement("i", { className: "icon icon-save" }),
            "Saved Searches",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            configurations
          )
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-danger" },
          React.createElement("i", { className: "icon icon-delete" })
        )
      );
    } else {
      return React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle disabled", "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
            React.createElement("i", { className: "icon icon-save" }),
            "Saved Searches",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            configurations
          )
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-danger" },
          React.createElement("i", { className: "icon icon-delete" })
        )
      );
    }
  }
});

ConfigurationList.Configuration = React.createClass({
  displayName: "Configuration",

  onClick: function onClick() {
    this.props.onClick(this.props.configuration.configuration);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { className: "dynamic-text-filter", onClick: this.onClick },
        this.props.configuration.name
      )
    );
  }
});

module.exports = ConfigurationList;

},{}],5:[function(require,module,exports){
"use strict";

var FilterList = require("./filterList.js.jsx");
var ApplyConfigurationButton = require("./applyConfigurationButton.js.jsx");
var ClearConfigurationButton = require("./clearConfigurationButton.js.jsx");
var SaveConfigurationButton = require("./saveConfigurationButton.js.jsx");
var ConfigurationList = require("./configurationList.js.jsx");
var FilterDisplay = require("./filterDisplay.js.jsx");

var FilterBar = React.createClass({
  displayName: "FilterBar",

  getInitialState: function getInitialState() {
    return {
      filters: [],
      configurations: [] };
  },
  componentDidMount: function componentDidMount() {
    var filters = window.filterList.map(function (filter) {
      filter.enabled = false;
      filter.query_string = "q[" + filter.type + "][" + filter.field + "]";
      return filter;
    });

    this.loadConfigurations();
    this.setState({ filters: filters });
  },
  loadConfigurations: function loadConfigurations() {
    var configurations = [];

    $.ajax({
      url: this.props.configurations_url,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (function (data) {
        for (var i in data) {
          var name = data[i].name;
          var configuration = JSON.parse(data[i].configuration);

          configurations.push({ name: name, configuration: configuration });
        }
        this.setState({ configurations: configurations });
      }).bind(this),
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      })
    });
  },
  loadConfiguration: function loadConfiguration(configuration) {
    this.clearConfiguration();

    configuration = $.extend(true, [], configuration);
    var filters = this.state.filters.slice(0);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = configuration[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cFilter = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = filters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var filter = _step2.value;

            if (cFilter.uid === filter.uid) {
              filter.value = cFilter.value;
              this.setState({ filters: filters });
              this.enableFilter(filter);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.applyConfiguration();
  },
  saveConfiguration: function saveConfiguration(search_title) {
    var filteredArray = this.state.filters.filter(function (filter) {
      return filter.enabled === true && Object.keys(filter.value !== 0);
    });

    var filters = filteredArray.map(function (filter) {
      var filterConfig = {};
      filterConfig.uid = filter.uid;
      filterConfig.value = filter.value;
      return filterConfig;
    });

    var payload = { saved_search: { search_title: search_title, filters: filters } };

    $.ajax({
      url: this.props.configurations_url,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(payload),
      dataType: "script",
      success: (function (data) {
        this.loadConfigurations();
        this.applyConfiguration();
      }).bind(this),
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      })
    });
  },
  applyConfiguration: function applyConfiguration() {
    var filteredArray = this.state.filters.filter(function (filter) {
      return filter.enabled === true && Object.keys(filter.value !== 0);
    });

    var payload = filteredArray.map(function (filter) {
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
      success: function success(data) {},
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error("XHR:", xhr);
        console.error("STATUS:", status);
        console.error("ERROR:", error);
      })
    });
  },
  clearConfiguration: function clearConfiguration() {
    var filters = this.state.filters.slice(0);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filter = _step.value;

        this.disableFilter(filter);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.applyConfiguration();
  },
  enableFilter: function enableFilter(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = true;
        break;
      }
    }

    this.setState({ filters: filters });
  },
  disableFilter: function disableFilter(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = false;
        filters[i].value = null;
        break;
      }
    }
    this.setState({ filters: filters });
  },
  updateFilter: function updateFilter(filter) {
    var filters = this.state.filters.slice(0);

    for (var i in filters) {
      if (filters[i].uid === filter.uid) {
        filters[i].value = filter.value;
        filters[i].query_string = filter.query_string;
        break;
      }
    }
    this.setState({ filters: filters });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(FilterList, { filters: this.state.filters, enableFilter: this.enableFilter }),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-default disabled" },
          React.createElement("i", { className: "icon icon-download" }),
          "Export CSV"
        ),
        React.createElement(ApplyConfigurationButton, { onClick: this.applyConfiguration }),
        React.createElement(ClearConfigurationButton, { onClick: this.clearConfiguration })
      ),
      React.createElement(SaveConfigurationButton, { onClick: this.saveConfiguration, onChange: this.updateConfigurationName }),
      React.createElement(ConfigurationList, { configurations: this.state.configurations, loadConfiguration: this.loadConfiguration }),
      React.createElement(FilterDisplay, { filters: this.state.filters, disableFilter: this.disableFilter, updateFilter: this.updateFilter })
    );
  }
});

module.exports = FilterBar;

},{"./applyConfigurationButton.js.jsx":2,"./clearConfigurationButton.js.jsx":3,"./configurationList.js.jsx":4,"./filterDisplay.js.jsx":6,"./filterList.js.jsx":7,"./saveConfigurationButton.js.jsx":11}],6:[function(require,module,exports){
"use strict";

var TextInput = require("./inputs/textInput.js.jsx");
var DateInput = require("./inputs/dateInput.js.jsx");
var SelectInput = require("./inputs/selectInput.js.jsx");

var FilterDisplay = React.createClass({
  displayName: "FilterDisplay",

  render: function render() {
    var filters = [];
    var filteredArray = this.props.filters.filter(function (filter) {
      return filter.enabled === true;
    });

    if (filteredArray.length !== 0) {
      filters = filteredArray.map(function (filter) {
        if (filter.enabled === true) {
          return React.createElement(FilterDisplay.Filter, {
            filter: filter,
            disableFilter: this.props.disableFilter,
            updateFilter: this.props.updateFilter
          });
        }
      }, this);
    } else {
      filters = React.createElement(
        "div",
        null,
        "No Filters Enabled"
      );
    }

    return React.createElement(
      "div",
      { className: "navbar filterbar" },
      React.createElement(
        "div",
        { className: "panel panel-default", id: "filters" },
        filters
      )
    );
  }
});

FilterDisplay.Filter = React.createClass({
  displayName: "Filter",

  disableFilter: function disableFilter() {
    this.props.disableFilter(this.props.filter);
  },
  render: function render() {
    var inputs = React.createElement(FilterDisplay.Filter.Inputs, {
      filter: this.props.filter,
      updateFilter: this.props.updateFilter
    });
    return React.createElement(
      "div",
      { className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 filter" },
      React.createElement(
        "ul",
        { className: this.props.filter.uid },
        React.createElement(
          "li",
          null,
          React.createElement("i", { onClick: this.disableFilter, className: "btn btn-circle-primary btn-xs icon icon-close remove-filter" }),
          React.createElement(
            "label",
            null,
            this.props.filter.label
          )
        ),
        inputs
      )
    );
  }
});

FilterDisplay.Filter.Inputs = React.createClass({
  displayName: "Inputs",

  inputFactory: function inputFactory() {
    var type = this.props.filter.type;
    if (type == "text" || type == "id") {
      return React.createElement(TextInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "date") {
      return React.createElement(DateInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "select") {
      return React.createElement(SelectInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "age_select") {
      return React.createElement(AgeSelectInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else {
      console.error("Not implemented yet!");
    }
  },
  render: function render() {
    var inputs = this.inputFactory();
    return inputs;
  }
});

var AgeSelectInput = React.createClass({
  displayName: "AgeSelectInput",

  getInitialState: function getInitialState() {
    return {
      selected: this.props.filter.value || "0,15"
    };
  },
  componentDidMount: function componentDidMount() {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ selected: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "select",
        {
          className: "form-control",
          selected: this.state.selected,
          onChange: this.onChange
        },
        React.createElement(
          "option",
          { value: "0,15" },
          "15 and under"
        ),
        React.createElement(
          "option",
          { value: "16,24" },
          "16 - 24"
        ),
        React.createElement(
          "option",
          { value: "25,34" },
          "25 - 34"
        ),
        React.createElement(
          "option",
          { value: "35,44" },
          "35 - 44"
        ),
        React.createElement(
          "option",
          { value: "45,54" },
          "45 - 54"
        ),
        React.createElement(
          "option",
          { value: "55,64" },
          "55 - 64"
        ),
        React.createElement(
          "option",
          { value: "65,74" },
          "65 - 74"
        ),
        React.createElement(
          "option",
          { value: "75,100" },
          "75 and over"
        )
      )
    );
  }
});

module.exports = FilterDisplay;

},{"./inputs/dateInput.js.jsx":8,"./inputs/selectInput.js.jsx":9,"./inputs/textInput.js.jsx":10}],7:[function(require,module,exports){
"use strict";

var FilterList = React.createClass({
  displayName: "FilterList",

  render: function render() {
    var filterOptions = this.props.filters.map(function (filter) {
      if (filter.enabled === false) {
        return React.createElement(FilterList.FilterOption, {
          filter: filter,
          onClick: this.props.enableFilter
        });
      }
    }, this);
    return React.createElement(
      "div",
      { className: "btn-group" },
      React.createElement(
        "button",
        { className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", type: "button" },
        React.createElement("i", { className: "icon icon-add" }),
        "Add Filter",
        React.createElement("i", { className: "icon icon-chevron-down" })
      ),
      React.createElement(
        "ul",
        { className: "dropdown-menu", role: "menu" },
        filterOptions
      )
    );
  }
});

FilterList.FilterOption = React.createClass({
  displayName: "FilterOption",

  onClick: function onClick() {
    this.props.onClick(this.props.filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { onClick: this.onClick },
        this.props.filter.label
      )
    );
  } });

module.exports = FilterList;

},{}],8:[function(require,module,exports){
"use strict";

var DateInput = React.createClass({
  displayName: "DateInput",

  getInitialState: function getInitialState() {
    if (this.props.filter.value) {
      return {
        from: this.props.filter.value.from,
        to: this.props.filter.value.to };
    } else {
      return {
        from: "",
        to: "" };
    }
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    var value = filter.value || {};

    var stateObject = this.state;
    var date = event.date.format("DD-MM-YYYY");
    if (event.target.classList.contains("dateRangeFrom")) {
      stateObject.from = date;
      value.from = date;
    } else if (event.target.classList.contains("dateRangeTo")) {
      stateObject.to = date;
      value.to = date;
    }

    filter.value = value;

    this.setState(stateObject);
    this.props.onChange(filter);
  },
  componentDidMount: function componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({ format: "DD-MM-YYYY" });
    datePickerFrom.datetimepicker().on("dp.change", this.onChange);

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({ format: "DD-MM-YYYY" });
    datePickerTo.datetimepicker().on("dp.change", this.onChange);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "div",
        { className: "input-group datepicker dateRangeFrom", ref: "dateRangeFrom" },
        React.createElement("input", {
          className: "form-control",
          type: "text",
          "data-date-format": "DD/MM/YYYY",
          "aria-required": "true",
          placeholder: "from",
          onChange: this.onChange,
          value: this.state.from
        }),
        React.createElement(
          "span",
          { className: "input-group-addon" },
          React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
          React.createElement(
            "span",
            { className: "sr-only icon icon-calendar" },
            "Calendar"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "input-group datepicker dateRangeTo", ref: "dateRangeTo" },
        React.createElement("input", {
          className: "form-control",
          type: "text",
          "data-date-format": "DD/MM/YYYY",
          "aria-required": "true",
          placeholder: "to",
          onChange: this.onChange,
          value: this.state.to
        }),
        React.createElement(
          "span",
          { className: "input-group-addon" },
          React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
          React.createElement(
            "span",
            { className: "sr-only icon icon-calendar" },
            "Calendar"
          )
        )
      )
    );
  }
});

module.exports = DateInput;

},{}],9:[function(require,module,exports){
"use strict";

var SelectInput = React.createClass({
  displayName: "SelectInput",

  getInitialState: function getInitialState() {
    return {
      selected: this.props.filter.value || this.props.filter.selections[0][0]
    };
  },
  componentDidMount: function componentDidMount() {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ selected: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    var options = this.props.filter.selections.map(function (option) {
      return React.createElement(
        "option",
        { value: option[0] },
        option[1]
      );
    });
    return React.createElement(
      "li",
      null,
      React.createElement(
        "select",
        {
          className: "form-control",
          selected: this.state.selected,
          onChange: this.onChange
        },
        options
      )
    );
  }
});

module.exports = SelectInput;

},{}],10:[function(require,module,exports){
"use strict";

var TextInput = React.createClass({
  displayName: "TextInput",

  getInitialState: function getInitialState() {
    return {
      value: this.props.filter.value || ""
    };
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ value: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement("input", {
        className: "form-control",
        type: "text",
        value: this.state.value,
        onChange: this.onChange
      })
    );
  }
});

module.exports = TextInput;

},{}],11:[function(require,module,exports){
"use strict";

var SaveConfigurationButton = React.createClass({
  displayName: "SaveConfigurationButton",

  onClick: function onClick() {
    this.props.onClick(this.state.configurationName);
  },
  onChange: function onChange(event) {
    this.setState({ configurationName: event.target.value });
  },
  getInitialState: function getInitialState() {
    return {
      configurationName: ""
    };
  },
  render: function render() {
    return React.createElement(
      ReactBootstrap.DropdownButton,
      { title: "Save Search", type: "button", bsStyle: "default", className: "btn btn-default margin-bottom-sm" },
      React.createElement(
        ReactBootstrap.MenuItem,
        { eventKey: "1" },
        React.createElement(
          "div",
          { className: "form-group" },
          React.createElement(
            "label",
            null,
            "Search Title"
          ),
          React.createElement("input", { className: "form-control", value: this.state.configurationName, type: "text", onChange: this.onChange })
        ),
        React.createElement(
          "button",
          { className: "btn btn-primary", type: "button", onClick: this.onClick },
          "Save"
        )
      )
    );
  }
});

module.exports = SaveConfigurationButton;

},{}]},{},[1]);
