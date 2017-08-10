import {Body} from "./Body.react";
import {TableCaption} from "./TableCaption.react";
import {HeadingRow} from "./HeadingRow.react";
import {Pagination} from "./Pagination.react";
import * as TableEvent from "../../events/TableEvent";

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

  componentDidUpdate() {
    TableEvent.tableUpdated();
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
      tableCaption: this.context.tableStore.getTableCaption(),
      fixRightColumn: this.context.tableStore.getFixRightColumn()
    };
  }

  render() {
    var headings = this.state.columnHeadings;
    var tableCaption = this.state.tableCaption;

    if (this.state.fixRightColumn === 'true') {
      return (
        <div className="panel panel-responsive">
          <TableCaption value={tableCaption} outputDiv={true} />
          <div className="table-responsive" style={{position: `relative`}}>
            <div style={{position: `absolute`, right: 0, minWidth: `100%`}}>
              <table className="table table-hover table-striped">
                <HeadingRow cells={headings} displayTable={'fix'} />
                <Body rows={this.state.rows} displayTable={'fix'} />
              </table>
            </div>
            <div style={{overflowX: `auto`}}>
              <table className="table table-hover table-striped">
                <HeadingRow cells={headings} displayTable={'scroll'} />
                <Body rows={this.state.rows} displayTable={'scroll'} />
              </table>
            </div>
          </div>
          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
        </div>
      );
    }
    else {
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
}

Table.contextTypes = {
  tableActor: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired
};

