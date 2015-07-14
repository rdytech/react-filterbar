#!/usr/bin/env ruby

require 'date'
require 'json'

def random_book
  author = "Author #{rand(100)}"
  title = "Book #{rand(100)}"
  published_on = Date.today - rand(1000)
  id = rand(10000000000000)
  rating = (0..50).to_a.map { |e| e / 10.0 }.select { |e| e % 0.5 == 0 }.sample

  {
    author: author,
    title: title,
    published_on: published_on,
    id: id,
    rating: rating
  }
end

File.open('books.json', 'w') { |f| f.write( (25 * 10).times.map { random_book  }.to_json) }
