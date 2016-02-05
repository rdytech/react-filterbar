#ReactJS FilterableTable

## General Information

A ReactJS implementation of the new Jobready Filterbar widget. This implmentation is intended to function as a drop in widget in any of our applications.

## Dependencies

* A global React

* A global EventEmitter

* jQuery

* Bootstrap

* A global ReactBootstrap

* A global ReactBootstrap-DateTimePicker

See the [react-fluxer](http://github.com/jobready/react-fluxer) repository for requirable global react and event-emitter libraries.

The primary distribution method is bower. The recommended target is the master branch, which will be tagged according to semver.

## Installation

### Rails Application

#### Remove Turbolinks

See [Remove turbolinks](blog.steveklabnik.com/posts/2013-06-25-removing-turbolinks-from-rails-4) for details how.

#### Install Bootstrap

Either by using the bootstrap-sass gem, or through the cdn. However you like.

#### Ensure you are using jQuery-rails

#### Install and configure Bower-Rails

Follow the [Bower-Rails installation guide](https://github.com/rharriso/bower-rails). I recommend the Ruby DSL configuration file rather than the JSON one.

Once bower:rails is installed, add the following lines to your Bowerfile:

```Ruby
group :lib, :assets_path => "assets/static" do
  asset "react-filterbar", '1.0.1', git: "git@github.com:jobready/react-filterbar"
  asset "react-fluxer", '0.0.3', git: "git@github.com:jobready/react-fluxer"
end
```

Then run the following command:

```
bundle exec bower:cache:clean bower:clean bower:update
```

This will install the filterbar and fluxer libraries and their dependencies to your bower assets_path. Once that is done, add the following lines to your application.js:

```Javascript
//= require jquery
//= require jquery_ujs
//= require react-fluxer/dist/react-fluxer
//= require react_bootstrap
//= require react-filterbar/dist/react-filterbar
//= require bootstrap
//= require moment
//= require bootstrap-datetimepicker
```

This assumes you have manually placed bootstrap, moment and the bootstrap-datetimepicker into you app/assets/javascripts directory. Otherwise, require those libraries however your source recommends.

## Quick Start

Follow the [tutorial](docs/tutorial-v1.md).

## Usage

The library will run a script on any page it is included that looks through the DOM for any nodes with the class 'react-filterable-table'.

The following haml snippet is an example of the code to include on your html page to render a filterable table. For a more in depth API description, please see the [API Documentation](docs/API-V1.md).

```HAML
%div.react-filterable-table
  %dl.filterBarConfiguration
    %dt.persistent{ :data => { value: 'true' } }
    %dt.search-url{ :data => { value: '/books' } }
    %dt.save-search-url{ :data => { value: '/books/saved_searches' } }
    %dt.saved-searches-url{ :data => { value: '/books/saved_searches' } }
    %dt.export-results-url{ :data => { value: '/books/export' } }
    %dl.filters
      %dl.genre
        %dt.field{  :data => { value: "genre" } }
        %dt.type{   :data => { value: "select" } }
        %dt.label{  :data => { value: "Genre" } }
        %dt.url{    :data => { value: "/books/filters/genres" } }
      %dl.author
        %dt.field{  :data => { value: "Author" } }
        %dt.type{   :data => { value: "text" } }
        %dt.label{  :data => { value: "Author" } }
      %dl.isbn
        %dt.field{  :data => { value: "isbn" } }
        %dt.type{   :data => { value: "id" } }
        %dt.label{  :data => { value: "ISBN" } }
      %dl.published_date
        %dt.field{  :data => { value: "published_date" } }
        %dt.type{   :data => { value: "date" } }
        %dt.label{  :data => { value: "Published Date" } }
      %dl.rating
        %dt.field{  :data => { value: "rating" } }
        %dt.type{   :data => { value: "range" } }
        %dt.label{  :data => { value: "Rating" } }

  %dl.tableConfiguration
    %dt.data-url{ :data => { value: '/books' } }
    %dl.columns
      %dl.Title
        %dt.heading{  :data => { value: "Title" } }
        %dt.field{    :data => { value: "title" } }
        %dt.sortable{ :data => { value: "title" } }
      %dl.actions
        %dt.heading{ :data => { value: "Actions" } }
        %dt.field{ :data => { value: "actions" } }
        %dt.type{ :data => { value: "html" } }
```

## Development

### Starting the Example Application

In order to view the changes that you make for the React Filterbar, there is an
example Sinatra application that has been provided. Follow this procedure to start
up the application.

1. Navigate to the example folder within the repository.
2. Run bundle install to install all required gems
3. Run bundle exec shotgun config.ru to start the application.
4. Navigate to http://127.0.0.1:9393/ within your browser.

## Common Problems / Bugs

* Datetimepicker popups z-index bug.

* Back button in browser

## Notes
