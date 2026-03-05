'use client';

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';

interface ErrorHandlerContextType {
  onError: (error: Error | any) => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined);

/**
 * Hook to access the global error handler.
 */
export const useErrorHandler = () => {
  const context = useContext(ErrorHandlerContext);

  // fallback state to trigger ErrorBoundary outside provider
  const [, setError] = useState<never>();

  const triggerError = useCallback((error: Error | any) => {
    if (context) {
      context.onError(error);
    } else {
      setError(() => {
        throw error instanceof Error ? error : new Error(String(error));
      });
    }
  }, [context]);

  return { onError: triggerError };
};

interface ErrorHandlerProviderProps {
  children: ReactNode;
  onError: (error: Error | any) => void;
}

/**
 * Provides a global error handler to all children.
 */
export const ErrorHandlerProvider: React.FC<ErrorHandlerProviderProps> = ({ children, onError }) => {
  return (
    <ErrorHandlerContext.Provider value={{ onError }}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};
