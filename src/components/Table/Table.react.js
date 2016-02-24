import {Body} from "./Body.react";
import {HeadingRow} from "./HeadingRow.react";
import {Pagination} from "../Shared/Pagination.react";

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
      totalPages: this.context.tableStore.getTotalPages()
    };
  }

  render() {
    var headings = this.state.columnHeadings;

    return (
      <div className="panel panel-responsive">
        <div className="table-responsive">
          <table className="table table-hover table-striped">
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

