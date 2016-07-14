export class BatchActionsListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <li>
        <a
          className="dynamic-text-filter"
          href={this.props.url}
          onClick={this.props.onClickAction}
        >
          {this.props.label}
        </a>
      </li>
    );
  }
}

BatchActionsListItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
};
