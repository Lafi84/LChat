class CreateMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :messages do |t|
      t.belongs_to :location, index: true
      t.belongs_to :person, index: true
      t.string :message

      t.timestamps
    end
  end
end
