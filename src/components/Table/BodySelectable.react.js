export class BodySelectable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <th><input type='checkbox' name='select_all' value={this.props.value} onChange={this.addRemoveSelectedValue} /></th>
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