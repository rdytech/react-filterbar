import PropTypes from "prop-types";
import t from "../../locales/i18n";

export class ExportResultsList extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick(option) {
    if (option === 'current') {
      this.context.filterBarActor.exportCurrentColumns();
    } else if (option === 'all') {
      this.context.filterBarActor.exportAllColumns();
    }
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
          <li role="presentation">
            <a role="menuitem" onClick={() => this.onClick('current')}>
            {t('filterbar.buttons.export_current_columns')}
            </a>
          </li>
          <li role="presentation">
            <a role="menuitem" onClick={() => this.onClick('all')}>
            {t('filterbar.buttons.export_current_columns')}
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
