export class ExportResultsButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.exportResults();
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.onClick.bind(this)}>
        <i className="icon icon-download" />
        Export CSV
      </button>
    );
  }
}

ExportResultsButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};
