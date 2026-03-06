'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TriangleAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'حدث خطأ غير متوقع' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
            <TriangleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">عذراً، حدث خطأ</h2>
            <p className="text-gray-600 mb-4">{this.state.errorMessage}</p>
            <button
              onClick={this.handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
