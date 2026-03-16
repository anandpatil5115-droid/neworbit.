import React from 'react';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const bg = type === 'error' ? 'bg-red-500/10' : 'bg-green-500/10';
  const text = type === 'error' ? 'text-red-500' : 'text-green-500';
  const border = type === 'error' ? 'border-red-500/20' : 'border-green-500/20';

  return (
    <div className={`p-4 rounded-md border ${bg} ${text} ${border} mb-4 text-sm font-medium`}>
      {message}
    </div>
  );
}
