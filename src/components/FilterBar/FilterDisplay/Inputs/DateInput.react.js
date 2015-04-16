var FilterBarStore = require('../../stores/FilterBarStore');
var FilterBarActionCreators = require('../../actions/FilterBarActionCreators');

function getStateFromStores(filterBarId, filterUid) {
  return {
    value: FilterBarStore.get(filterBarId, filterUid).value
  };
}

var DateInput = React.createClass({
  getInitialState: function() {
    return {
      value: {
        from: null,
        to: null
      }
    };
  },
  _onChange: function(event) {
    var newValue = this.state.value;

    if(event.type === 'dp') {
      newValue[event.target.querySelector('input').getAttribute('placeholder')] = event.target.querySelector('input').value;
    } else if (event.type === 'input') {
      newValue[event.target.getAttribute('placeholder')] = event.target.value;
    }

    this.setState({value: newValue});
    FilterBarActionCreators.updateFilter(this.props.filterBarId, this.props.filterUid, newValue);
  },
  componentDidMount: function() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerFrom.datetimepicker().on('dp.change',this._onChange);

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerTo.datetimepicker().on('dp.change',this._onChange);
  },
  render: function() {
    return (
      <li>
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            className="form-control"
            type="text"
            data-date-format="DD/MM/YYYY"
            aria-required="true"
            placeholder="from"
            onChange={this._onChange}
            value={this.state.from}
          />
          <span className="input-group-addon">
            <span className="icon-calendar icon" aria-hidden="true">
            </span>
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
        <div className="input-group datepicker dateRangeTo" ref="dateRangeTo">
          <input
            className="form-control"
            type="text"
            data-date-format="DD/MM/YYYY"
            aria-required="true"
            placeholder="to"
            onChange={this._onChange}
            value={this.state.to}
          />
          <span className="input-group-addon">
            <span className="icon-calendar icon" aria-hidden="true">
            </span>
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
      </li>
    );
  }
});

module.exports = DateInput;
