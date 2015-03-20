var TextInput = require('./inputs/textInput.js.jsx');
var DateInput = require('./inputs/dateInput.js.jsx');
var SelectInput = require('./inputs/selectInput.js.jsx');

var FilterDisplay = React.createClass({
  render: function() {
    var filters = [];
    var filteredArray = this.props.filters.filter(function(filter) {
      return (filter.enabled === true);
    });

    if (filteredArray.length !== 0) {
      filters = filteredArray.map(function(filter) {
        if (filter.enabled === true) {
          return (
            <FilterDisplay.Filter
              filter={filter}
              disableFilter={this.props.disableFilter}
              updateFilter={this.props.updateFilter}
            />
          );
        }
      },this);
    } else {
      filters = (<div>No Filters Enabled</div>);
    }

    return (
      <div className="navbar filterbar">
        <div className="panel panel-default" id="filters">
          {filters}
        </div>
      </div>
    );
  }
});

FilterDisplay.Filter = React.createClass({
  disableFilter: function() {
    this.props.disableFilter(this.props.filter);
  },
  render: function() {
    var inputs = <FilterDisplay.Filter.Inputs
                    filter={this.props.filter}
                    updateFilter={this.props.updateFilter}
                 />;
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 filter">
        <ul className={this.props.filter.uid}>
          <li>
            <i onClick={this.disableFilter} className="btn btn-circle-primary btn-xs icon icon-close remove-filter" />
            <label>
              {this.props.filter.label}
            </label>
          </li>
          {inputs}
        </ul>
      </div>
    );
  }
});

FilterDisplay.Filter.Inputs = React.createClass({
  inputFactory: function() {
    var type = this.props.filter.type;
    if (type == 'text' || type == 'id') {
      return (
        <TextInput
          filter={this.props.filter}
          onChange={this.props.updateFilter}
        />
      );
    } else if (type == 'date') {
      return (
        <DateInput
          filter={this.props.filter}
          onChange={this.props.updateFilter}
        />
      );
    } else if (type == 'select') {
      return (
        <SelectInput
          filter={this.props.filter}
          onChange={this.props.updateFilter}
        />
      );
    } else if (type == 'age_select') {
      return (
        <AgeSelectInput
          filter={this.props.filter}
          onChange={this.props.updateFilter}
        />
      );
    } else {
      console.error("Not implemented yet!");
    }
  },
  render: function() {
    var inputs = this.inputFactory();
    return (
      inputs
    );
  }
});

var AgeSelectInput = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.filter.value || "0,15"
    };
  },
  componentDidMount: function() {
    var filter = $.extend(true,{},this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function(event) {
    var filter = $.extend(true,{},this.props.filter);
    filter.value = event.target.value;

    this.setState({selected: event.target.value});
    this.props.onChange(filter);
  },
  render: function() {
    return (
      <li>
        <select
          className="form-control"
          selected={this.state.selected}
          onChange={this.onChange}
        >
          <option value="0,15">15 and under</option>
          <option value="16,24">16 - 24</option>
          <option value="25,34">25 - 34</option>
          <option value="35,44">35 - 44</option>
          <option value="45,54">45 - 54</option>
          <option value="55,64">55 - 64</option>
          <option value="65,74">65 - 74</option>
          <option value="75,100">75 and over</option>
        </select>
      </li>
    );
  }
});

module.exports = FilterDisplay;
