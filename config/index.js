const config = {}

config.JWT_KEY = 'devdeck101_jwt_secret_key';
config.MONGO_URL = 'mongodb://localhost:27017/devdeck101';
config.SALT_ROUNDS = 13;

module.exports = config;