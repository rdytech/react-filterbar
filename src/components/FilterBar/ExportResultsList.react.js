import PropTypes from "prop-types";
import t from "../../locales/i18n";

export class ExportResultsList extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick(option) {
    this.context.filterBarActor.exportResults(option);
  }

  render() {
    return (
      <div className="btn-group">
        <button
          aria-expanded="false"
          aria-haspopup="true"
          className="btn btn-default"
          data-toggle="dropdown"
          type="button"
        >
          <i className="icon icon-download" />
          {t('filterbar.buttons.export')}
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          {this.props.exportAllOptions &&
            <li role="presentation">
              <a role="menuitem" onClick={() => this.onClick('current')}>
              {t('filterbar.buttons.export_current_columns')}
              </a>
            </li>
          }
          <li role="presentation">
            <a role="menuitem" onClick={() => this.onClick('all')}>
            {t('filterbar.buttons.export_all_columns')}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

ExportResultsList.contextTypes = {
  filterBarActor: PropTypes.object.isRequired
};

ExportResultsList.propTypes = {
  exportAllOptions: PropTypes.bool.isRequired,
  filterBarActor: PropTypes.object.isRequired
};
