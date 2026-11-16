export interface CreditCardRequest {
  name: string;
  brand: string;
  closingDay: number;
  dueDay: number;
  limitAmount: number;
  imageUrl: string;
}

export interface CreditCardResponse {
  id: number;
  name: string;
  brand: string;
  closingDay: number;
  dueDay: number;
  limitAmount: number;
  imageUrl: string;
  isActive: boolean;
}