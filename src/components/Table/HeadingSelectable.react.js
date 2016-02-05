export class HeadingSelectable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <th>&nbsp;</th>
    );
  }
}

HeadingSelectable.propTypes = {
  value: React.PropTypes.string.isRequired
};

HeadingSelectable.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}