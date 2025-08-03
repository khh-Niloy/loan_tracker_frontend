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
      toast.success('💸 Loan created successfully');
    } catch (error) {
      console.error('Failed to create loan:', error);
      toast.error('Failed to create loan');
    } finally {
      setIsCreatingLoan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white font-sans">
      {/* Header */}
      <header className="glass border-b border-sage/20">
        <div className="max-w-7xl mx-auto px-6 pb-4 py-6">
          <div className="flex justify-between items-center">
            <div className="slide-in">
              <h1 className="text-3xl font-display text-charcoal font-medium">LoanTracker</h1>
              <p className="text-sm text-gray-600 mt-1 font-light">
                Hello {user?.name} • {user?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Create Loan Form */}
          <div className="col-span-12 card-modern slide-in" style={{animationDelay: '0.1s'}}>
            <h2 className="text-lg sm:text-xl font-display font-medium text-charcoal mb-4 sm:mb-6">Create New Loan</h2>
            <form onSubmit={handleSubmit(onSubmitLoan)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Amount</label>
                  <input
                    {...register('amount', { 
                      required: 'Amount is required', 
                      pattern: { value: /^\d+\.?\d*$/, message: 'Please enter a valid amount' } 
                    })}
                    type="number"
                    step="0.01"
                    required
                    className="input-modern w-full placeholder-gray-400"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-sm text-coral mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{`Lender's Name`}</label>
                  <input
                    {...register('loanGiverName', { required: 'Name is required' })}
                    type="text"
                    required
                    className="input-modern w-full placeholder-gray-400"
                    placeholder="Full name"
                  />
                  {errors.loanGiverName && <p className="text-sm text-coral mt-1">{errors.loanGiverName.message}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  <input
                    {...register('loanGiverPhoneNumber', { 
                      required: 'Phone is required', 
                      pattern: { value: /^\d{10,15}$/, message: 'Invalid phone number' } 
                    })}
                    type="tel"
                    required
                    className="input-modern w-full placeholder-gray-400"
                    placeholder="Phone number"
                  />
                  {errors.loanGiverPhoneNumber && <p className="text-sm text-coral mt-1">{errors.loanGiverPhoneNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Reason</label>
                  <input
                    {...register('reason', { required: 'Reason is required' })}
                    type="text"
                    required
                    className="input-modern w-full placeholder-gray-400"
                    placeholder="Loan purpose"
                  />
                  {errors.reason && <p className="text-sm text-coral mt-1">{errors.reason.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingLoan || !user}
                className="w-full col-span-1 md:col-span-2 bg-gradient-peach-coral text-balck font-medium py-3 px-4 sm:px-6 rounded-xl hover:shadow-soft-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 border border-black/10"
              >
                <span>{isCreatingLoan ? 'Creating...' : 'Create Loan'}</span>
              </button>
            </form>
          </div>

          {/* Summary Cards */}
          <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="slide-in" style={{animationDelay: '0.2s'}}>
              <PayableList phoneNumber={user?.phoneNumber as string} />
            </div>
            <div className="slide-in" style={{animationDelay: '0.3s'}}>
              <ReceivableList phoneNumber={user?.phoneNumber as string} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
