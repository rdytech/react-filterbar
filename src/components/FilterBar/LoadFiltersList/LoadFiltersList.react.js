export class LoadFiltersList extends React.Component {
  constructor(props) {
    super(props);
  }

  getStateFromStores() {
    return {
    };
  }

  render() {
    var loadFiltersListItems = [];
    var buttonClass = 'btn btn-default dropdown-toggle';
    if (loadFiltersListItems.length === 0) {
      buttonClass += ' disabled'
    }
    return (
      <div className="btn-group margin-bottom-sm">
        <div className="btn-group">
          <button className={buttonClass} data-toggle="dropdown" type="button" aria-expanded="false">
            <i className="icon icon-save" />
            Saved Searches
            <i className="icon icon-chevron-down" />
          </button>
          <ul className="dropdown-menu" role="menu">
            {loadFiltersListItems}
          </ul>
        </div>
        <button type="button" className="btn btn-danger">
          <i className="icon icon-delete" />
        </button>
      </div>
    );
  }
}