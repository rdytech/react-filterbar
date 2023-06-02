import t from "../../locales/i18n";

export class ApplyFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.applyFilters();
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.onClick.bind(this)}>
        <i className="icon icon-tick" />
        { t('filterbar.buttons.apply') }
      </button>
    );
  }
}

ApplyFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};
