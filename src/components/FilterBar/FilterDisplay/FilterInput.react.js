import {TextInput} from './Inputs/TextInput.react';
import {DateInput} from './Inputs/DateInput.react';
import {SelectInput} from './Inputs/SelectInput.react';

export class FilterInput extends React.Component {
  constructor(props) {
    super(props);

    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _onClick() {
    this.filterBarActor.disableFilter(this.filterUid);
  }

  inputFactory() {
    var type = this.props.filter.type;
    if (type == 'text' || type == 'id') {
      return (
        <TextInput
          filterBarActor={this.filterBarActor}
          filterUid={this.filterUid}
        />
      );
    } else if (type == 'date') {
      return (
        <DateInput
          filterBarActor={this.filterBarActor}
          filterUid={this.props.filterUid}
        />
      );
    } else if (type == 'select') {
      return (
        <SelectInput
          filterBarActor={this.filterBarActor}
          filterUid={this.props.filterUid}
        />
      );
    } else if (type == 'age_select') {
      return (
        <AgeSelectInput
          filterBarActor={this.filterBarActor}
          filterUid={this.props.filterUid}
        />
      );
    } else {
      console.error("Not implemented yet!");
    }
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
