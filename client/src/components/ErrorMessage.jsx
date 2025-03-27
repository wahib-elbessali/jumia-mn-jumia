import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      <span className="font-medium">Error:</span> {message}
    </div>
  );
};

export default ErrorMessage;