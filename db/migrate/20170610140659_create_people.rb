class CreatePeople < ActiveRecord::Migration[5.0]
  def change
    create_table :people do |t|
      t.string :name, unique: true
      t.string :location
      t.string :loginhash

      t.timestamps
    end
  end
end
