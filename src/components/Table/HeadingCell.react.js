export class HeadingCell extends React.Component {
  constructor(props) {
    super(props);
  }

  queryName() {
    return "order[" + this.props.sortable + "]";
  }

  currentSortOrder() {
    return this.context.tableStore.getUrl().query(true)[this.queryName()];
  }

  nextSortOrder() {
    return this.currentSortOrder() === "asc" ? "desc" : "asc";
  }

  sortTable() {
    if (this.props.sortable !== undefined) {
      this.context.tableStore.setUrl(
        this.context.tableStore.getUrl().removeQuery(
          /^order\[.*\]/
        ).setQuery(
          this.queryName(),
          this.nextSortOrder()
        )
      );

      this.context.tableActor.fetchData(1);
    }
  }

  tooltip() {
    return (
      <ReactBootstrap.Tooltip id="header-tooltip">
        {this.props.tooltipContentType === 'html' ?
          <div className="header-tooltip-container" dangerouslySetInnerHTML={{ __html: this.props.tooltipContent }} /> :
          <div className="header-tooltip-container">{this.props.tooltipContent}</div>
        }
      </ReactBootstrap.Tooltip>
    );
  }

  headerContent() {
    var content = this.props.value;
    if (this.props.sortable !== undefined) {
      var style = {cursor: "pointer"}
      return (
        <th 
          className={["sortable", this.currentSortOrder()].join(" ")}
          onClick={this.sortTable.bind(this)}
          style={Object.assign(style, this.props.style)}
        >
          {content}
        </th>
      );
    }
    else {
      return (
        <th
          style={this.props.style}
        >
          {content}
        </th>
      );
    }
  }

  render() {
    if (this.props.tooltipContent !== undefined) {
      return (
        <ReactBootstrap.OverlayTrigger placement="top" overlay={this.tooltip()}>
          {this.headerContent()}
        </ReactBootstrap.OverlayTrigger>
      );
    }
    else {
      return this.headerContent();
    }
  }
}

HeadingCell.propTypes = {
  value: React.PropTypes.string.isRequired
};

HeadingCell.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}
