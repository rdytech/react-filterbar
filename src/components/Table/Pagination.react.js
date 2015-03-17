export class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  pages() {
    if (this.props.totalPages > 1) {
      return Array.apply(
        null,
        Array(this.props.totalPages)
      ).map(
        function(_, i) {
          return i + 1;
        }
      );
    } else {
      return [1];
    }
  }

  onClick(event) {
    this.context.tableActor.fetchData(event.target.innerHTML);
  }

  render() {
    var pageLinks = this.pages().map(function(pageNumber) {
      var classes = "";
      if (pageNumber === this.props.currentPage) {
        classes = "active";
      }
      return (
        <li className={classes} key={pageNumber}>
          <a onClick={this.onClick.bind(this)}>{pageNumber}</a>
        </li>
      );
    }, this);

    return (
      <nav>
        <ul className="pagination">
          {pageLinks}
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  currentPage: React.PropTypes.number.isRequired,
  totalPages: React.PropTypes.number.isRequired
};

Pagination.contextTypes = {
  tableActor: React.PropTypes.object.isRequired
};
