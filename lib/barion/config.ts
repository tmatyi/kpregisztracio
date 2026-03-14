export const BARION_CONFIG = {
  posKey: process.env.BARION_POS_KEY || "",
  payeeEmail: process.env.BARION_PAYEE_EMAIL || "",
  pixelId: process.env.BARION_PIXEL_ID || "",
  environment: (process.env.NEXT_PUBLIC_BARION_ENVIRONMENT || "test") as
    | "test"
    | "prod",
  baseUrl:
    process.env.NEXT_PUBLIC_BARION_ENVIRONMENT === "prod"
      ? "https://api.barion.com"
      : "https://api.test.barion.com",
  paymentUrl:
    process.env.NEXT_PUBLIC_BARION_ENVIRONMENT === "prod"
      ? "https://secure.barion.com/Pay"
      : "https://secure.test.barion.com/Pay",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export interface BarionPaymentRequest {
  POSKey: string;
  PaymentType: "Immediate" | "Reservation" | "DelayedCapture";
  GuestCheckOut: boolean;
  FundingSources: string[];
  PaymentRequestId: string;
  PayerHint?: string;
  Locale: string;
  OrderNumber?: string;
  Currency: string;
  RedirectUrl: string;
  CallbackUrl: string;
  Transactions: BarionTransaction[];
}

export interface BarionTransaction {
  POSTransactionId: string;
  Payee: string;
  Total: number;
  Comment?: string;
  Items: BarionItem[];
}

export interface BarionItem {
  Name: string;
  Description: string;
  Quantity: number;
  Unit: string;
  UnitPrice: number;
  ItemTotal: number;
  SKU?: string;
}

export interface BarionPaymentResponse {
  PaymentId: string;
  PaymentRequestId: string;
  Status: string;
  QRUrl?: string;
  RecurrenceResult?: string;
  GatewayUrl: string;
  RedirectUrl?: string;
  CallbackUrl?: string;
  Transactions?: any[];
  Errors?: BarionError[];
}

export interface BarionError {
  ErrorCode: string;
  Title: string;
  Description: string;
  AuthData?: string;
  HappenedAt: string;
  EndPoint: string;
}

export interface BarionPaymentState {
  PaymentId: string;
  PaymentRequestId: string;
  POSId: string;
  POSName: string;
  Status:
    | "Prepared"
    | "Started"
    | "InProgress"
    | "Waiting"
    | "Reserved"
    | "Authorized"
    | "Canceled"
    | "Succeeded"
    | "Failed"
    | "PartiallySucceeded"
    | "Expired";
  PaymentType: string;
  FundingSource: string;
  AllowedFundingSources: string[];
  GuestCheckout: boolean;
  CreatedAt: string;
  ValidUntil: string;
  CompletedAt?: string;
  ReservedUntil?: string;
  Total: number;
  Currency: string;
  Transactions: any[];
}
