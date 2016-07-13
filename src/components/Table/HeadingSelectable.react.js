export class HeadingSelectable extends React.Component {
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

  addRemoveAllFromSelection(event) {
    if (event.target.checked) {
      this.context.tableStore.pushAllValuesToSelectedRows();
    }
    else {
      this.context.tableStore.removeAllValuesFromSelectedRows();
    }
    this.setState(this.getCheckedState());
    this.context.tableStore.emitChange();
  }

  getCheckedState() {
    return(
      {
        isChecked: this.context.tableStore.allSelectableValuesInSelectedRows()
      }
    );
  }

  render() {
    return (
      <th>
        <input
          type='checkbox'
          onChange={this.addRemoveAllFromSelection.bind(this)}
          checked={this.state.isChecked}
        />
      </th>
    );
  }
}

HeadingSelectable.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};
