import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  // User details
  name: string;
  email: string;
  phone: string;

  // order details
  order_id: string;
  payment_id?: string;
  payment_session_id: string;

  // Status
  status: 'pending' | 'paid' | 'failed';

  // Timestamps
  created_at: Date;
  paid_at?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    payment_id: {
      type: String,
    },
    payment_session_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    paid_at: {
      type: Date,
    },
  },
  {
    // Prevent duplicate model registration in dev hot reload
    collection: 'orders',
  },
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
