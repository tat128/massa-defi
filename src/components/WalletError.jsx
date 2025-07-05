import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function WalletError({ message }) {
  return (
    <div className="rounded-md bg-yellow-50 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Wallet Connection Error</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{message}</p>
            <p className="mt-2">
              Please install MassaStation and the wallet plugin from{' '}
              <a 
                href="https://massa.net/massastation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-yellow-800 underline hover:text-yellow-600"
              >
                massa.net/massastation
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}