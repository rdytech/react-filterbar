import {DateInput} from "./DateInput.react";
import t from "../../../../locales/i18n";

export class RelativeDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
    this.props.relativeOptions = relativeOptions();
    this.setDisplayDates(this.props.value['value']);
  }

  // If relative option selected, set dates for the datepickers to display
  setDisplayDates(relativeDateSelection) {
    if(!this.relativeValueSelected(relativeDateSelection) || relativeDateSelection == t('filterbar.periods.none')) {
      return;
    }

    var selected            = this.props.relativeOptions[relativeDateSelection];

    if(selected){
      this.state.displayFrom  = selected.from && selected.from.format(this.props.dateFormat);
      this.state.displayTo    = selected.to   && selected.to.format(this.props.dateFormat);
    }
  }

  onRelativeChange(event) {
    var selectedOption = $(event.target.childNodes[event.target.selectedIndex]);
    var newValue = { value: selectedOption.val(), from: null, to: null };
    this.setState(
      (prevState) => ({
        value: { ...prevState.value, ...newValue },
      }),
      () => {
        this.updateFilter();
      },
    );
  }

  onDatePickerChange(event) {
    var newValue = {
      value: null,
      from: this.state.value.from || this.state.displayFrom,
      to: this.state.value.to || this.state.displayTo
    };

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("data-attr")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("data-attr")] = event.target.value;
    }

    this.setState((prevState) => ({
      value: { ...prevState.value, ...newValue },
    }));
  }

  relativeValueSelected(selection) {
    if(selection === undefined) {
      selection = this.state.value.value;
    }

    return selection !== undefined && selection !== null && selection != '';
  }

  updateFilter() {
    this.context.filterBarActor.updateFilter(
      this.props.filterUid,
      "value",
      this.state.value,
    );
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
    var newValue = this.state.value;
    newValue[input] = event.target.value;
    this.setState({ value: newValue });
  }

  showRelativeRangeInputs() {
    return (
      <div>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.handleInputChange(e, 'from')}
            placeholder={ t('filterbar.placeholders.plus_minus_days') }
            value={this.state.value.from}
          />
          <span className="input-group-addon">
            {this.momentFormatted(this.state.value.from)}
          </span>
        </div>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            onChange={(e) => this.handleInputChange(e, 'to')}
            placeholder={ t('filterbar.placeholders.plus_minus_days') }
            value={this.state.value.to}
          />
          <span className="input-group-addon">
            {this.momentFormatted(this.state.value.to)}
          </span>
        </div>
      </div>
    );
  }

  showDateInputs() {
    return (
      <div>
        <DateInput value={this.state.value} filterUid={this.props.filterUid} displayFrom={this.state.displayFrom} displayTo={this.state.displayTo} onDateChangeCustom={this.onDatePickerChange} disabled={this.relativeValueSelected()} />
      </div>
    )
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

  render() {
    return (
      <div>
        <select
          className="form-control"
          onChange={this.onRelativeChange.bind(this)}
          value={this.state.value.value}
          ref="relativeSelect"
        >
          {Object.keys(this.props.relativeOptions).map((optionKey) => (
            this.relativeOption(optionKey)
          ))}
        </select>
        {
          this.state.value.value == t('filterbar.periods.relative_from_today') ? this.showRelativeRangeInputs() : this.showDateInputs()
        }
      </div>
    )
  }
}

RelativeDateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

RelativeDateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

RelativeDateInput.defaultProps = {
  dateFormat: 'DD/MM/YYYY',
  relativeOptions: relativeOptions()
}

function relativeOptions() {
  var lastWeek = moment().subtract(1, 'week');
  var lastMonth = moment().subtract(1, 'month');
  var options = {};
    options[t('filterbar.periods.custom_period')] =       { value: '', from: null, to: null };
    options[t('filterbar.periods.none')] =                {};
    options[t('filterbar.periods.today')] =               { from: moment(), to: moment() };
    options[t('filterbar.periods.last_week')] =           { from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') };
    options[t('filterbar.periods.this_week')] =           { from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') };
    options[t('filterbar.periods.last_month')] =          { from: lastMonth.clone().startOf('month'), to: lastMonth.clone().endOf('month') };
    options[t('filterbar.periods.this_month')] =          { from: moment().startOf('month'), to: moment().endOf('month') };
    options[t('filterbar.periods.older_than_7_days')] =   { from: null, to: moment().subtract(8, 'day') };
    options[t('filterbar.periods.older_than_14_days')] =  { from: null, to: moment().subtract(15, 'day') };
    options[t('filterbar.periods.older_than_20_days')] =  { from: null, to: moment().subtract(21, 'day') };
    options[t('filterbar.periods.older_than_30_days')] =  { from: null, to: moment().subtract(31, 'day') };
    options[t('filterbar.periods.older_than_42_days')] =  { from: null, to: moment().subtract(43, 'day') };
    options[t('filterbar.periods.relative_from_today')] = { from: null, to: null };

  return options;
}
