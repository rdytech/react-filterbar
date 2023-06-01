import t from "../../locales/i18n";

export class ClearFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.disableAllFiltersAndApply();
  }

  render() {
    return (
      <button className="btn btn-warning" onClick={this.onClick.bind(this)}>
        <i className="icon icon-delete" />
        {t('buttons.clear')}
      </button>
    );
  }
}

ClearFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};
