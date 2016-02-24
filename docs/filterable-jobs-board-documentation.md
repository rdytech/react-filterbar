# FilterableJobsBoard Documentation

The React Filterbar can also render data in a Jobs Board configuration using panels.

To enable this, a few details need to be changed within your html page.

## Configuration API

Similar to the FilterableTable API, the new Jobs Board API also uses a declarative
tree structure in html using dl and dt elements to parse data.

An example usage of the configuration API is:

```HAML
%div.react-filterable-jobs-board
  %dl.filterBarConfiguration
    %dt.persistent{ data: { value: "true" } }
    %dt.search-url{ data: { value: "#{jobs_board_index_path}" } }
    %dt.save-search-url{ data: { value: "#{jobs_board_saved_searches_path}" } }
    %dt.saved-searches-url{ data: { value: "#{jobs_board_saved_searches_path}" } }
    %dt.export-results-url{ data: { value: "#{jobs_board_index_path}" } }
    %dl.filters

  %dl.jobsBoardConfiguration
    %dt.data-url{ data: { value: "#{jobs_board_index_path}" } }
    %dl.sortable-columns
      %dl.ess_created_on
        %dt.heading{ data: {value: "ESS Created On" } }
        %dt.value{ data: {value: "ess_created_on" } }
      %dl.job_title
        %dt.heading{ data: {value: "Job Title" } }
        %dt.value{ data: {value: "job_title" } }
    %dl.columns
      %dl.site_name
        %dt.field { data: { value: "site_name" } }
      %dl.job_placement_officer
        %dt.field { data: { value: "job_placement_officer" } }
      %dl.job_title
        %dt.field { data: { value: "job_title" } }
      %dl.description
        %dt.field { data: { value: "description" } }
      %dl.requirements
        %dt.field { data: { value: "requirements" } }
      %dl.location
        %dt.field { data: { value: "location" } }
      %dl.work_type
        %dt.field { data: { value: "work_type" } }
      %dl.available_positions
        %dt.field { data: { value: "available_positions" } }
      %dl.start_date
        %dt.field { data: { value: "start_date" } }
    %dl.header
      %dt.title{ data: { value: "job_title" } }
      %dl.details
        %dt.location{ data: { value: 'location' } }
        %dt.job_placement_officer{ data: { value: 'job_placement_officer' } }
    %dl.body
      %dl.left-side
        %dl.description
          %dt.heading{ data: { value: 'Description'} }
          %dt.content{ data: { value: 'description' } }
        %dl.requirements
          %dt.heading{ data: { value: 'Requirements' } }
          %dt.content{ data: { value: 'requirements' } }
      %dl.right-side
        %dl.title
          %dt.content{ data: { value: 'title' } }
        %dl.author
          %dt.content{ data: { value: 'author' } }
```

## Breakdown of API

### div.react-filterable-jobs-board

A DIV with class ```react-filterable-jobs-board``` is placed as a child of the DOMNode where the component is to be rendered. This DIV has two children, both DL elements, ```dl.filterBarConfiguration``` and ```dl.jobsBoardConfiguration```. These lists contain the configurations for the component structure, stored in a tree structure. In these configuration trees, a DL element signifies a key whose value is an object, and a DT element signifies a key whose value is a string, number or other simple value.

### dl.filterBarConfiguration

The configuration for this area is exactly the same as that for the Table View. Please refer
to the API-V1.md documentation for details on how to set this up.

### dl.jobsBoardConfiguration

This section requires 5 sub sections in order for the jobs board to work correctly

* %dl.data-url - URL used to fetch data from
* %dl.sortable-columns - the list of columns to be used sorting
* %dl.columns - the list of columns that the jobs board can work with for displaying the data
* %dl.header - this section of the jobs board panel contains a title and details to be displayed on the right side of the jobs board panel.
* %dl.body - this section contains the content that should be displayed for the body of the jobs board panel for each job.

### %dl.sortable-columns

Specify the list of columns you wish the user to be able to sort on within the Jobs Board Panel.
Each item must contain a heading and value so that the Jobs Board knows what to display to the user and what to send to
the server.

### %dl.columns

This simply a list of fields that the Jobs Board can work with. It differs from the table view in
that it no longer requires label.

### %dl.header

This section contains two areas: title and details. The title section must contain which field from
the columns section to use as the title.

The details area can have multiple items which will be displayed equally spaced to the right of the title.

### %dl.body

The body section contains a left-side and right-side area.

The left-side section can display details with a heading specified along with the content.

The right-side section can only display content with no heading. This is useful for links.