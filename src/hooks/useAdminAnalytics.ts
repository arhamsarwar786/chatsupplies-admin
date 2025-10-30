// src/hooks/useAdminAnalytics.ts
import { logAnalyticsEvent } from '@/src/lib/firebase';

// Define types for the user object
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Define types for the parameters
interface AdminActivityParams {
  [key: string]: any;
}

interface AdminErrorParams {
  error_type: string;
  admin_id: string;
  error_details: any;
  timestamp: string;
  [key: string]: any;
}

export const useAdminAnalytics = () => {
  const trackAdminActivity = (activityType: string, additionalParams: AdminActivityParams = {}) => {
    const userObject = localStorage.getItem('userObject');
    const user: User | null = userObject ? JSON.parse(userObject) : null;
    
    if (user && user.role === 'admin') {
      logAnalyticsEvent('admin_activity', {
        activity_type: activityType,
        admin_id: user.id,
        admin_username: user.username,
        admin_email: user.email,
        timestamp: new Date().toISOString(),
        ...additionalParams
      });
    }
  };

  const trackAdminPageView = (pageName: string) => {
    const userObject = localStorage.getItem('userObject');
    const user: User | null = userObject ? JSON.parse(userObject) : null;
    
    if (user && user.role === 'admin') {
      logAnalyticsEvent('admin_page_view', {
        page_name: pageName,
        admin_id: user.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  const trackAdminError = (errorType: string, errorDetails: any) => {
    const userObject = localStorage.getItem('userObject');
    const user: User | null = userObject ? JSON.parse(userObject) : null;
    
    if (user && user.role === 'admin') {
      logAnalyticsEvent('admin_error', {
        error_type: errorType,
        admin_id: user.id,
        error_details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    trackAdminActivity,
    trackAdminPageView,
    trackAdminError
  };
};