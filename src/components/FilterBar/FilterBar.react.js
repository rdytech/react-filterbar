import {FilterList} from "./FilterList/FilterList.react";
import {FilterDisplay} from "./FilterDisplay/FilterDisplay.react";
import {ApplyFiltersButton} from "./ApplyFiltersButton.react";
import {ConfigurationButton} from "./ConfigurationButton.react";
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
    console.log("react-filterbar 3.2.1");

    return (
      <div>
        <div>
          <div className="btn-group margin-bottom-sm">
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

            {this.context.filterBarStore.isConfigurable() &&
              <ConfigurationButton
                filterBarStore={this.context.filterBarStore}
              />
            }

            {this.context.filterBarStore.isExportable() &&
              <ExportResultsButton
                filterBarActor={this.context.filterBarActor}
              />
            }

            <BatchActionsList />
          </div>

          <FilterDisplay
            filterBarActor={this.context.filterBarActor}
            filterBarStore={this.context.filterBarStore}
            filters={ this.context.filterBarStore.getActiveFilters() }
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
