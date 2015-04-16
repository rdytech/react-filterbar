export class SelectInput extends React.Component {
  constructor(props) {
    super(props)
    var filter = props.filterBarActor.getFilter(props.filterUid);

    this.state = { value: (filter.value || filter.options[0].value) };
    this.props.filterBarActor.updateFilter(this.props.filterUid, 'value', this.state.value);
  }

  _onChange(event) {
    this.setState({value: event.target.value});
    this.props.filterBarActor.updateFilter(this.props.filterUid, 'value', event.target.value);
  }

  render() {
    var options = this.props.filterBarActor.getFilter(this.props.filterUid).options || [];

    options = options.map(function(option) {
      return (
        <option value={option.value}>{option.label}</option>
      );
    }, this);

    return (
      <li>
        <select
          className='form-control'
          selected={this.state.value}
          onChange={this._onChange.bind(this)}
        >
          {options}
        </select>
      </li>
    );
  }
}
