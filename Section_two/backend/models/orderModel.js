const { model, Schema } = require('../Connection');

const myschema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'product' },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Object, required: true },
    status: { type: String, enum: ['CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'CREATED' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('orders', myschema);
