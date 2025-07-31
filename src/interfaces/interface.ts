export interface LoanForm {
  amount: string;
  loanGiverPhoneNumber: string;
  loanGiverName: string;
  reason: string;
}

export interface Loan {
  transactionId: string;
  loanGiverPhoneNumber: string;
  loanTakerPhoneNumber: string;
  amount: number;
  amountPaid: number;
  amountLeft: number;
  reason: string;
  loanTakerName: string;
  loanGiverName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}