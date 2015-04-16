import {TableHeadingCell} from './TableHeadingCell.react';

export class Table extends React.Component {
  constructor(props) {
    super(props);

    this.tableActor = props.tableActor;
    this.tableStore = props.tableStore;

    this.state = this.getStateFromStores();
    this.tableStore.addChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  _onClick(event) {
    this.tableActor.fetchPagedData(event.target.innerHTML);
  }

  getStateFromStores() {
    return {
      columnHeadings: this.tableActor.getColumnHeadings(),
      rows: this.tableActor.getRows(),
      currentPage: this.tableActor.getCurrentPage(),
      totalPages: this.tableActor.getTotalPages()
    }
  }

  render() {
    var columns = Object.keys(this.state.columnHeadings).map(function(columnId) {
      return (
        <TableHeadingCell key={columnId} heading={this.state.columnHeadings[columnId].heading} />
      );
    },this);

    if (this.state.totalPages > 1) {
      var pages = Array.apply(null, Array(this.state.totalPages)).map(function(_,i) {return i + 1});
      var pagination = pages.map(function(pageNumber) {
        var classes = '';
        if (pageNumber === this.state.currentPage) {
          classes = 'active';
        }
        return (
          <li className={classes}>
            <a onClick={this._onClick.bind(this)}>{pageNumber}</a>
          </li>
        )
      },this);
    }

    var rows = this.state.rows.map(function(row) {
      var columns = Object.keys(row).map(function(columnId) {
        return (
          <td>
            {row[columnId]}
          </td>
        );
      },this);

      return (
        <tr>
          {columns}
        </tr>
      );
    },this);

    return (
      <div className='panel panel-responsive'>
        <div className='table-responsive'>
          <table className='table table-hover table-striped'>
            <thead>
              <tr>
                {columns}
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
          <nav>
            <ul className='pagination'>
              {pagination}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
