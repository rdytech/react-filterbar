import {JobsBoardRepeater} from "./JobsBoardRepeater.react";
import {Pagination} from "../Shared/Pagination.react";
import {SortPanel} from "./SortPanel.react";

export class JobsBoard extends React.Component {
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
      header: this.context.tableStore.getHeader(),
      body: this.context.tableStore.getBody(),
      sortableColumns: this.context.tableStore.getSortableColumns(),
      currentPage: this.context.tableStore.getCurrentPage(),
      totalPages: this.context.tableStore.getTotalPages()
    };
  }

  render() {
    return(
      <div>
        <SortPanel cols={this.state.sortableColumns} />
        <JobsBoardRepeater
          rows={this.state.rows}
          cols={this.state.columnHeadings}
          header={this.state.header}
          body={this.state.body}
        />
        <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
      </div>
    );
  }
}

JobsBoard.contextTypes = {
  tableStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};