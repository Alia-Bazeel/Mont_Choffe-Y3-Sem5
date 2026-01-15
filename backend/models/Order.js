const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerInfo: {
    fullName: {
      type: String,
      required: [true, 'Customer name is required']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  deliveryInfo: {
    address: {
      type: String,
      required: [true, 'Delivery address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    emirate: {
      type: String,
      required: [true, 'Emirate is required']
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required']
    },
    deliveryTime: {
      type: String,
      required: [true, 'Delivery time is required']
    }
  },
  items: [{
    product: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: false
    },
    cardMessage: {
      type: String,
      required: false
    }
  }],
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['cash', 'card', 'cod']
  },
  specialInstructions: {
    type: String,
    required: false
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving (NOT async)
orderSchema.pre('save', function() {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `BLM${timestamp.slice(-6)}${random}`;
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);