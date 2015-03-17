export class HeadingCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;

    return (
      <th>
        {content}
      </th>
    );
  }
}

HeadingCell.propTypes = {
  value: React.PropTypes.string.isRequired
};
