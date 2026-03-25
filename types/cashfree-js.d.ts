declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<CheckoutResult>;
  }

  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_top' | '_modal' | HTMLElement;
    appearance?: {
      width?: string;
      height?: string;
    };
  }

  export interface CheckoutResult {
    error?: {
      message: string;
      code?: string;
    };
    redirect?: boolean;
    paymentDetails?: {
      paymentMessage: string;
      paymentStatus?: string;
    };
  }

  export function load(options: {
    mode: 'sandbox' | 'production';
  }): Promise<CashfreeInstance>;
}
