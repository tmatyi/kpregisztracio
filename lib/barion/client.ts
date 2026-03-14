import {
  BARION_CONFIG,
  BarionPaymentRequest,
  BarionPaymentResponse,
  BarionPaymentState,
} from "./config";

export class BarionClient {
  private baseUrl: string;
  private posKey: string;

  constructor() {
    this.baseUrl = BARION_CONFIG.baseUrl;
    this.posKey = BARION_CONFIG.posKey;
  }

  async startPayment(
    request: BarionPaymentRequest,
  ): Promise<BarionPaymentResponse> {
    const response = await fetch(`${this.baseUrl}/v2/Payment/Start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Barion API error response:", data);
      const errorMsg =
        data.Errors?.[0]?.Description || data.Message || response.statusText;
      throw new Error(`Barion API error: ${errorMsg}`);
    }

    if (data.Errors && data.Errors.length > 0) {
      console.error("Barion payment errors:", data.Errors);
      throw new Error(`Barion payment error: ${data.Errors[0].Description}`);
    }

    return data;
  }

  async getPaymentState(paymentId: string): Promise<BarionPaymentState> {
    const response = await fetch(
      `${this.baseUrl}/v2/Payment/GetPaymentState?POSKey=${this.posKey}&PaymentId=${paymentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Barion API error: ${response.statusText}`);
    }

    const data: BarionPaymentState = await response.json();
    return data;
  }

  getPaymentUrl(paymentId: string): string {
    return `${BARION_CONFIG.paymentUrl}?id=${paymentId}`;
  }
}

export const barionClient = new BarionClient();
