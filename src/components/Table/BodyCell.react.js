export class BodyCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;

    return (
      <td style={this.props.style} dangerouslySetInnerHTML={{__html: content}} />
    );
  }
}

BodyCell.propTypes = {
  value: React.PropTypes.string.isRequired
};
