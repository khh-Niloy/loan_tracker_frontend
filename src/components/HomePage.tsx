'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/redux/hooks';
import { useCreateLoanMutation, useGetLoansQuery, useGetReceivablesQuery, useUpdateLoanMutation } from '@/lib/redux/api/loanApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { loadAuthFromStorage } from '@/lib/redux/slices/authSlice';
import PayableList from './PayableList';
import ReceivableList from './ReceivableList';
import { Loan, LoanForm } from '@/interfaces/interface';


export default function HomePage() {
  const { user } = useAuth();
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [createLoan] = useCreateLoanMutation();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load auth from storage/cookies on page load
    dispatch(loadAuthFromStorage());
  }, [dispatch]);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoanForm>();

  const { data: payablesData, refetch: refetchPayables } = useGetLoansQuery(user?.phoneNumber || '');
  const { data: receivablesData, refetch: refetchReceivables } = useGetReceivablesQuery(user?.phoneNumber || '');

  const payables = Array.isArray(payablesData) ? payablesData : [];
  const receivables = Array.isArray(receivablesData) ? receivablesData : [];


  const onSubmitLoan = async (data: LoanForm) => {
    if (!user) return;
    
    setIsCreatingLoan(true);
    try {
      await createLoan({
        amount: parseFloat(data.amount),
        loanTakerPhoneNumber: user.phoneNumber,
        loanGiverName: data.loanGiverName,
        loanGiverPhoneNumber: data.loanGiverPhoneNumber,
        reason: data.reason,
      }).unwrap();
      
      reset();
      refetchPayables();
      refetchReceivables();
      toast.success('Loan created successfully!');
    } catch (error) {
      console.error('Failed to create loan:', error);
      toast.error('Failed to create loan. Please try again.');
    } finally {
      setIsCreatingLoan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Tracker</h1>
              <p className="text-sm text-gray-600">Welcome {user?.name} ({user?.phoneNumber})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-5">
          {/* Create Loan Form */}
          <div className="col-span-4 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Loan</h2>
            <form onSubmit={handleSubmit(onSubmitLoan)} className="grid grid-cols-2 gap-5">
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount *</label>
                  <input
                    {...register('amount', { required: 'Amount is required', pattern: { value: /^\d+\.?\d*$/, message: 'Please enter a valid amount' } })}
                    type="number"
                    step="0.01"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
                </div>
  
                <div>
                  <label className="block text-sm mt-5 font-medium text-gray-700">Borrower's Name *</label>
                  <input
                    {...register('loanGiverName', { required: 'Name is required' })}
                    type="text"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Full name"
                  />
                  {errors.loanGiverName && <p className="mt-1 text-sm text-red-600">{errors.loanGiverName.message}</p>}
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Borrower's Phone *</label>
                  <input
                    {...register('loanGiverPhoneNumber', { required: 'Phone number is required', pattern: { value: /^\d{10,15}$/, message: 'Invalid phone number' } })}
                    type="tel"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Phone number"
                  />
                  {errors.loanGiverPhoneNumber && <p className="mt-1 text-sm text-red-600">{errors.loanGiverPhoneNumber.message}</p>}
                </div>
  
                        <div>
                  <label className="block text-sm mt-5 font-medium text-gray-700">Reason *</label>
                  <input
                    {...register('reason', { required: 'Reason is required' })}
                    type="text"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Loan purpose"
                  />
                  {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingLoan || !user}
                className="w-full col-span-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingLoan ? 'Creating...' : 'Create Loan'}
              </button>
            </form>
          </div>

          {/* Loans Overview */}
          <div className="col-span-8 grid grid-cols-2 gap-5">
            <PayableList phoneNumber={user.phoneNumber} />
            <ReceivableList phoneNumber={user.phoneNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}
