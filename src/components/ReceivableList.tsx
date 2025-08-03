'use client';

import { useGetReceivablesQuery } from '@/lib/redux/api/loanApi';

interface ReceivableListProps {
  phoneNumber: string;
}

export default function ReceivableList({ phoneNumber }: ReceivableListProps) {
  const { data, isLoading, error } = useGetReceivablesQuery(phoneNumber);

  const response = data as any;
  const receivables: any[] = response?.list || response || [];

  const sortedReceivables = [...receivables].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="card-modern">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-medium text-charcoal">
          Receivables <span className="text-sm text-gray-500">({receivables.length})</span>
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
          <p className="text-sm text-coral font-medium">Error loading receivables</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
          {sortedReceivables.map((loan, index) => (
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
                      {loan?.loanTaker_Info?.name}
                    </p>
                    {loan.amount === 0 && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ Received
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-light">
                    {loan?.loanTaker_Info?.phoneNumber}
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
                  <p className="text-xs font-medium text-gray-500 mb-2">Received Records</p>
                  {loan.notes.map(({noteMessage, amount}: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      <span>{noteMessage || `Payment ${idx + 1}`}</span>
                      <span className="font-medium">{amount} tk</span>
                    </div>
                  ))}
                </div>
              )}
              
              
            </div>
          ))}
          
          {receivables.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-sm text-gray-500 font-light">No receivables</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}