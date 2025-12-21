const { model, Schema } = require('../Connection');

const myschema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    avatar: { type: String, default: 'uploads/default_avatar.png' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('users', myschema);


