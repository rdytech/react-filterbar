export class DateInputRelative extends React.Component {
  constructor(props) {
    super(props);
    this.props.dateFormat = 'DD/MM/YYYY'
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
  }

  onDateInputChange(event) {
    var newValue = this.state.value;

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  onRelativeSelectionChange(event) {
    var optionElement = event.target.childNodes[event.target.selectedIndex];
    var from = moment(parseInt(optionElement.getAttribute('data-from')));
    var to = moment(parseInt(optionElement.getAttribute('data-to')));
    var newValue = { value: optionElement.value, from: from.format(this.props.dateFormat), to: to.format(this.props.dateFormat) };

    this.setState({ value: newValue });
    this.updateFilter(newValue);
  }

  onBlur() {
    this.updateFilter(this.state.value);
  }

  updateFilter(newValue) {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
  }

  // TODO: Update relative dates based on relative selection (if in query params) on page load, rather than applying stored dates directly
  componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    if (datePickerFrom.datetimepicker !== undefined) {
      datePickerFrom.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));
    }

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    if (datePickerTo.datetimepicker !== undefined) {
      datePickerTo.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
    }
  }

  displayOptions() {
    var lastWeek = moment().subtract(1, 'week');
    const optionsList = [
      { label: 'Select Time Period' , from: null , to: null },
      { label: 'Today' , from: moment() , to: moment() },
      { label: 'Last week' , from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') },
      { label: 'This week' , from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') },
    ]

    let options = optionsList.map(function(item) {
      return(
        <option
          key={item.label}
          value={item.label}
          data-from={item.from}
          data-to={item.to}
        >
          {item.label}
        </option>
      )
    })

    return(
      {options}
    )
  }

  displayRelativeSelect() {
    return (
      <select
        className="form-control"
        onChange={this.onRelativeSelectionChange.bind(this)}
        defaultValue={this.state.value.value}
      >
        {this.displayOptions()}
      </select>
    )
  }

  render() {
    return (
      <li>
        {this.displayRelativeSelect()}
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            aria-required="true"
            className="form-control"
            data-date-format={this.props.dateFormat}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onDateInputChange.bind(this)}
            placeholder="from"
            type="text"
            value={this.state.value.from}
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
            data-date-format={this.props.dateFormat}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onDateInputChange.bind(this)}
            placeholder="to"
            type="text"
            value={this.state.value.to}
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

DateInputRelative.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

DateInputRelative.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};
