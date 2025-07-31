export interface CreateUserRequest {
  name: string;
  phoneNumber: string;
}

export interface CreateUserResponse {
  message: string;
  data: {
    newUser: {
      name: string;
      phoneNumber: string;
    };
    token: string;
  };
}

export interface CreateLoanRequest {
  amount: number;
  loanTakerPhoneNumber: string;
  loanGiverName: string;
  loanGiverPhoneNumber: string;
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

export interface UpdateLoanRequest {
  transactionId: string;
  amount?: number;
  note?: string;
  fullPay?: boolean;
}