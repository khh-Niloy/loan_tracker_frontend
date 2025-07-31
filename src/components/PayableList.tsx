'use client';

import { Loan } from '@/interfaces/interface';
import { useGetLoansQuery, useUpdateLoanMutation } from '@/lib/redux/api/loanApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PayableListProps {
  phoneNumber: string;
}
/*
{
    "message": "all loan list completed",
    "data": {
        "list": [
            {
                "_id": "688756b11be9199fb38e7d80",
                "loanTaker_Info": {
                    "name": "Hasib Hossain Niloy",
                    "phoneNumber": "01915910291",
                    "_id": "688756a71be9199fb38e7d77"
                },
                "loanGiver_Info": {
                    "phoneNumber": "01712269709",
                    "_id": "688756b01be9199fb38e7d7c"
                },
                "amount": 120,
                "transactionId": "tran-181-1753700017024",
                "notes": [],
                "reason": "kacchi",
                "createdAt": "2025-07-28T10:53:37.216Z",
                "updatedAt": "2025-07-28T10:53:37.216Z"
            }
        ],
        "totalLoan": 120
    }
}
*/

export default function PayableList({ phoneNumber }: PayableListProps) {
  const { data, isLoading, error } = useGetLoansQuery(phoneNumber);


const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateLoan] = useUpdateLoanMutation();

  const handleUpdate = async (e: React.FormEvent, loan) => {
    e.preventDefault();
    if (!amount) return;

    setIsUpdating(true);
    try {
      await updateLoan({
        transactionId: loan.transactionId,
        amount: parseInt(amount),
        note: note || undefined
      }).unwrap();
      setAmount('');
      setNote('');
      toast.success('Payment made successfully!');
    } catch (error) {
      console.error('Failed to update loan:', error);
      toast.error('Failed to make payment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const response = data as any;
  const payables = response?.data?.list || response || [];

   console.log(payables)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        My Payables ({payables.length})
      </h3>
      
      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      )}

      {error && (
        <p className="text-red-500">Error loading payables</p>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {payables.map((loan) => (
            <div key={loan.transactionId} className="border rounded-lg p-4 text-black">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{loan?.loanGiver_Info?.name || loan.loanGiver_Info.phoneNumber}</p>
                  {/* <p className="text-sm ">{loan.loanGiver_Info}</p> */}
                </div>
                <p className="font-bold text-lg">{loan.amount} tk</p>
              </div>
              <div className="mt-2 text-sm">
                <p>Reason: {loan.reason}</p>
                <p>loan taking time: {new Date(loan.createdAt).toLocaleString("en-GB", {
  timeZone: "Asia/Dhaka",       // Bangladesh time zone
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}</p>
                {
                  loan.createdAt != loan.updatedAt && (
                    <p>loan updated time: {new Date(loan.updatedAt).toLocaleString("en-GB", {
  timeZone: "Asia/Dhaka",       // Bangladesh time zone
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}</p>
                  )
                }
              </div> 
              <div>
                <form onSubmit={(e)=>handleUpdate(e,loan)} className="mt-4 space-y-2">
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
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2"
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
          disabled={isUpdating || !amount}
          className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
        >
          {isUpdating ? '...' : 'Pay'}
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
          className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
        >
          {isUpdating ? '...' : 'Add note and Pay'}
        </button>
      </div>
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
              toast.success('Loan paid in full!');
            } catch (error) {
              console.error('Failed full pay:', error);
              toast.error('Failed to complete full payment. Please try again.');
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
              </div>
            </div>

            
          ))}
          {payables.length === 0 && (
            <p className="text-gray-500 text-center py-4">No payables</p>
          )}
        </div>
      )}
    </div>
  );
}