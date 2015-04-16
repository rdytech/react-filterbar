import {TextInput} from './Inputs/TextInput.react';

export class FilterInput extends React.Component {
  constructor(props) {
    super(props);

    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
    this.filterKey = props.filterKey;
  }

  _onClick() {
    this.filterBarActor.disableFilter(this.filterUid);
  }

  inputFactory() {
    /*
      inputFactory: function() {
        var type = this.props.filter.type;
        if (type == 'text' || type == 'id') {
          return (
            <TextInput
              filterBarId={this.props.filterBarId}
              filterUid={this.props.filterUid}
            />
          );
        } else if (type == 'date') {
          return (
            <DateInput
              filterBarId={this.props.filterBarId}
              filterUid={this.props.filterUid}
            />
          );
        } else if (type == 'select') {
          return (
            <SelectInput
              filterBarId={this.props.filterBarId}
              filterUid={this.props.filterUid}
            />
          );
        } else if (type == 'age_select') {
          return (
            <AgeSelectInput
              filterBarId={this.props.filterBarId}
              filterUid={this.props.filterUid}
            />
          );
        } else {
          console.error("Not implemented yet!");
        }
    */
    return (
      <TextInput
        filterBarActor={this.filterBarActor}
        filterUid={this.filterUid}
      />
    );
  }

  render() {
    var inputs = this.inputFactory();
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 filter">
        <ul className={this.filterKey}>
          <li>
            <i onClick={this._onClick.bind(this)} className="btn btn-circle-primary btn-xs icon icon-close remove-filter" />
            <label>
              {this.props.filter.label}
            </label>
          </li>
          {inputs}
        </ul>
      </div>
    );
  }
}
