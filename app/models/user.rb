class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :confirmable, :authentication_keys => [:login]
  attr_accessor :login

  validates :username, :presence => true, :uniqueness => { :case_sensitive => false },
            format: { with: /\A[a-zA-Z0-9_.\-]+\Z/ }, length: { in: 1..30 }

  has_many :spell_books
  has_many :spell_code_maps, through: :spell_books

  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    else
      if conditions[:username].nil?
        where(conditions).first
      else
        where(username: conditions[:username]).first
      end
    end
  end
end
