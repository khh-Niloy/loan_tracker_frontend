export const BASE_URL = 'https://your-api-domain.com';

export const loanEndpoints = {
  createUser: `${BASE_URL}/api/v1/user/create-account`,
  createLoan: `${BASE_URL}/api/v1/payable/loan`,
  getLoans: (phoneNumber: string) => `${BASE_URL}/api/v1/payable/loan-list/${phoneNumber}`,
  getReceivables: (phoneNumber: string) => `${BASE_URL}/api/v1/payable/receivable-list/${phoneNumber}`,
  updateLoan: (transactionId: string) => `${BASE_URL}/api/v1/payable/update-loan/${transactionId}`,
};