'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TriangleAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  // key يستخدم لإعادة تهيئة (remount) المحتوى عند إعادة المحاولة
  resetKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryButtonRef: HTMLButtonElement | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      resetKey: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error.message || 'حدث خطأ غير متوقع',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // سجل الخطأ محلياً ثم أرسله إلى خدمة تتبع أخطاء خارجية إن رغبت
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.reportError(error, errorInfo);
  }

  // مكان لربط خدمة تتبع الأخطاء (Sentry, LogRocket, ...).
  private reportError(error: Error, errorInfo?: ErrorInfo) {
    // مثال: Sentry.captureException({ error, errorInfo });
    // حالياً مجرد console (يمكنك استبداله)
    // fetch('/api/log', { method: 'POST', body: JSON.stringify({ message: error.message, stack: error.stack, info: errorInfo }) })
    console.log('Reporting error (placeholder)', { message: error.message, stack: error.stack, info: errorInfo });
  }

  handleRetry = () => {
    // إعادة تهيئة المحتوى بدون إعادة تحميل الصفحة
    this.setState((prev) => ({
      hasError: false,
      errorMessage: '',
      resetKey: prev.resetKey + 1,
    }), () => {
      // ضع التركيز على زر إعادة المحاولة بعد إعادة العرض لتحسين الوصولية
      this.retryButtonRef?.focus();
    });
  };

  handleHardReload = () => {
    // خيار إعادة تحميل كامل (احتياطي)
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleReport = async () => {
    // مثال: نسخ رسالة الخطأ إلى الحافظة أو فتح نافذة تقرير
    try {
      await navigator.clipboard.writeText(this.state.errorMessage || 'No error message');
      // يمكنك إظهار إشعار صغير للمستخدم هنا
      alert('تم نسخ تفاصيل الخطأ. يمكنك لصقها في تقرير الدعم.');
    } catch {
      // fallback
      alert('تعذر نسخ الخطأ تلقائياً. الرجاء نسخه يدوياً.');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-[var(--color-surface)] flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-[color:var(--color-surface)] p-8 rounded-2xl shadow-lg max-w-md text-center"
            role="alert"
            aria-live="assertive"
          >
            <TriangleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold mb-2">عذراً، حدث خطأ</h2>
            <p className="text-gray-600 dark:text-[var(--color-on-surface)] mb-4">
              {this.state.errorMessage}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                ref={(el) => (this.retryButtonRef = el)}
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
                aria-label="إعادة المحاولة"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                إعادة المحاولة
              </button>

              <button
                onClick={this.handleReport}
                className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-yellow-600 flex items-center gap-2"
                aria-label="الإبلاغ عن الخطأ"
              >
                الإبلاغ
              </button>

              <button
                onClick={this.handleHardReload}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                aria-label="إعادة تحميل الصفحة"
              >
                إعادة تحميل
              </button>
            </div>
          </div>
        </div>
      );
    }

    // نمرّر resetKey كمفتاح لتجبر React على إعادة تهيئة children عند تغيّره
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
