'use client';

import { useGetLoansQuery, useUpdateLoanMutation } from '@/lib/redux/api/loanApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PayableListProps {
  phoneNumber: string;
}

export default function PayableList({ phoneNumber }: PayableListProps) {
  const { data, isLoading, error } = useGetLoansQuery(phoneNumber);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateLoan] = useUpdateLoanMutation();

  const handleUpdate = async (e: React.FormEvent, loan: any) => {
    e.preventDefault();
    if (!amount) return;

    setIsUpdating(true);
    try {
      await updateLoan({
        transactionId: loan.transactionId,
        amount: parseFloat(amount),
        note: note || undefined
      }).unwrap();
      setAmount('');
      setNote('');
      toast.success('💸 Payment updated!');
    } catch (error) {
      console.error('Failed to update loan:', error);
      toast.error('Payment failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const response = data as any;
  const payables = response?.list || response || [];

  const sortedPayables = [...payables].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="card-modern">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-medium text-charcoal">
          Payables <span className="text-sm text-gray-500">({payables.length})</span>
        </h3>
        <div className="flex gap-3 items-center justify-center">
          <span className="text-xs text-gray-500 font-light">Total</span>
          <p className="text-base font-display font-medium text-charcoal">{response?.total || 0} tk</p>
        </div>
      </div>
      
      {isLoading && (
        <div className="space-y-3">
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      )}

      {error && (
        <div className="bg-coral/10 border-l-4 border-coral p-4 rounded-r-xl">
          <p className="text-sm text-coral font-medium">Error loading payables</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
          {sortedPayables.map((loan, index) => (
            <div 
              key={loan.transactionId} 
              className={`p-4 rounded-xl border transition-all duration-300 ${
                loan.amount === 0 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/80 shadow-soft-lg backdrop-blur-sm' 
                  : 'bg-white border-gray-200/80 hover:shadow-xl hover:border-gray-300'
              } slide-in`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-inter font-medium text-charcoal">
                      {loan?.loanGiver_Info?.name}
                    </p>
                    {loan.amount === 0 && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ Paid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-light">
                    {loan?.loanGiver_Info?.phoneNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display font-semibold text-charcoal">
                    {loan.amount} tk
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(loan.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{loan.reason}</p>
              
              {loan.notes && loan.notes.length > 0 && (
                <div className="space-y-1 mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Payment Records</p>
                  {loan.notes.map(({noteMessage, amount, time}: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      <span>{noteMessage || `Payment ${idx + 1}`}</span>
                      <span className="font-medium">{amount} tk</span>
                    </div>
                  ))}
                </div>
              )}

            {loan.amount !== 0 && 
            <div>
                <form onSubmit={(e)=>handleUpdate(e,loan)} className="mt-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to pay"
          className="flex-1 bg-white/50 border border-sage/20 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-sage focus:ring-0 focus:outline-none transition-all duration-200"
          required
        />
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="w-full bg-white/50 border border-sage/20 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-sage focus:ring-0 focus:outline-none transition-all duration-200 mb-2"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={async () => {
            if (!amount) return;
            try {
              setIsUpdating(true);
              await updateLoan({
                transactionId: loan.transactionId,
                amount: parseInt(amount),
                note: undefined
              }).unwrap();
              setAmount('');
              toast.success('Payment made successfully!');
            } catch (error) {
              console.error('Failed to pay:', error);
              toast.error('Failed to make payment. Please try again.');
            } finally {
              setIsUpdating(false);
            }
          }}
          disabled={isUpdating || !amount || !!note}
          className="flex-1 px-3 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-soft hover:shadow-md hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isUpdating ? 'Processing...' : 'Pay'}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!amount) return;
            try {
              setIsUpdating(true);
              await updateLoan({
                transactionId: loan.transactionId,
                amount: parseInt(amount),
                note: note || undefined
              }).unwrap();
              setAmount('');
              setNote('');
              toast.success('Note added and payment made successfully!');
            } catch (error) {
              console.error('Failed to add note and pay:', error);
              toast.error('Failed to add note and make payment. Please try again.');
            } finally {
              setIsUpdating(false);
            }
          }}
          disabled={isUpdating || !amount || !note}
          className="flex-1 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-soft hover:shadow-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isUpdating ? 'Processing...' : 'Add Note & Pay'}
        </button>
      </div>
      <button
          onClick={async () => {
            try {
              setIsUpdating(true);
              await updateLoan({
                transactionId: loan.transactionId,
                amount: loan.amount,
                fullPay: true,
                note: note || undefined
              }).unwrap();
              setAmount('');
              setNote('');
              toast.success('Loan paid in full!');
            } catch (error) {
              console.error('Full pay error details:', error);
              if (error && typeof error === 'object' && 'data' in error) {
                console.error('Error response:', error.data);
              }
              toast.error('Failed to complete full payment. Please try again.');
            } finally {
              setIsUpdating(false);
            }
          }}
          disabled={isUpdating || loan.amount === 0}
          className="w-full px-3 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-soft hover:shadow-md hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isUpdating ? 'Processing...' : 'Full Pay'}
        </button>
    </form>
              </div>

            }
            </div>
          ))}
          
          {payables.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">🏷️</div>
              <p className="text-sm text-gray-500 font-light">No payables</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}