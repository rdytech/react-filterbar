import {FilterList} from "./FilterList/FilterList.react";
import {FilterDisplay} from "./FilterDisplay/FilterDisplay.react";
import {ApplyFiltersButton} from "./ApplyFiltersButton.react";
import {ExportResultsButton} from "./ExportResultsButton.react";
import {ClearFiltersButton} from "./ClearFiltersButton.react";
import {SaveFiltersButton} from "./SaveFiltersButton.react";
import {SavedSearchesList} from "./SavedSearchesList/SavedSearchesList.react";
import {BatchActionsList} from "./BatchActionsList/BatchActionsList.react";

export class FilterBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <div className="btn-group margin-bottom-sm">
            <FilterList
              disabledFilters={this.context.filterBarStore.getDisabled()}
            />

            <ApplyFiltersButton
              filterBarActor={this.context.filterBarActor}
            />

            <ClearFiltersButton
              filterBarActor={this.context.filterBarActor}
            />

            <SaveFiltersButton
              filterBarActor={this.context.filterBarActor}
            />

            <SavedSearchesList
              filterBarActor={this.context.filterBarActor}
              filterBarStore={this.context.filterBarStore}
            />

            <ExportResultsButton
              filterBarActor={this.context.filterBarActor}
            />

            <BatchActionsList />
          </div>

          <FilterDisplay
            filterBarActor={this.context.filterBarActor}
            filterBarStore={this.context.filterBarStore}
          />
        </div>
      </div>
    );
  }
}

FilterBar.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object,
  tableStore: React.PropTypes.object,
  batchActionsStore: React.PropTypes.object
};
