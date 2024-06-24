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

  headerContent() {
    var content = this.props.value;
    if (this.props.headingType === 'html') {
      return(
        <div dangerouslySetInnerHTML={{ __html: content }} />
      );
    }
    else {
      return content;
    }
  }

  render() {
    if (this.props.sortable !== undefined) {
      var style = {cursor: "pointer"}
      return (
        <th 
          className={["sortable", this.currentSortOrder()].join(" ")}
          onClick={this.sortTable.bind(this)}
          style={Object.assign(style, this.props.style)}
        >
          {this.headerContent()}
        </th>
      );
    }
    else {
      return (
        <th
          style={this.props.style}
        >
          {this.headerContent()}
        </th>
      );
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
