require 'securerandom'

class PeopleController < ApplicationController
  def index
    @people = Person.all
  end

  def create
      @people = Person.find_or_create_by({name: people_params[:name]});

      if @people.save
        @people.update({loginhash: SecureRandom.uuid});
         render json: @people
      else
         render json: @people.errors, status: :unprocessable_entity
      end
  end

  private

  def people_params
      params.require(:person).permit(:name)
  end
end
