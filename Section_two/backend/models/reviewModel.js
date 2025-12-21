const { model, Schema } = require('../Connection');

const myschema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('reviews', myschema);
