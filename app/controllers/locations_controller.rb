class LocationsController < ApplicationController
    include Filterable
    def index
        #@messages = Message.all
        if !params[:location_id].nil?
            @return = Message.joins(:person).where({location_id: params[:location_id]}).select("messages.*, people.name as sender").last(100)
        elsif !params[:location].nil?
            @return = Location.find_or_create_by({location: params[:location]})
        end
        render json: @return
    end
end
