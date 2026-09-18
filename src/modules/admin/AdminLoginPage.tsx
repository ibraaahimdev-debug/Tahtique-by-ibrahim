import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateCustomerSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateCustomerSite,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stub onLogin() handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo acceptance: any password or admin demo
      onLoginSuccess();
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@tagtique.internal');
    setPassword('tagtique-sec-2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans text-gray-900 selection:bg-[#EAD9EC] selection:text-[#5C3264]">
      {/* Return to Public Site Link */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between text-xs text-gray-600">
        <button
          type="button"
          onClick={onNavigateCustomerSite}
          className="hover:text-[#5C3264] flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Customer Site</span>
        </button>

        <span className="font-mono text-gray-400">v2.4.0-internal</span>
      </div>

      {/* Centered White Card */}
      <div className="bg-white rounded-2xl shadow-md border border-[#EAD9EC]/60 w-full max-w-sm p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] mx-auto flex items-center justify-center mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            TAGTIQUE Admin Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Internal operations & fulfillment tool
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="admin@tagtique.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] focus:ring-1 focus:ring-[#EAD9EC] bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] focus:ring-1 focus:ring-[#EAD9EC] bg-white"
                required
              />
            </div>
          </div>

          {/* Primary Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-bold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EAD9EC] focus:ring-offset-2 disabled:opacity-60 border border-white/80"
          >
            {isLoading ? 'Authenticating...' : 'Login to Admin'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => alert('Forgot Password: A reset link has been dispatched to operations IT desk (Stub).')}
            className="text-xs text-[#5C3264] hover:text-[#7A2840] hover:underline focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* Demo Fast Fill Button */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
          >
            ⚡ Click to Fill Demo Credentials
          </button>
        </div>
      </div>

      {/* Security Disclaimer */}
      <p className="mt-6 text-[11px] text-gray-500 text-center max-w-xs">
        Confidential internal operations system. Unauthorized access attempts are monitored and logged.
      </p>
    </div>
  );
};
