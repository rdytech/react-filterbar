import {FilterList} from './FilterList/FilterList.react';
import {FilterDisplay} from './FilterDisplay/FilterDisplay.react';
import {ApplyFiltersButton} from './ApplyFiltersButton.react';
import {ClearFiltersButton} from './ClearFiltersButton.react';
import {SaveFiltersButton} from './SaveFiltersButton.react';
import {SavedSearchesList} from './SavedSearchesList/SavedSearchesList.react';

export class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
  }

  render() {
    return (
      <div>
        <div>
          <div className="btn-group margin-bottom-sm">
            <FilterList
              filterBarActor={this.filterBarActor}
              filterBarStore={this.filterBarStore}
            />
            <button type="button" className="btn btn-default disabled"><i className="icon icon-download"></i>Export CSV</button>
            <ApplyFiltersButton
              filterBarActor={this.filterBarActor}
            />
            <ClearFiltersButton
              filterBarActor={this.filterBarActor}
            />
            <SaveFiltersButton
              filterBarActor={this.filterBarActor}
            />
            <SavedSearchesList
              filterBarActor={this.filterBarActor}
              filterBarStore={this.filterBarStore}
            />
          </div>
          <FilterDisplay
            filterBarActor={this.filterBarActor}
            filterBarStore={this.filterBarStore}
          />
        </div>
      </div>
    );
  }
}
