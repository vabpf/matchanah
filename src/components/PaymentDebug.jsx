import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentDebug = ({ title = "Payment Debug Info" }) => {
  const [searchParams] = useSearchParams();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  const localStorage_data = {
    orderData: localStorage.getItem('orderData'),
    paymentWithQR: localStorage.getItem('paymentWithQR'),
    pendingPayment: localStorage.getItem('pendingPayment'),
    lastCompletedOrder: localStorage.getItem('lastCompletedOrder')
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#1a202c',
      color: '#e2e8f0',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      zIndex: 9999,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px', color: '#4fd1c7' }}>{title}</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong style={{ color: '#f7fafc' }}>URL Parameters:</strong>
        <pre style={{ 
          background: '#2d3748', 
          padding: '8px', 
          borderRadius: '4px', 
          margin: '5px 0',
          fontSize: '11px',
          overflow: 'auto'
        }}>
          {Object.keys(params).length > 0 
            ? JSON.stringify(params, null, 2)
            : 'No parameters'
          }
        </pre>
      </div>
      
      <div>
        <strong style={{ color: '#f7fafc' }}>LocalStorage:</strong>
        <pre style={{ 
          background: '#2d3748', 
          padding: '8px', 
          borderRadius: '4px', 
          margin: '5px 0',
          fontSize: '11px',
          overflow: 'auto'
        }}>
          {Object.entries(localStorage_data)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value ? 'exists' : 'null'}`)
            .join('\n') || 'No data'
          }
        </pre>
      </div>
    </div>
  );
};

export default PaymentDebug;