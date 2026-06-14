/* ================================================
   useToast Hook
   Global toast notification manager
   ================================================ */

import { useState, useCallback } from 'react';
import type { ToastData, ToastType } from '../ui/Toast';

let toastIdCounter = 0;

// Global state for toasts (simple approach without external store)
let toastState: ToastData[] = [];
let toastListeners: Array<(toasts: ToastData[]) => void> = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastState]));
}

/**
 * Hook for managing toast notifications
 * Provides functions to show, update, and dismiss toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>(toastState);

  // Subscribe to global toast state
  const updateToasts = useCallback((newToasts: ToastData[]) => {
    setToasts(newToasts);
  }, []);

  // Register listener on mount
  if (!toastListeners.includes(updateToasts)) {
    toastListeners.push(updateToasts);
  }

  /**
   * Show a new toast notification
   * @param message - Message to display
   * @param type - Type of toast (info, success, error, loading)
   * @param duration - Auto-dismiss duration in ms (default: 3000 for success, 5000 for error, 0 for loading)
   * @returns Toast ID for later updates/dismissal
   */
  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration?: number
  ): string => {
    const id = `toast-${++toastIdCounter}`;
    
    // Default durations
    let autoDismiss = duration;
    if (autoDismiss === undefined) {
      if (type === 'loading') {
        autoDismiss = 0; // No auto-dismiss for loading
      } else if (type === 'error') {
        autoDismiss = 5000; // 5 seconds for errors
      } else {
        autoDismiss = 3000; // 3 seconds for success/info
      }
    }

    const newToast: ToastData = {
      id,
      type,
      message,
      duration: autoDismiss,
    };

    toastState = [...toastState, newToast];
    notifyListeners();

    return id;
  }, []);

  /**
   * Update an existing toast (useful for updating loading toasts to success/error)
   * @param id - Toast ID to update
   * @param message - New message
   * @param type - New type
   * @param duration - New duration
   */
  const updateToast = useCallback((
    id: string,
    message: string,
    type: ToastType,
    duration?: number
  ) => {
    const autoDismiss = duration !== undefined ? duration : (type === 'error' ? 5000 : 3000);
    
    toastState = toastState.map((toast) =>
      toast.id === id
        ? { ...toast, message, type, duration: autoDismiss }
        : toast
    );
    notifyListeners();
  }, []);

  /**
   * Dismiss a toast
   * @param id - Toast ID to dismiss
   */
  const dismissToast = useCallback((id: string) => {
    toastState = toastState.filter((toast) => toast.id !== id);
    notifyListeners();
  }, []);

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    toastState = [];
    notifyListeners();
  }, []);

  return {
    toasts,
    showToast,
    updateToast,
    dismissToast,
    clearAllToasts,
  };
}
