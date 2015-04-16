export class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;

    this.state = {value: this.filterBarActor.getFilter(this.filterUid).value};
  }

  _onChange(event) {
    this.setState({value: event.target.value});
    this.filterBarActor.updateFilter(this.filterUid, event.target.value);
  }

  render() {
    return (
      <li>
        <input
          className="form-control"
          type="text"
          value={this.state.value}
          onChange={this._onChange.bind(this)}
        />
      </li>
    );
  }
}
