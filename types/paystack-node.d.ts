declare module 'paystack-node' {
  interface PaystackConfig {
    secretKey: string;
  }

  interface InitializeTransactionData {
    amount: number;
    email: string;
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>;
  }

  interface InitializeTransactionResponse {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }

  interface VerifyTransactionResponse {
    status: boolean;
    message: string;
    data: {
      id: number;
      reference: string;
      amount: number;
      currency: string;
      status: string;
      paid_at: string;
      created_at: string;
      channel: string;
      customer: {
        id: number;
        email: string;
        customer_code: string;
      };
      metadata?: Record<string, any>;
    };
  }

  class Paystack {
    constructor(secretKey: string);

    transaction: {
      initialize(data: InitializeTransactionData): Promise<InitializeTransactionResponse>;
      verify(reference: string): Promise<VerifyTransactionResponse>;
    };
  }

  export = Paystack;
}
