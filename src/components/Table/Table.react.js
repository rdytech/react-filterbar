import {Body} from "./Body.react";
import {TableCaption} from "./TableCaption.react";
import {HeadingRow} from "./HeadingRow.react";
import {Pagination} from "./Pagination.react";

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: 1
    };
  }

  componentWillMount() {
    this.context.tableActor.fetchData();
    this.setState(this.getStateFromStores());
    this.context.tableStore.addChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      columnHeadings: this.context.tableStore.getColumns(),
      rows: this.context.tableStore.getRows(),
      currentPage: this.context.tableStore.getCurrentPage(),
      totalPages: this.context.tableStore.getTotalPages(),
      tableCaption: this.context.tableStore.getTableCaption()
    };
  }

  render() {
    var headings = this.state.columnHeadings;
    var tableCaption = this.state.tableCaption;

    return (
      <div className="panel panel-responsive">
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <TableCaption value={tableCaption} />
            <HeadingRow cells={headings} />
            <Body rows={this.state.rows} />
          </table>
          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
        </div>
      </div>
    );
  }
}

Table.contextTypes = {
  tableActor: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired
};

