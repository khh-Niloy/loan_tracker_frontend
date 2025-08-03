import { CreateLoanRequest, CreateUserRequest, CreateUserResponse, Loan, UpdateLoanRequest } from '@/interfaces/redux/redux.interface';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const loanApi = createApi({
  reducerPath: 'loanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://loan-tracker-blond.vercel.app/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Loan', 'Receivable'],
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/user/create-account',
        method: 'POST',
        body,
      }),
    }),
    createLoan: builder.mutation<Loan, CreateLoanRequest>({
      query: (body) => ({
        url: '/payable/loan',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Loan'],
    }),
    getLoans: builder.query<Loan[], string>({
      query: (phoneNumber) => `/payable/loan-list/${phoneNumber}`,
      providesTags: ['Loan'],
      transformResponse: (response: any) => {
        // console.log('getLoans response:', response);
        // Handle response structure: { status, data: { list: [...] } }
        return response.data || response;
      },
    }),
    getReceivables: builder.query<Loan[], string>({
      query: (phoneNumber) => `/payable/receivable-list/${phoneNumber}`,
      providesTags: ['Receivable'],
      transformResponse: (response: any) => {
        // console.log('getReceivables response:', response);
        // Handle response structure: { status, data: { list: [...] } }
        return response.data || response;
      },
    }),
    updateLoan: builder.mutation<Loan, UpdateLoanRequest>({
      query: ({ transactionId, amount, note, fullPay }) => ({
        url: `/payable/update-loan/${transactionId}`,
        method: 'PATCH',
        body: { amount, note },
        params: fullPay ? { fullPay: true } : undefined,
      }),
      invalidatesTags: ['Loan', 'Receivable'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useCreateLoanMutation,
  useGetLoansQuery,
  useGetReceivablesQuery,
  useUpdateLoanMutation,
} = loanApi;