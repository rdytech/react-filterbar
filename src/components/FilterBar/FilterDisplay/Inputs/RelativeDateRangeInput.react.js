import { DateInput } from "./DateInput.react";
export class RelativeDateRangeInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value || { from: null, to: null },
      operator: this.props.value.operator || "absolute"
    }
  }

  isAbsolute() {
    return this.state.operator == "absolute"
  }

  intToMoment(value) {
    if (Number.isNaN(value) || value == null) {
      return null
    }

    if (value < 0) {
      return moment().subtract(Math.abs(value), 'day')
    } else {
      return moment().add(value, 'day')
    }
  }

  momentFormatted(value) {
    var momentValue = this.intToMoment(parseInt(value))

    if (momentValue) {
      return momentValue.format(this.props.dateFormat)
    } else {
      return moment().format(this.props.dateFormat)
    }
  }

  handleInputChange(event, input) {
    var newValue = this.state.value
    newValue[input] = event.target.value
    newValue['value'] = "Custom" // Reset preset selection
    this.setState({ value: newValue })
  }

  handleDatePickerChange(event) {
    var newValue = this.state.value
    newValue['value'] = "Custom" // Reset preset selection

    if (event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({ value: newValue });
  }

  onPresetChange(event) {
    var selectedOption = $(event.target.childNodes[event.target.selectedIndex]);
    var fromValue = selectedOption.context.dataset.from
    var toValue = selectedOption.context.dataset.to

    if (this.isAbsolute()) {
      var momentFrom = this.intToMoment(parseInt(fromValue))
      var momentTo = this.intToMoment(parseInt(toValue))
      fromValue = momentFrom && momentFrom.format(this.props.dateFormat)
      toValue = momentTo && momentTo.format(this.props.dateFormat)
    }

    var newValue = {
      from: fromValue,
      to: toValue,
      value: selectedOption.val(),
      operator: this.state.operator,
    }

    this.setState({
      value: newValue,
      displayFrom: fromValue,
      displayTo: toValue,
      operator: this.state.operator
    })
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue)
  }

  relativeOption(optionKey) {
    var optionItem = this.props.relativeOptions[optionKey];
    return <option
      key={optionKey}
      value={optionItem.value !== undefined ? optionItem.value : optionKey}
      data-from={optionItem.from} data-to={optionItem.to}>
      {optionKey}
    </option>
  }

  showDateInputs() {
    return (
      <div>
        <DateInput value={this.state.value} filterUid={this.props.filterUid} displayFrom={this.state.displayFrom} displayTo={this.state.displayTo} onDateChangeCustom={this.handleDatePickerChange} />
      </div>
    )
  }

  showRelativeRangeInputs() {
    return (
      <div>
        <div className="input-group">
          <span className="input-group-addon">
            Today
          </span>
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.handleInputChange(e, 'from')}
            placeholder="+/- days"
            value={this.state.value.from}
          />
          <span className="input-group-addon">
            day(s)
          </span>
          <span className="input-group-addon">
            {this.momentFormatted(this.state.value.from)}
          </span>
        </div>
        <div className="input-group">
          <span className="input-group-addon">
            Today
          </span>
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.handleInputChange(e, 'to')}
            placeholder="+/- days"
            value={this.state.value.to}
          />
          <span className="input-group-addon">
            day(s)
          </span>
          <span className="input-group-addon">
            {this.momentFormatted(this.state.value.to)}
          </span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col-xl-10">
        <select className="form-control" onChange={this.onPresetChange.bind(this)} value={this.state.value.value}>
          {Object.keys(this.props.relativeOptions).map((optionKey) => (
            this.relativeOption(optionKey)
          ))}
        </select>

        {
          this.state.operator == "absolute" ? this.showDateInputs() : this.showRelativeRangeInputs()
        }

        <div className="input-group">
          <label className="radio-inline">
            <input
              type="radio"
              name="operator"
              value="absolute"
              checked={this.isAbsolute()}
              onChange={(e) => this.setState({ operator: e.target.value })}
            />
            Absolute
          </label>

          <label className="radio-inline">
            <input
              type="radio"
              name="operator"
              value="relative"
              checked={!this.isAbsolute()}
              onChange={(e) => this.setState({ operator: e.target.value })}
            />
            Relative
          </label>
        </div>
      </div>
    );
  }
}

RelativeDateRangeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

RelativeDateRangeInput.defaultProps = {
  dateFormat: 'DD/MM/YYYY',
  relativeOptions: relativeOptions()
}

function relativeOptions() {
  var lastWeek = moment().subtract(1, 'week');

  return {
    'Custom': { value: '', from: null, to: null },
    'Today': { from: 0, to: 0 },
    'Last Week': {
      from: lastWeek.clone().startOf('isoWeek').diff(moment(), 'days'),
      to: lastWeek.clone().endOf('isoWeek').diff(moment(), 'days')
    },
    'This Week': {
      from: moment().startOf('isoWeek').diff(moment(), 'days'),
      to: moment().endOf('isoWeek').diff(moment(), 'days')
    },
    'Older than 7 days': { from: null, to: -8 },
    'Older than 14 days': { from: null, to: -15 },
    'Older than 20 days': { from: null, to: -21 },
  }
}
