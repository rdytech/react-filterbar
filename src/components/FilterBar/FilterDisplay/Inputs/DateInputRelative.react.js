import {DateInput} from "./DateInput.react";

export class RelativeDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.props.dateFormat = 'DD/MM/YYYY'
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
  }

  onRelativeChange(event) {
    var optionElement = event.target.childNodes[event.target.selectedIndex];
    var from = moment(parseInt(optionElement.getAttribute('data-from')));
    var to = moment(parseInt(optionElement.getAttribute('data-to')));
    var newValue = { value: optionElement.value, from: from.format(this.props.dateFormat), to: to.format(this.props.dateFormat) };

    this.setState({ value: newValue });
    this.updateFilter(newValue);
  }

  updateFilter(newValue) {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
  }

  // TODO: Update relative dates based on relative selection (if in query params) on page load, rather than applying stored dates directly

  relativeOptions() {
    var lastWeek = moment().subtract(1, 'week');
    const optionsList = [
      { label: 'Select Period' , from: null , to: null },
      { label: 'Today' , from: moment() , to: moment() },
      { label: 'Last week' , from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') },
      { label: 'This week' , from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') },
    ]
    return optionsList
  }

  render() {
    return (
      <DateInput value={this.state.value}>
        <select
          className="form-control"
          onChange={this.onRelativeChange.bind(this)}
          value={this.state.value.value}
        >
          {this.relativeOptions().map(({ label, from, to }) => (
            <option key={label} value={label} data-from={from} data-to={to}>
              {label}
            </option>
          ))}
        </select>
      </DateInput>
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
