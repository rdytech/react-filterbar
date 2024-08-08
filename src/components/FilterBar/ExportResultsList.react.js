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
    const { actions } = this.props.exportActionsConfiguration; // Use the prop

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
          {actions.map((action, index) => (
            <li role="presentation" key={index}>
              <a role="menuitem" onClick={() => this.onClick(action.type)}>
                {t(`filterbar.buttons.${action.label}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ExportResultsList.contextTypes = {
  filterBarActor: PropTypes.object.isRequired
};

ExportResultsList.propTypes = {
  exportActionsConfiguration: PropTypes.object.isRequired // Define prop type
};
