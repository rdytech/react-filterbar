import {FilterInputFactory} from "./FilterInputFactory.react";

export class FilterInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.disableFilter(this.props.filterUid);
  }

  objectProperties() {
    var key = Date.now();
    return(
      {
        filterUid: this.props.filterUid,
        key: key,
        value: this.props.value,
        type: this.props.type,
        operator: this.props.operator || 'gte'
      }
    );
  }

  render() {
    var propObject = this.objectProperties();
    var inputs = new FilterInputFactory(propObject);
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 filter">
        <ul className={this.filterKey}>
          <li>
            <i
              className="btn btn-circle-primary btn-xs icon icon-close remove-filter"
              onClick={this.onClick.bind(this)}
            />
            <label>
              {this.props.label}
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
  value: React.PropTypes.string.isRequired
};

FilterInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};
