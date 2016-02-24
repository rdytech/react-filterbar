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

  render() {
    var content = this.props.value;

    if (this.props.sortable !== undefined) {
      return (
        <th className={["sortable", this.currentSortOrder()].join(" ")} onClick={this.sortTable.bind(this)} style={{cursor: "pointer"}}>
          {content}
        </th>
      );
    } else {
      return (
        <th>
          {content}
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
