### React Components Structure

FilterBar
  -> FilterList
      -> FilterListOption
  -> ApplyFiltersButton
  -> ClearFiltersButton
  -> SaveFiltersButton
  -> SavedSearchesList
  -> ConfigurationButton
  -> ExportResultsButton
  -> BatchActionsList
  -> FilterDisplay
      -> FilterGroup
          -> FilterInput
          -> FilterButton ("ADD" button)
              -> FilterListOption
      -> FilterButton ("ADD FILTER" or "OR" button)
          -> FilterListOption



### Filters Structure
Class _FilterBarStore_ has the following varables:
```(javascript)
activeFilters = [] // as array of active groups with filters
filters = {} // as initial hash with available filters
```

#### Examples:
##### Case 1
Filter1

```(javascript)
activeFilters = [
  [Filter1]
]

```
##### Case 2
Filter1 and Filter2

```(javascript)
activeFilters = [
  [Filter1, Filter2]
]

```
##### Case 3
(Filter1 and Filter 2) or Filter2

```(javascript)
activeFilters = [
  [Filter1, Filter2],
  [Filter3]
]

```
