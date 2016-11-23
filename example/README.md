#ReactJS FilterableTable Example with Sinatra

Sinatra is a simple and lightweight web framework written in Ruby.
This document describes how to setup Sinatra for the purposes of development and testing the filterbar.

* Clone the Repo
```
git clone https://github.com/jobready/react-filterbar.git
```

* move to the example dir and run bundle install
```
cd react-filterbar/example/
bundle install
```

* optionally reset the example data so date filters make sense
```
cd react-filterbar/example/
ruby generate_books.rb
```


* start the Sinatra Rack server on port 4567
```
bundle exec rackup -p 4567
```

Visit the server via: http://localhost:4567 
