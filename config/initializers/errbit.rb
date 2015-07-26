Airbrake.configure do |config|
  config.api_key = ENV['ERRBIT_API_KEY']
  config.host    = 'daveallie-errors.herokuapp.com'
  config.port    = 443
  config.secure  = config.port == 443
  config.environment_name = 'prod'#ENV['RACK_ENV'] || 'development'
  config.development_environments = []
end