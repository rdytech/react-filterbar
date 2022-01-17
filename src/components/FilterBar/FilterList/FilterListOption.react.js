export class FilterListOption extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onClick(this.props.filterUid);
  }

  render() {
    return (
      <li>
        <a onClick={this.onClick.bind(this)} style={ {cursor: "pointer"} }>
          {this.props.label}
        </a>
      </li>
    );
  }
}

FilterListOption.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired
};

FilterListOption.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};
