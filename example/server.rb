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

  get '/authors' do
    respond_to do |format|
      format.json do
        (1..99).collect do |n|
          {
            label: "Author #{n}",
            value: "Author #{n}",
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
    field, type, value = needle.values_at(*%w(field type value))
    case type.to_sym
    when :date
      haystack.select do |hay|
        (Date.parse(value["from"])..Date.parse(value["to"])) === hay.send(field)
      end
    when :id, :select
      haystack.select do |hay|
        hay.send(field).to_s == value
      end
    when :range
      haystack.select do |hay|
        (value["from"].to_f..value["to"].to_f) === hay.send(field)
      end
    when :text
      haystack.select do |hay|
        hay.send(field).to_s.include?(value)
      end
    else
      []
    end
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
        Date.parse(book["published_on"]),
        book["rating"]
      )
    end

    book_list = loop_over_queries(
      queries,
      json_books
    )

    if params[:order] && order = params[:order].first.collect(&:to_sym)
      book_list.sort_by!(&order.shift) && order.shift == :desc && book_list.reverse!
    end

    total_pages = 1 + book_list.length / 25
    total_pages -= 1 if book_list.length % 25 == 0

    per_page = 25

    page = params[:page].to_i || 0

    books = book_list[per_page * (page - 1), per_page * (page - 1) + per_page]

    {
      current_page: page,
      total_pages: total_pages,
      table_caption: book_list.length.to_s + ' books',
      results: books.map { |book| book.to_h }
    }.to_json
  end
end

Struct.new("Book", :author, :title, :id, :published_on, :rating)
