import {FilterInputFactory} from "./FilterInputFactory.react";

export class FilterInput extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.disableFilter(this.props.filterUid);
  }

  render() {
    var inputs = new FilterInputFactory(this.props.type, this.props.value, this.props.filterUid);
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
