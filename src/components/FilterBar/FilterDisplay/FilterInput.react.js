import {FilterInputFactory} from "./FilterInputFactory.react";

export class FilterInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    const { groupKey, inputKey } = this.props;
    this.props.onFilterRemove(groupKey, inputKey);
  }

  objectProperties() {
    return (
      {
        filterUid: this.props.filterUid,
        groupKey: this.props.groupKey,
        inputKey: this.props.inputKey,
        key: Math.random(),
        value: this.props.value || "",
        type: this.props.type,
        operator: this.props.operator
      }
    );
  }

  render() {
    var propObject = this.objectProperties();
    var inputs = new FilterInputFactory(propObject);
    return (
      <div className="filter">
        <ul className={ this.filterKey }>
          <li>
            <i
              className="btn btn-circle-primary btn-xs icon icon-close remove-filter" style={ { lineHeight: '16px' } }
              onClick={ this.onClick.bind(this) }
            />
            <label>
              { this.props.label }
            </label>
          </li>
          {inputs}
        </ul>
      </div>
    );
  }
}

FilterInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired,
  groupKey: React.PropTypes.number.isRequired,
  inputKey: React.PropTypes.number.isRequired,
  onFilterRemove: React.PropTypes.func.isRequired
};

FilterInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};
