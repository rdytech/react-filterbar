Rails.application.routes.draw do
  resources :filters
  resources :searches
  resources :books
  resources :authors
  resources :users

  root 'books#index'
end
