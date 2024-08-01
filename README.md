#ReactJS FilterableTable

## General Information

A ReactJS implementation of the new Jobready Filterbar widget. This implmentation is intended to function as a drop in widget in any of our applications.
A example sinatra application, usefull for developing, can be found in the example dir. see https://github.com/jobready/react-filterbar/tree/develop/example/README.md

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
  asset "react-filterbar", '1.7.3', git: "git@github.com:jobready/react-filterbar"
  asset "react-fluxer", git: "git@github.com:jobready/react-fluxer"

  # for local development and testing reference your file system with desired commit sha
  # asset "react-filterbar", "1.7.3", "/Users/jonathonb/proj/react-filterbar#e2b2d129baee2cfd0fc22907f58a004329ed383c"
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
    %dt.export-current-columns-url{ data: { value: '/books/export_current_columns' } }
    %dt.export-all-columns-url{ data: { value: '/books/export_all_columns' } }
    %dt.export-page-limit{ data:  { value: '50' } }
    %dt.export-page-limit-exceeded-message{ data:  { value: 'Too many books.' } }
    %dl.filters
      %dl.genre
        %dt.field{   :data => { value: "genre" } }
        %dt.type{    :data => { value: "select" } }
        %dt.label{   :data => { value: "Genre" } }
        %dt.url{     :data => { value: "/books/filters/genres" } }
        %dt.default{ :data => { value: "mystery" } }
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
      %dl.published_date_time_to
        %dt.field{ data: { value: "published_date_time_min" } }
        %dt.type{ data: { value: "single_datetime" } }
        %dt.operator{ data: { value: "lte" } }
        %dt.label{ data: { value: "Published Up Until" } }
      %dl.type
        %dt.field{   :data => { value: "type" } }
        %dt.type{    :data => { value: "multi_select" } }
        %dt.label{   :data => { value: "Type" } }
        %dt.url{     :data => { value: "/books/filters/types" } }
        %dt.default{ :data => { value: "paperback" } }
      %dl.rating
        %dt.field{  :data => { value: "rating" } }
        %dt.type{   :data => { value: "range" } }
        %dt.label{  :data => { value: "Rating" } }
    %dl.quick-filters
      %dl.author-block
        %dt.label{ data: { value: "Author Block Label" }}
        %dl.mine-button
          %dt.label{ data: { value:  'Mine'} }
          %dt.tooltip{ data: { value: "My Tooltip" }}
          %dl.filters
            %dl.author
              %dt.value{ data: { value:  'Author 1'} }
              %dt.filter{ data: { value:  'author'} }
        %dl.yours-button
          %dt.label{ data: { value:  'Yours'} }
          %dt.disabled{ data: { value:  'tooltip text'} }
          %dl.filters
            %dl.author
              %dt.value{ data: { value:  'Author 2'} }
              %dt.filter{ data: { value:  'author'} }
      %dl.published-block
        %dl.today-button
          %dt.label{ data: { value:  'Today'} }
          %dl.filters
            %dl.published
              %dt.value{ data: { value:  { from: '2016-11-15', to: '2016-11-15' } } }
              %dt.filter{ data: { value:  'published'} }
        %dl.before-today-button
          %dt.label{ data: { value:  'Before Today'} }
          %dl.filters
            %dl.published
              %dt.value{ data: { value: { from: '2016-11-14', to: '2016-11-14' } } }
              %dt.filter{ data: { value:  'published'} }
        %dl.this-month-button
          %dt.label{ data: { value:  'This Month'} }
          %dl.filters
            %dl.published
              %dt.value{ data: { value: { from: '2016-11-01', to: '2016-11-30' } } }
              %dt.filter{ data: { value:  'published'} }

      %dl.published-author-block
        %dl.today-me-button
          %dt.label{ data: { value:  'Today by Me'} }
          %dl.filters
            %dl.published
              %dt.value{ data: { value:  { from: '2016-11-15', to: '2016-11-15' } } }
              %dt.filter{ data: { value:  'published'} }
            %dl.author
              %dt.value{ data: { value:  'Author 1'} }
              %dt.filter{ data: { value:  'author'} }
        %dl.today-you-button
          %dt.label{ data: { value:  'Today by You'} }
          %dl.filters
            %dl.published
              %dt.value{ data: { value:  { from: '2016-11-15', to: '2016-11-15' } } }
              %dt.filter{ data: { value:  'published'} }
            %dl.author
              %dt.value{ data: { value:  'Author 2'} }
              %dt.filter{ data: { value:  'author'} }

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

  %dl.batchActionsConfiguration
    %dt.selectable{ data: { value: "title"} }
    %dl.actions
      %dl.mark_as_favourite
        %dt.label{ data: { value: 'Mark As Favourite' } }
        %dt.url{ data: { value: "/mark/as/favourite/path" } }
```

NOTE: The operator field in the Filter has currently only been implemented within the SingleDateTime input component. This can be extended for use in other filter at a later stage.

NOTE: The multi_select component can only be used if the select2 jQuery library version 3.5.4 has already been installed within your project.

NOTE: The batchActionsConfiguration element is used to both enable the checkboxes column on the filterbar as well as define the actions that will be visible to the user for batch processing. The data value inside the selectable element has to be a unique identifier for each record. This unique identifier value will be assigned as the value for each checkbox so that when selected this value is added to the selected values list within the current filterbar state. Each element under actions will need a unique name and within these, the label and the URL to be called for batch processing will need to be defined.

NOTE: You can disable quick filters by adding a disabled element. When disabled is present, a tooltip will be displayed when the button is hovered.

## Events

The React filterbar will trigger an event named 'react-filterbar:table-updated' against the document object whenever.

To execute Javascript code whenver the table is updated, follow the below example:

```
document.addEventListener('react-filterbar:table-updated', function() {
  // do something....
});
```

the data is updated.

## Development

* development within the react-filterbar repo can be performed using the example application included. see /example

*Using Docker*

- Build the image for your environment:
```
docker build -t filterbar .
```
- Access your new environment:
```
docker run --rm -it -v "$PWD:/code" -p "4567:4567" filterbar bash
```
- Move to the example dir and run bundle install:
```
cd example/ && bundle install
```
- Start the Sinatra Rack server on port 4567
```
bundle exec rackup -p 4567 -o 0.0.0.0
```

- Visit the server via: http://localhost:4567

### Making Changes

In your docker bash session run `npm install && node_modules/.bin/gulp` to deploy your changes to /example application.

## Deployment
When your code is ready for distribuition, run: `node_modules/.bin/gulp dist`

Push test tag to github

```
git tag -a -m "2.3.3.rc1" 2.3.3.rc1
git push origin 2.3.3.rc1 --tags
```

Update the Bowerfile in neptune side and ready for QA

```
asset "react-filterbar", "2.3.3.rc1", git: "git@github.com:rdytech/react-filterbar.git"
```

After QA pass, push the release tag and update the Bowerfile in neptune again.

```
git tag -a -m "2.3.3" 2.3.3
git push origin 2.3.3 --tags
```

## Common Problems / Bugs

* Datetimepicker popups z-index bug.

* Back button in browser

## Notes
* I18n: Please re-define translation in your app following the format via: `locales/en/translations.json`
