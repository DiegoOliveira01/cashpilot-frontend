import { TransactionType, Category } from './category';

export type RecurrenceFrequency = 'WEEKLY' | 'MONTHLY' | 'TWICE_MONTHLY';

export interface RecurringTransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: number | null;
  frequency: RecurrenceFrequency;
  firstDayOfMonth?: number | null;
  secondDayOfMonth?: number | null;
  startDate: string;
  endDate?: string | null;
  maxOccurrences?: number | null;
}

export interface RecurringTransactionResponse {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: number | null;
  categoryName: string | null;
  categoryIcon: string | null;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextOccurrenceDate: string;
  isActive: boolean;
}