React Components Structure
--------------------------

FilterBar
  -> FilterList
      -> FilterListOption
  -> ApplyFiltersButton
  -> ClearFiltersButton
  -> SaveFiltersButton
  -> SavedSearchesList
  -> ConfigurationButton *
  -> ExportResultsButton *
  -> BatchActionsList
  -> FilterDisplay
      -> FilterGroup
          -> FilterItem
          -> FilterButton
      -> FilterButton


{} - available filters
[] - default filters
[
  [filter1] -> when adding new add new filter1
]

[
  [filter1, filter2] -> when adding "ADD" button and add new filter2
]
