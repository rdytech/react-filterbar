# FilterableTable Usage

This tutorial will walk you through how to use the react-filterbar library with a Ruby on Rails codebase. It will assume you are using HAML, bootstrap-sass, eonasdan's bootstrap-datetimepicker.

## Rendering the filterable-table on a page

The filterable-table is rendered by using a declarative API html structure, nested at the DOMNode you want the component to be rendered at. For instance, say we have a page like:

```HAML
%div.section
  <--- We want the FilterBar to be rendered here. --->
```

We would place the configuration API at the position of the first <, like so:

```HAML
%div.section
  %div.filterableTableConfiguration
    <--- Rest of the Configuration goes here --->
```

At the moment this library only supports a single table on a page at a time, but the next feature release will relax that requirement to only a single persistant filterable table on a page.






[](#)
[Installation](#installation)
[Setup](#setup)

#Setup



#Installation

Follow the instructions in the readme to install the library into your application.


#The query method

#Adding the Filterable Table

##Creating the jbuilder file

#Adding a text filter


