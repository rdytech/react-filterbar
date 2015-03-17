export class SelectInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: props.value};
  }

  onSelect(event) {
    this.setState({value: event.target.value});
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
  }

  render() {
    var options = this.context.filterBarStore.getFilter(this.props.filterUid).options || [];

    options = options.map(function(option) {
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    }, this);

    return (
      <li>
        <select
          className="form-control"
          onChange={this.onSelect.bind(this)}
          selected={this.state.value}
          value={this.state.value}
        >
          {options}
        </select>
      </li>
    );
  }
}

SelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

SelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};
