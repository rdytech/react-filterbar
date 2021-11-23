#ReactJS FilterableTable Example with Sinatra

Sinatra is a simple and lightweight web framework written in Ruby.
This document describes how to setup Sinatra for the purposes of development and testing the filterbar.

* Clone the Repo
```
git clone https://github.com/jobready/react-filterbar.git
```

* Use Docker

Build the image for your environment
```
docker build -t filterbar .
```
Access your new environment
```
docker run --rm -it -v "$PWD:/code" -p "4567:4567" filterbar bash
```
Move to the example dir and run bundle install
```
cd example/ && bundle install
```
Start the Sinatra Rack server on port 4567
```
bundle exec rackup -p 4567 -o 0.0.0.0
```
Visit the server via: http://localhost:4567

* optionally reset the example data so date filters make sense
```
cd example/
ruby generate_books.rb
```
