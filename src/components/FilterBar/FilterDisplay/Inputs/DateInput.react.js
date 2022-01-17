export class DateInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value || { from: null, to: null },
      displayFrom: this.props.displayFrom,
      displayTo: this.props.displayTo
    };

    this.handleDateChange = this.props.onDateChangeCustom ? this.props.onDateChangeCustom.bind(this) : this.onDateChange.bind(this)
  }

  onDateChange(event) {
    var newValue = this.state.value;

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.groupKey, this.props.inputKey, this.state.value);
  }

  componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    if (datePickerFrom.datetimepicker !== undefined) {
      datePickerFrom.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerFrom.datetimepicker().on("dp.change", this.handleDateChange);
    }

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    if (datePickerTo.datetimepicker !== undefined) {
      datePickerTo.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerTo.datetimepicker().on("dp.change", this.handleDateChange);
    }
  }

  render() {
    return (
      <li>
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY"
            onBlur={this.onBlur.bind(this)}
            onChange={this.handleDateChange}
            placeholder="from"
            type="text"
            disabled={this.props.disabled}
            value={this.state.displayFrom || this.state.value.from}
          />
          <span className="input-group-addon">
            <span aria-hidden="true" className="icon-calendar icon" />
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
        <div className="input-group datepicker dateRangeTo" ref="dateRangeTo">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY"
            onBlur={this.onBlur.bind(this)}
            onChange={this.handleDateChange}
            placeholder="to"
            type="text"
            disabled={this.props.disabled}
            value={this.state.displayTo || this.state.value.to}
          />
          <span className="input-group-addon">
            <span aria-hidden="true" className="icon-calendar icon" />
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
      </li>
    );
  }
}

DateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

DateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

DateInput.defaultProps = {
  disabled: false,
}
