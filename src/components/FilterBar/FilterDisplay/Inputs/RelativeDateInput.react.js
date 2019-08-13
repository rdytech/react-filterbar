import {DateInput} from "./DateInput.react";

export class RelativeDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
    this.setDisplayDates(this.props.value['value']);
  }

  // If relative option selected, set dates for the datepickers to display
  setDisplayDates(relativeDateSelection) {
    if(relativeDateSelection === undefined || relativeDateSelection == '') {
      return;
    }

    var selected            = this.relativeOptions()[relativeDateSelection];
    this.state.displayFrom  = selected.from.format(this.props.dateFormat);
    this.state.displayTo    = selected.to.format(this.props.dateFormat);
  }

  onRelativeChange(event) {
    var selectedOption = $(event.target.childNodes[event.target.selectedIndex]);
    var newValue = { value: selectedOption.val() };
    this.state = { value: newValue }
    this.updateFilter(newValue);
  }

  onDatePickerChange(event) {
    var newValue = {
      from: this.state.value.from || this.state.displayFrom,
      to: this.state.value.to || this.state.displayTo
    };

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  updateFilter(newValue) {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
  }

  relativeOptions() {
    var lastWeek = moment().subtract(1, 'week');
    const optionsList = {
      'Select Period':  { value: '',  from: null , to: null },
      'Today':          { from: moment() , to: moment() },
      'Last Week':      { from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') },
      'This week':      { from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') },
    }
    return optionsList
  }

  relativeOption(optionKey) {
    var optionItem = this.relativeOptions()[optionKey];
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
          {Object.keys(this.relativeOptions()).map((optionKey) => (
            this.relativeOption(optionKey)
          ))}
        </select>
        <DateInput value={this.state.value} filterUid={this.props.filterUid} displayFrom={this.state.displayFrom} displayTo={this.state.displayTo} onDateChangeCustom={this.onDatePickerChange}/>
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
}
