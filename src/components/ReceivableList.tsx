'use client';

import { useGetReceivablesQuery, useUpdateLoanMutation } from '@/lib/redux/api/loanApi';
import { useState } from 'react';

interface ReceivableListProps {
  phoneNumber: string;
}

interface Loan {
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

export default function ReceivableList({ phoneNumber }: ReceivableListProps) {
  const { data, refetch, isLoading, error } = useGetReceivablesQuery(phoneNumber);
  
  const response = data as any;
  const receivables: Loan[] = response?.data?.list || response || [];

  const LoanUpdateForm = ({ loan, onSuccess }: { loan: Loan; onSuccess: () => void }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateLoan] = useUpdateLoanMutation();

    const handleUpdate = async (e: React.FormEvent) => {
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
        onSuccess();
      } catch (error) {
        console.error('Failed to update loan:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <form onSubmit={handleUpdate} className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to pay"
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            required
          />
          <button
            type="submit"
            disabled={isUpdating || !amount}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
          >
            {isUpdating ? '...' : 'Pay'}
          </button>
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2"
        />
        <button
            onClick={async () => {
              try {
                setIsUpdating(true);
                await updateLoan({
                  transactionId: loan.transactionId,
                  fullPay: true,
                  note: note || undefined
                }).unwrap();
                setAmount('');
                setNote('');
                onSuccess();
              } catch (error) {
                console.error('Failed full pay:', error);
              } finally {
                setIsUpdating(false);
              }
            }}
            disabled={isUpdating}
            className="w-full px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
          >
            {isUpdating ? '...' : 'Full Pay'}
          </button>
      </form>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        My Receivables ({receivables.length})
      </h3>
      
      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-28 bg-gray-200 rounded"></div>
          <div className="h-28 bg-gray-200 rounded"></div>
        </div>
      )}

      {error && (
        <p className="text-red-500">Error loading receivables</p>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {receivables.map((loan) => (
            <div key={loan.transactionId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{loan.loanTakerName}</p>
                  <p className="text-sm text-gray-600">{loan.loanTakerPhoneNumber}</p>
                </div>
                <p className="font-bold text-lg">${loan.amount}</p>
              </div>
              <div className="mt-2 text-sm">
                <p>Total: ${loan.amount}</p>
                <p>Paid: ${loan.amountPaid}</p>
                <p>Pending: ${loan.amountLeft}</p>
              </div>
              <LoanUpdateForm loan={loan} onSuccess={refetch} />
            </div>
          ))}
          {receivables.length === 0 && (
            <p className="text-gray-500 text-center py-4">No receivables</p>
          )}
        </div>
      )}
    </div>
  );
}