# FilterableTable API Documentation

## Configuration API

The configuration and rendering API uses a declarative tree structure in html, utilising dl and dt elements and html5 data attributes. This makes it trivial to parse and easy to maintain.

An example usage of the configuration API is:

```HAML
%div.react-filterable-table
  %dl.filterBarConfiguration
    %dt.persistent{ data:  { value: 'true' } }
    %dt.search-url{ data:  { value: '/books' } }
    %dt.save-search-url{ data:  { value: '/books/saved_searches' } }
    %dt.saved-searches-url{ data:  { value: '/books/saved_searches' } }
    %dt.export-results-url{ data:  { value: '/books/export' } }
    %dl.filters
      %dl.genre
        %dt.field{  data:  { value: "genre" } }
        %dt.type{   data:  { value: "select" } }
        %dt.label{  data:  { value: "Genre" } }
        %dt.url{    data:  { value: "/books/filters/genres" } }
      %dl.author
        %dt.field{  data:  { value: "Author" } }
        %dt.type{   data:  { value: "text" } }
        %dt.label{  data:  { value: "Author" } }
      %dl.isbn
        %dt.field{  data:  { value: "isbn" } }
        %dt.type{   data:  { value: "id" } }
        %dt.label{  data:  { value: "ISBN" } }
      %dl.published_date
        %dt.field{  data:  { value: "published_date" } }
        %dt.type{   data:  { value: "date" } }
        %dt.label{  data:  { value: "Published Date" } }
      %dl.rating
        %dt.field{  data:  { value: "rating" } }
        %dt.type{   data:  { value: "range" } }
        %dt.label{  data:  { value: "Rating" } }

  %dl.tableConfiguration
    %dt.data-url{ data:  { value: '/books' } }
    %dl.columns
      %dl.Title
        %dt.heading{  data:  { value: "Title" } }
        %dt.field{    data:  { value: "title" } }
        %dt.sortable{ data:  { value: "title" } }
      %dl.actions
        %dt.heading{ data:  { value: "Actions" } }
        %dt.field{ data:  { value: "actions" } }
        %dt.type{ data:  { value: "html" } }
```

To break it up into pieces:

### div.react-filterable-table

A DIV with class ```react-filterable-table``` is placed as a child of the DOMNode where the component is to be rendered. This DIV has two children, both DL elements, ```dl.filterBarConfiguration``` and ```dl.tableConfiguration```. These lists contain the configurations for the component structure, stored in a tree structure. In these configuration trees, a DL element signifies a key whose value is an object, and a DT element signifies a key whose value is a string, number or other simple value.

### dl.filterBarConfiguration

The filterBarConfiguration tree has several options, as well as a child tree containing the configurations and definitions for the filters used in the FilterBar component.

#### dt.persistent

This setting toggles url and localStorage persistence for the component. If it is true, on applying a search the component will update both the url of the page and the localStorage value for the pathname to persist the current search. This allows a user to revisit these searches without saving or rebuilding them, through bookmarking or through copy and paste. It will also eventually allow navigation using back and forward events.

*Allowed Values*: ['true', 'false']

#### dt.search-url

This setting is the endpoint the component should use to GET results from. The API contract is defined at [Search API](#search-api).

*Allowed Values*: ['/resource', '://fqdn/resource']

#### dt.save-search-url

This setting is the endpoint the component should use to POST a search in order to save it. The API contract is defined at [Saved Search API](#saved-search-api)

*Allowed Values*: ['/resource', '://fqdn/resource']

#### dt.saved-searches-url

This setting is the endpoint the component should use to GET a list of saved searches. The API contract is defined at [Saved Search API](#saved-search-api)

*Allowed Values*: ['/resource', '://fqdn/resource']

#### dt.export-results-url
This setting is the endpoint the component should use to export the current resultset. The API contract is defined at [Export Results API](#export-results-api)

*Allowed Values*: ['/resource', '://fqdn/resource']

#### dl.filters

This tree contains children trees of the filters that are to be used on the page. It has no other options.

##### dl.filterUid

Every filter configuration tree must have a unique identifier for a classname. This identifier is used by the component to identify which filters are enabled for display and to build the queries, so it is essential that it be unique.

*Allowed Values*: string(unique).

###### dt.field

This is the field the query applies to, used to build the search on the client and sent to the server. It should be the exact field name you are expecting on your server for however you plan to search. For example, with an ElasticSearch backend, the field would be the key in the document you want to filter on.

*Allowed Values*: string.

###### dt.type

This is the type of the filter, used on the server to structure the query.

* **text**: a free text input

* **id**: a free text input intended for exact matching

* **date**: a from, to date input

* **select**: a dropdown selection box

* **range**: a from, to text input

*Allowed Values*: ['text', 'id', 'date', 'select', 'range'], must be one of these.

###### dt.label

The label to show in the filter dropdown list, and when the filter is displayed.

*Allowed Values*: string

###### dt.url

This is only a required field for a select type. This is the endpoint to hit to get the options to fill the select. This API contract is defined at [Filter Options API](#filter-options-api).

*Allowed Values*: ['/resource', '://fqdn/resource']

### dl.tableConfiguration

The tableConfiguration tree has several options, as well as a child tree containing the configurations and definitions for the columns used in the Table component.

#### dt.data-url

This is the endpoint the table should use to GET the initial results.

*Allowed Values*: ['/resource', '://fqdn/resource']

#### dl.columns

This tree contains children trees of the columns that are to be used on the page. It has no other options.

##### dl.columnName

Every column configuration tree must have a unique identifier for a classname. This identifier is used by the component to identify which columns are enabled for display, so it is essential that it be unique.

###### dt.heading

The label for the column(the heading).

*Allowed Values*: string.

###### dt.field

The field in the results API that the column contains. This contract is defined in [Table Results API](#table-results-api).

*Allowed Values*: string.

###### dt.type

This is an optional field. It is used to indicate that the results being sent are html. If it isn't present, the data in the column will be plain text. If a value is set, it will run it through an html parser and render it. This is unsafe, so you must be sure that the data being passed in is clean.

*Allowed Values*: [null, 'html'].

###### dt.sortable

This is an optional field. It is used to indicate that the data in the column is sortable and should specify an identifier the API should sort on. If a value is set, it will allow the column to be sorted by clicking on the heading cell, with each click reversing the order of results.

*Allowed Values*: [null, string].

## Table Results API

The table dt.data-url endpoint and the filterbar dt.search-url endpoints expect to receive JSON documents containing results for the queries / initial data load for the table.

The API must be of the following form:

```javascript
  {
    current_page: number,
    total_pages: number,
    results: [
      {
        field: value,
        ...
      },
      ...
    ]
  }
```

Where current_page and total_page are integers, and results contains an array of objects, where each object is a row in the table. Each object has key:value pairs of the fields defined in the tableConfiguration columns list and the relevant value to display. If the value is an html string to be parsed, it should be plain html syntax stored as a string.

## Select Element Options API

The dt.url filter endpoint expects to receive JSON documents containing an array of objects of the following form:

```javascript
[
  {
    value: VALUE,
    label: LABEL
  },
  ...
]
```

where value is the associated id or attribute used to search for the relevant resources and label is the string to display in the dropdown box.

## Search API

The component expects to be able to GET to the filterBarConfiguration dt.search-url endpoint with a query string of the following form:

```javascript
  ?q=[
    {
      "uid": "dt.filterName",
      "type": "select",
      "field": "dt.field",
      "value": "User selected value"
    },
    {
      "uid": "dt.filterName",
      "type": "text",
      "field": "dt.field",
      "value": "User entered value"
    },
    {
      "uid": "dt.filterName",
      "type": "id",
      "field": "dt.field",
      "value": "User entered value"
    },
    {
      "uid": "dt.filterName",
      "type": "date",
      "field": "dt.field",
      "value": {
        "from": "User selected or entered value",
        "to": "User selected or entered value"
      }
    }
  ]&page=N"
```

The above shows you the possible packets for each filter type, where dt.filterName is the supplied filterUid in the configuration, type is the supplied type, field is the supplied field and value is the value entered by the user for the input. The N for the page is the selected page, and integer.

## Saved Search API

The saved search endpoint must be able to handle two actions, GET and POST. The GET action retrieves a list of saved searches, the POST action saves the current search (index and create essentially).

### GET

The endpoint GET action expects to be able to receive a JSON array of the following form:

```javascript
[
  {
    name: NAME
    configuration: {
                     "dt.filterName":"value",
                     ...
                   }
  }, ...
]
```

This is an array of objects, where each object has a key:value pair for a name label, and a configuration object of key:value pairs of a filterUid and a filterValue, where filterUid and Value are of the same form as in the [Search API](#search-api).

### POST

The endpoint POST action expects to be able to post a JSON payload of the following form:

```javascript
  {
    "saved_search": {
      "search_title": "user entered value",
      "filters": {
        "dt.filterName": "filterValue",
        ...
      },
    }
  }
```

This is an object where the saved_search object has two key:value pairs.
The search_title key:value pair is the user entered title for the search.
The filters key:value pair is an object who's key:value pairs are the enabled filters uids and values at the time of saving.

## Export Results API
*Coming Soon*
