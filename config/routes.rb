Rails.application.routes.draw do
  resources :locations
  resources :messages
  resources :people

  namespace :api do
      resources :messages
    end

  root to: 'login#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
