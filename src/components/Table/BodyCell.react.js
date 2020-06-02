export class BodyCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;

    if (this.props.type === 'html') {
      return (
        <td style={this.props.style} dangerouslySetInnerHTML={{__html: content}} />
      );
    }
    else {
      return (
        <td style={this.props.style}>
          {content}
        </td>
      );
    }
  }
}

BodyCell.propTypes = {
  value: React.PropTypes.string.isRequired
};
