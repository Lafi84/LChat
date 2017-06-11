class MessagesController < ApplicationController
    def index
        #if !params[:location_id].nil?
        #   @return = Message.where({location_id: params[:location_id]})
        #end
        #render json: @return
    end

    def create
        userid = Person.where({loginhash: message_params[:sender]}).take
        if userid.nil?
            render json: {error: 'No such user', status: 401}.to_json, status: 401
        else
            @message = Message.new({message: message_params[:message], location_id: message_params[:location_id], person_id: userid[:id]})

            if @message.save
                @return = Message.joins(:person).where(id: @message[:id]).select("messages.*, people.name as sender").take
                render json: @return
            else
             render json: @message.errors, status: :unprocessable_entity
            end
        end
    end

    private
    def message_params
      params.require(:newmessage).permit(:message,:sender,:location_id)
    end
end
