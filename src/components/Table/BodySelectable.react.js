export class BodySelectable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    }
  }

  componentWillMount() {
    this.setState(this.getCheckedState());
  }

  componentWillReceiveProps() {
    this.setState(this.getCheckedState());
  }

  addToOrRemoveFromSelection(event) {
    if (event.target.checked) {
      this.context.tableStore.pushValueToSelectedRows(event.target.value);
    }
    else {
      this.context.tableStore.removeFromSelectedRows(event.target.value);
    }
    this.setState(this.getCheckedState());
    this.context.tableStore.emitChange();
  }

  getCheckedState() {
    return(
      {
        isChecked: this.context.tableStore.valueInSelectedRows(this.props.value)
      }
    );
  }

  render() {
    return (
      <td style={this.props.style}>
        <input
          type='checkbox'
          value={this.props.value}
          onChange={this.addToOrRemoveFromSelection.bind(this)}
          checked={this.state.isChecked}
        />
      </td>
    );
  }
}

BodySelectable.propTypes = {
  value: React.PropTypes.string.isRequired
};

BodySelectable.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};
