export class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value };
  }

  ComponentWillMount() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      value: this.context.filterBarStore.getFilter(this.props.filterUid).value
    };
  }

  onChange(event) {
    this.setState({value: event.target.value});
  }

  // Catch input losing focus rather than on changing, so that we don't trigger
  // a DOM reload until the component has finished being edited. This ties in
  // to the fact that they unique key is the timestamp, so we would otherwise
  // lose focus on every keystroke.
  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  render() {
    return (
      <li>
        <input
          className="form-control"
          onBlur={this.onBlur.bind(this)}
          onChange={this.onChange.bind(this)}
          type="text"
          value={this.state.value}
        />
      </li>
    );
  }
}

TextInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

TextInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};
