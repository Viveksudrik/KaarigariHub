const { model, Schema } = require('../Connection');

const myschema = new Schema({

    name: { type: String, required: true },
    title: String,
    category: String,
    price: { type: Number, required: true },
    description: String,
    material: String,
    image: String,
    tags: [String],
    stock: { type: Number, default: 0 },
    seller: { type: Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('product', myschema);


