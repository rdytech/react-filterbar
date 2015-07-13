require 'json'
require 'sinatra/respond_with'

class Server < Sinatra::Base
  register Sinatra::RespondWith

  get '/' do
    respond_to do |format|
      format.json { build_response(params) }
      format.html { haml :index  }
    end
  end

  get '/rating' do
    respond_to do |format|
      format.json do
        (0..50).to_a.map { |e| e / 10.0 }.select { |e| e % 0.5 == 0 }.map do |rating|
          {
            value: rating.to_s,
            label: rating.to_s
          }
        end.to_json
      end
    end
  end

  def loop_over_queries(queries, haystack)
    return haystack if queries == []
    return [] if haystack == [] || haystack == nil
    needle = queries.shift
    loop_over_queries(queries, search(needle, haystack))
  end

  def search(needle, haystack)
    return haystack.select { |hay| hay.send(needle["field"]).to_s == needle["value"] } if (needle["type"] == "id" || needle["type"] == "select")
    return haystack.select { |hay| hay.send(needle["field"]).to_s =~ Regexp.new(".*#{needle["value"]}.*") } if needle["type"] == "text"
    return haystack.select { |hay| hay.send(needle["field"]) =~ Regexp.new(".*#{needle["value"]}.*") } if needle["type"] == "date"
    []
  end

  def build_response(params)
    if ! (params[:q] == "" || params[:q] == nil)
      queries = JSON.parse(params[:q])
    else
      queries = []
    end

    json_books = JSON.parse(File.read('./books.json')).map do |book|
      Struct::Book.new(
        book["author"],
        book["title"],
        book["id"],
        book["published_on"],
        book["rating"]
      )
    end

    book_list = loop_over_queries(
      queries,
      json_books
    )

    total_pages = 1 + book_list.length / 25
    total_pages -= 1 if book_list.length % 25 == 0

    per_page = 25

    page = params[:page].to_i || 0

    books = book_list[per_page * (page - 1), per_page * (page - 1) + per_page]

    {
      current_page: page,
      total_pages: total_pages,
      results: books.map { |book| book.to_h }
    }.to_json
  end
end

Struct.new("Book", :author, :title, :id, :published_on, :rating)
