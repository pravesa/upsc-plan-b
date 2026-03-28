import { Cashfree, CFEnvironment, CreateOrderRequest } from 'cashfree-pg';

/* ─── Types ─── */
export interface OrderPayload {
  name: string;
  email: string;
  phone: string;
}

export interface OrderResponse {
  order_id: string;
  payment_session_id: string;
}

interface ErrorResponse {
  message: string;
  response?: {
    data: {
      message: string;
      code: string;
    };
  };
}

const ENV =
  process.env.CASHFREE_ENV === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

/* ─── Single SDK instance ─── */
const cashfree = new Cashfree(
  ENV,
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!,
);

/* ─── Create order ─── */
export async function createOrder(
  payload: OrderPayload,
): Promise<OrderResponse> {
  const orderId = `PLANB_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

  const request: CreateOrderRequest = {
    order_id: orderId,
    order_amount: 199,
    order_currency: 'INR',
    customer_details: {
      customer_id: `CUST_${Date.now()}`,
      customer_name: payload.name,
      customer_email: payload.email,
      customer_phone: payload.phone,
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/watch?order_id={order_id}`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/cashfree`,
    },
    order_note: 'Plan B Pathfinder Session — ₹199',
  };

  try {
    const response = await cashfree.PGCreateOrder(request);
    const data = response.data;

    if (!data?.payment_session_id) {
      throw new Error('No payment_session_id in response');
    }

    return {
      order_id: data.order_id!,
      payment_session_id: data.payment_session_id,
    };
  } catch (err) {
    const error = err as ErrorResponse;
    throw new Error(
      `Cashfree order creation failed: ${error?.response?.data?.message ?? error.message}`,
    );
  }
}

/* ─── Verify webhook signature ─── */
export function verifyWebhook(
  signature: string,
  rawBody: string,
  timestamp: string,
): boolean {
  try {
    // SDK throws on invalid, returns void on valid
    cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    return true;
  } catch {
    return false;
  }
}

/* ─── Fetch order status (double-check after webhook) ─── */
export async function getOrderStatus(orderId: string): Promise<string> {
  try {
    const response = await cashfree.PGFetchOrder(orderId);
    return response.data?.order_status ?? 'UNKNOWN';
  } catch (err) {
    const error = err as ErrorResponse;
    throw new Error(
      `Failed to fetch order status: ${error?.response?.data?.message ?? error.message}`,
    );
  }
}
