require 'json'
require 'sinatra/respond_with'
require 'yaml/store'
require 'active_support/all'

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

  get '/authors_by_genres' do
    respond_to do |format|
      format.json do
        %w(Fiction History Business).map.with_index do |genre, i|
          range = (i * 33)..((i + 1) * 33)
          options = range.map do |n|
                      {
                        label: "Author #{n}",
                        value: "Author #{n}"
                      }
                    end

          {
            group: genre,
            options: options
          }
        end.to_json
      end
    end
  end

  post '/saved_searches' do
    saved_search = params[:saved_search]
    store = YAML::Store.new 'saved_search.yml'
    store.transaction do
      store[saved_search[:search_title]] = saved_search[:filters].to_json
    end
  end

  get '/saved_searches' do
    store = YAML::Store.new 'saved_search.yml'
    result = []
    store.transaction do
      store.roots.each do |name|
        result.push({ name: name, configuration: store[name], url: "/saved_searches/#{name}"})
      end
    end
    result.to_json
  end

  delete '/saved_searches/:name' do |name|
    store = YAML::Store.new 'saved_search.yml'
    store.transaction do
      store.delete(name)
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
    when :date_relative
      search_date_relative(haystack, field, value)
    when :relative_date_range
      if value["operator"] == "absolute"
        from = value["from"].presence && Date.parse(value["from"])
        to = value["to"].presence && Date.parse(value["to"])
      else
        from = Date.current.advance(days: value["from"].to_i)
        to = Date.current.advance(days: value["to"].to_i)
      end

      haystack.select do |hay|
        (from..to) === hay.send(field)
      end
    when :id, :select, :lazy_select
      haystack.select do |hay|
        hay.send(field).to_s == value
      end
    when :multi_select, :lazy_multi_select
      haystack.select do |hay|
        value.include?(hay.send(field).to_s)
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
        book["published_on"].present? ? Date.parse(book["published_on"]) : '',
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

  def search_date_relative(haystack, field, value)
    relative_value = value['value']
    if(relative_value == 'None')
      search_blank_values(haystack, field)
    else
      if(relative_value.present?)
        if relative_value == "Relative"
          from = Date.current.advance(days: value["from"].to_i)
          to = Date.current.advance(days: value["to"].to_i)
        else
          from, to = calculate_relative_dates(relative_value)
        end
      else
        from = Date.parse(value["from"])
        to = Date.parse(value["to"])
      end
      haystack.select do |hay|
        (from..to) === hay.send(field)
      end
    end
  end

  def calculate_relative_dates(selected)
    case selected
    when 'Today'
      from = Date.today
      to   = Date.today
    when 'Last Week'
      from = Date.today.last_week
      to   = from.end_of_week
    when 'This Week'
      from = Date.today.beginning_of_week
      to   = from.end_of_week
    end
    return [from, to]
  end

  def search_blank_values(haystack, field)
    haystack.select do |hay|
      '' === hay.send(field)
    end
  end
end

Struct.new("Book", :author, :title, :id, :published_on, :rating)
