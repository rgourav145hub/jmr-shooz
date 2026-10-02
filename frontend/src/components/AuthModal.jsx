import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  CreditCard, 
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Database,
  Clock,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  apiLogin, 
  apiSendOtp, 
  apiVerifyOtp, 
  apiForgotPasswordRequest, 
  apiForgotPasswordReset, 
  apiRegisterRetailer,
  checkDatabaseHealth
} from '../services/api';
import { getRegisteredUsers } from '../utils/storage';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', initialRole = 'retailer', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'otp', 'register', 'forgot'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'retailer' or 'admin'
  
  // Standard Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Login fields
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Forgot Password fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotDemoCode, setForgotDemoCode] = useState('');

  // Registration fields
  const [regData, setRegData] = useState({
    accountType: 'retailer',
    companyName: '',
    gstin: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    businessType: 'Footwear Retail Store',
    bankName: '',
    accountNo: '',
    ifsc: '',
    branch: '',
    upiId: ''
  });
  const [showRegBankFields, setShowRegBankFields] = useState(false);
  const [regStep, setRegStep] = useState('form'); // 'form' or 'otp'
  const [regOtp, setRegOtp] = useState('');
  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [regDemoCode, setRegDemoCode] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: true, database: 'SQLite v3' });

  // Check if current registration email is already registered
  const isEmailAlreadyRegistered = mode === 'register' && 
    regData.email.trim().length > 4 && 
    getRegisteredUsers().some(u => u.email && u.email.trim().toLowerCase() === regData.email.trim().toLowerCase());

  useEffect(() => {
    setMode(initialMode);
    setSelectedRole(initialRole);
    if (initialRole === 'admin') {
      setRegData(prev => ({ ...prev, accountType: 'admin' }));
    } else {
      setRegData(prev => ({ ...prev, accountType: 'retailer' }));
    }
    setLoginIdentifier('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setShowRegPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccessInfo(null);
    setOtpSent(false);
    setForgotSent(false);
    setRegStep('form');
    setRegOtp('');
    setRegOtpTimer(0);
    setRegDemoCode('');

    checkDatabaseHealth().then(status => {
      setDbStatus(status);
    });
  }, [initialMode, initialRole, isOpen]);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Timer effect for Registration OTP resend
  useEffect(() => {
    let interval;
    if (regOtpTimer > 0) {
      interval = setInterval(() => setRegOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [regOtpTimer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiLogin(loginIdentifier, loginPassword, selectedRole);
      setLoading(false);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  // 2. OTP Send Handler
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpIdentifier.trim()) {
      setError('Please enter your registered Mobile Number or Email.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await apiSendOtp(otpIdentifier.trim(), 'LOGIN');
      setLoading(false);
      if (res.success) {
        setOtpSent(true);
        if (res.maskedEmail) {
          setSuccessInfo({
            name: 'OTP Sent',
            companyName: `OTP sent to ${res.maskedEmail}. Check your inbox.`,
            retailerId: res.simulated ? 'SIMULATION MODE (Logged to server console)' : ''
          });
          setTimeout(() => setSuccessInfo(null), 4000);
        }
        if (res.simulated && res.simulatedOtp) {
          setOtpDemoCode(res.simulatedOtp);
          setOtpCode(res.simulatedOtp);
        } else {
          setOtpDemoCode('');
          setOtpCode('');
        }
        setOtpTimer(45);
      } else {
        setError(res.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error sending OTP.');
    }
  };

  // 3. OTP Verify & Login Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await apiVerifyOtp(otpIdentifier.trim(), otpCode.trim(), 'LOGIN', selectedRole);
      setLoading(false);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Verification failed. Try again.');
    }
  };

  // 4. Forgot Password Request Handler
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setError('Please enter your registered Email, Retailer ID, or Phone.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await apiForgotPasswordRequest(forgotIdentifier.trim());
      setLoading(false);
      if (res.success) {
        setForgotSent(true);
        const emailNotice = res.maskedEmail || res.emailMasked || 'registered email';
        setSuccessInfo({
          name: 'Password Reset OTP Sent',
          companyName: `OTP sent to ${emailNotice}. Check your inbox.`,
          retailerId: res.simulated ? 'SIMULATION MODE (Logged to server console)' : ''
        });
        setTimeout(() => setSuccessInfo(null), 4000);

        if (res.simulated && res.simulatedOtp) {
          setForgotDemoCode(res.simulatedOtp);
          setForgotOtp(res.simulatedOtp);
        } else {
          setForgotDemoCode('');
          setForgotOtp('');
        }
      } else {
        setError(res.error || 'No registered account found with this identifier.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error processing password reset.');
    }
  };

  // 5. Forgot Password Reset Handler
  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (!forgotOtp.trim()) {
      setError('Please enter the 6-digit verification OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await apiForgotPasswordReset(forgotIdentifier.trim(), forgotOtp.trim(), newPassword);
      setLoading(false);
      if (res.success) {
        setSuccessInfo({
          name: 'Account Updated',
          companyName: 'Password Changed Successfully',
          retailerId: 'Please login with your new password'
        });
        setTimeout(() => {
          setMode('login');
          setLoginIdentifier(forgotIdentifier);
          setLoginPassword(newPassword);
          setSuccessInfo(null);
        }, 2000);
      } else {
        setError(res.error || 'Password reset failed.');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to update password.');
    }
  };

  // 6. Registration Handlers (with Email OTP Verification)
  const handleSendRegOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!regData.name.trim() || !regData.email.trim() || !regData.password) {
      setError('Please fill all mandatory contact fields (Name, Email, Password).');
      return;
    }

    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!regData.phone.trim()) {
      setError('Please provide your WhatsApp / Phone number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regData.email.trim())) {
      setError('Please enter a valid official email address.');
      return;
    }

    // Check if user is already registered in existing accounts
    const localUsers = getRegisteredUsers();
    const existingUser = localUsers.find(
      u => u.email && u.email.trim().toLowerCase() === regData.email.trim().toLowerCase()
    );
    if (existingUser) {
      setError('User already registered with this email address. Please sign in.');
      return;
    }

    if (regData.accountType === 'retailer') {
      if (!regData.companyName.trim()) {
        setError('Please provide your Footwear Business / Shop Name.');
        return;
      }
      if (!regData.city.trim()) {
        setError('Please enter your City & State.');
        return;
      }
    }

    if (regData.gstin && regData.gstin.trim().length > 0 && regData.gstin.trim().length < 15) {
      setError('GSTIN must be 15 characters long (e.g. 07AAAAA0000A1Z5).');
      return;
    }

    setLoading(true);

    try {
      const res = await apiSendOtp(regData.email.trim(), 'REGISTER');
      setLoading(false);
      if (res.success) {
        setRegStep('otp');
        setRegOtpTimer(60);
        if (res.simulatedOtp) {
          setRegDemoCode(res.simulatedOtp);
        }
      } else {
        setError(res.error || 'Failed to send OTP to email. Please verify your email.');
      }
    } catch (err) {
      setLoading(false);
      setError('Could not send verification OTP. Please try again.');
    }
  };

  const handleResendRegOtp = async () => {
    if (regOtpTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      const res = await apiSendOtp(regData.email.trim(), 'REGISTER');
      setLoading(false);
      if (res.success) {
        setRegOtpTimer(60);
        if (res.simulatedOtp) {
          setRegDemoCode(res.simulatedOtp);
        }
      } else {
        setError(res.error || 'Failed to resend verification OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Could not resend OTP. Please try again.');
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!regOtp || regOtp.trim().length < 6) {
      setError('Please enter the 6-digit OTP received on your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRegisterRetailer({
        ...regData,
        email: regData.email.trim(),
        otp: regOtp.trim()
      });
      setLoading(false);
      if (res.success) {
        setSuccessInfo({
          isPending: true,
          name: res.user?.name || regData.name,
          email: res.user?.email || regData.email,
          retailerId: res.user?.retailerId || res.user?.id,
          companyName: res.user?.companyName || regData.companyName,
          accountType: regData.accountType,
          status: 'pending'
        });
        // Clear sensitive inputs
        setRegData(prev => ({
          ...prev,
          name: '',
          email: '',
          phone: '',
          password: '',
          companyName: '',
          gstin: ''
        }));
        setRegOtp('');
        setRegStep('form');
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="auth-modal-title" className="text-base font-bold text-white tracking-wide">
                  {mode === 'login' && 'Sign In to Your Account'}
                  {mode === 'otp' && 'Instant OTP Verification'}
                  {mode === 'register' && 'Create New Account'}
                  {mode === 'forgot' && 'Reset Account Password'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>B2B Verified</span>
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                JMR Shooz Authorized B2B Distribution Network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-brand-card text-slate-400 hover:text-white hover:bg-brand-cardHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle Selector: Retailer / Store Portal vs Admin Suite */}
        <div className="bg-brand-dark/80 px-6 py-2.5 border-b border-brand-border/80 flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Select Role:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-brand-surface rounded-xl border border-brand-border">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('retailer');
                setRegData(prev => ({ ...prev, accountType: 'retailer' }));
                if (loginIdentifier === 'admin@jmrshooz.com') setLoginIdentifier('');
                setError('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRole === 'retailer'
                  ? 'bg-brand-gold text-brand-dark shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>User / Retailer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setRegData(prev => ({ ...prev, accountType: 'admin' }));
                if (!loginIdentifier || loginIdentifier === 'RET-2026-1042') setLoginIdentifier('admin@jmrshooz.com');
                setError('');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-brand-border bg-brand-dark/50">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                mode === 'login' 
                  ? 'border-brand-gold text-brand-gold bg-brand-surface' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => { setMode('otp'); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                mode === 'otp' 
                  ? 'border-brand-gold text-brand-gold bg-brand-surface' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Login with OTP</span>
            </button>

            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                mode === 'register' 
                  ? 'border-brand-gold text-brand-gold bg-brand-surface' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[72vh] space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
              error.toLowerCase().includes('pending') || error.toLowerCase().includes('approval')
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                : 'bg-red-950/40 border-red-800/60 text-red-300'
            }`}>
              {error.toLowerCase().includes('pending') || error.toLowerCase().includes('approval') ? (
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                <span>{error}</span>
                {error.toLowerCase().includes('already registered') && mode === 'register' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      if (regData.email) setLoginIdentifier(regData.email);
                      setError('');
                    }}
                    className="ml-2 font-bold text-brand-gold underline hover:text-yellow-300 inline-block"
                  >
                    Click here to Sign In →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successInfo ? (
            successInfo.isPending ? (
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-gold-sm">
                  <Clock className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Account Created — Verification Pending</h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Aapka account safaltapoorvak create ho gaya hai! Security policy ke anusar, ise <strong className="text-amber-400">Admin Verification</strong> ke liye bhej diya gaya hai.
                </p>

                <div className="bg-brand-card p-4 rounded-xl border border-brand-border/80 text-left space-y-2 text-xs text-slate-300 max-w-sm mx-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-bold text-white">{successInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-bold text-brand-gold">{successInfo.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Application Reference ID:</span>
                    <span className="font-mono font-bold text-brand-gold bg-brand-surface px-2 py-0.5 rounded border border-brand-border">{successInfo.retailerId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account Type:</span>
                    <span className="font-bold uppercase text-[10px] text-white">{successInfo.accountType}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-brand-border/60">
                    <span className="text-slate-400">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                      Pending Admin Approval
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs max-w-sm mx-auto flex items-start gap-2.5 text-left">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <span>Admin dwara verify hone ke baad aapko email notification prapt hogi, tabhi aap login kar sakenge.</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessInfo(null);
                      setMode('login');
                      setLoginIdentifier(successInfo.email || successInfo.retailerId);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                  >
                    Go to Login Screen
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-gold-sm">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">{successInfo.name || 'Success!'}</h4>
                <p className="text-sm text-slate-300">
                  {successInfo.companyName || 'Your account credentials have been securely verified and saved.'}
                </p>
                {successInfo.retailerId && (
                  <div className="bg-brand-card p-4 rounded-xl border border-brand-gold/40 text-center">
                    <span className="text-[11px] text-brand-muted uppercase tracking-wider block">Your Official Retailer ID</span>
                    <span className="text-lg font-mono font-bold text-brand-gold">{successInfo.retailerId}</span>
                  </div>
                )}
                <p className="text-xs text-brand-muted animate-pulse">
                  Redirecting to your wholesale portal...
                </p>
              </div>
            )
          ) : mode === 'login' ? (
            /* 1. PASSWORD LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email, Mobile, or Retailer ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="auth_user"
                    autoComplete="off"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. your-email@company.com or RET-ID"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-xs text-brand-gold hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    name="auth_secret"
                    autoComplete="new-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{loading ? 'Authenticating...' : 'Access B2B Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs text-slate-400">Prefer OTP without password?</span>
                <button
                  type="button"
                  onClick={() => { setMode('otp'); setOtpIdentifier(loginIdentifier); setError(''); }}
                  className="text-xs font-bold text-brand-gold hover:underline cursor-pointer"
                >
                  Login with OTP →
                </button>
              </div>
            </form>
          ) : mode === 'otp' ? (
            /* 2. LOGIN WITH OTP FLOW */
            <div className="space-y-4">
              <div className="bg-brand-card/60 p-3.5 rounded-xl border border-brand-gold/20 flex items-center gap-3 text-xs text-slate-300">
                <Smartphone className="w-5 h-5 text-brand-gold shrink-0" />
                <span>Login securely using an authentic 6-digit One-Time Password sent to your registered Mobile or Email.</span>
              </div>

              {!otpSent ? (
                /* Step 1: Request OTP */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Registered Mobile Number or Email *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={otpIdentifier}
                        onChange={(e) => setOtpIdentifier(e.target.value)}
                        placeholder="e.g. +91 98111 22334 or metro@shoestore.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{loading ? 'Generating Code...' : '📲 Send 6-Digit OTP'}</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Verify OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-brand-card border border-brand-gold/30 text-center space-y-1">
                    <span className="text-[11px] font-bold text-brand-gold block">
                      OTP भेज दिया गया है आपके registered email पर। अपना inbox check करें।
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Enter 6-Digit Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-brand-gold hover:underline"
                      >
                        Change Number/Email
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full py-3 px-4 rounded-xl bg-brand-card border border-brand-border text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:border-brand-gold transition-colors font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Verifying Code...' : 'Verify OTP & Access Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Didn't receive code?</span>
                    {otpTimer > 0 ? (
                      <span className="font-mono text-brand-gold">Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-brand-gold font-bold hover:underline"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          ) : mode === 'forgot' ? (
            /* 3. FORGOT PASSWORD FLOW */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Password Recovery & Reset
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Sign In
                </button>
              </div>

              {!forgotSent ? (
                /* Step 1: Identifier for reset */
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Enter your registered account Email, Phone, or Retailer ID. A 6-digit recovery OTP will be generated to verify your identity.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Registered Email, Phone, or Retailer ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. metro@shoestore.com or RET-2026-1042"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Verifying Account...' : 'Send Password Reset OTP'}</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Enter OTP & Set New Password */
                <form onSubmit={handleForgotReset} className="space-y-3.5 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-gold/30 text-center">
                    <span className="text-[11px] font-bold text-brand-gold block">
                      OTP भेज दिया गया है आपके registered email पर। अपना inbox check करें।
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Gmail SMTP connect karne ke liye backend .env me GMAIL_USER & GMAIL_APP_PASSWORD set karein.
                    </span>
                  </div>

                  {forgotDemoCode && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                      <div>
                        <span className="font-semibold block text-[11px]">Dev Simulation Mode OTP:</span>
                        <span className="font-mono text-sm tracking-wider font-bold text-amber-200">{forgotDemoCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForgotOtp(forgotDemoCode)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/40"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Enter 6-Digit OTP *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-center font-mono text-base tracking-widest focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Set New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-4 pr-11 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-4 pr-11 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Saving in Database...' : 'Save New Password & Log In'}</span>
                  </button>
                </form>
              )}
            </div>
          ) : regStep === 'otp' ? (
            /* 4b. REGISTRATION EMAIL OTP VERIFICATION STEP */
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Verify Email Address
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setRegStep('form'); setError(''); }}
                  className="text-xs text-brand-gold hover:underline flex items-center gap-1"
                >
                  <span>← Edit Details</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-card/80 border border-brand-gold/30 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-brand-gold text-xs font-bold">
                  <Mail className="w-4 h-4" />
                  <span>Verification Code Sent!</span>
                </div>
                <p className="text-xs text-slate-300">
                  We have sent a 6-digit verification OTP to your email:
                </p>
                <p className="text-sm font-bold text-white font-mono bg-black/40 py-1 px-3 rounded-lg inline-block border border-brand-border">
                  {regData.email}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Please check your Inbox (or Spam folder) and enter the 6-digit code below.
                </p>
              </div>

              {regDemoCode && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-[11px]">Dev Simulation Mode OTP:</span>
                    <span className="font-mono text-sm tracking-wider font-bold text-amber-200">{regDemoCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegOtp(regDemoCode)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/40"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 text-center">
                    Enter 6-Digit Verification OTP *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full py-3 px-4 rounded-xl bg-brand-card border border-brand-border text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:border-brand-gold transition-colors font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Verifying OTP & Registering...' : 'Verify OTP & Complete Registration'}</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Didn't receive email?</span>
                  {regOtpTimer > 0 ? (
                    <span className="font-mono text-brand-gold">Resend in {regOtpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendRegOtp}
                      className="text-brand-gold font-bold hover:underline"
                    >
                      Resend OTP Now
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            /* 4. RETAILER REGISTRATION FORM (WITH GSTIN & BANK DETAILS) */
            <form onSubmit={handleSendRegOtp} className="space-y-3.5">

                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="accountType" 
                      value="retailer" 
                      checked={regData.accountType === 'retailer'} 
                      onChange={(e) => setRegData({...regData, accountType: e.target.value})}
                      className="accent-brand-gold"
                    />
                    <span className="text-sm text-white">Retailer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="accountType" 
                      value="admin" 
                      checked={regData.accountType === 'admin'} 
                      onChange={(e) => setRegData({...regData, accountType: e.target.value})}
                      className="accent-brand-gold"
                    />
                    <span className="text-sm text-white">Admin</span>
                  </label>
                </div>

              <div className="bg-brand-card/60 p-3 rounded-xl border border-brand-gold/20 flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
                <span>Register with your Footwear Business details. Data is encrypted and securely protected.</span>
              </div>

              {regData.accountType === 'retailer' && (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Footwear Shop / Business Name *
        </label>
        <div className="relative">
          <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required={regData.accountType === 'retailer'}
            value={regData.companyName}
            onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
            placeholder="e.g. Royal Shoe Emporium"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>
      </div>
  )}
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. Sunil Kumar"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    City & State *
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.city}
                    onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-mono"
                  />
                </div>

                {/* GSTIN NUMBER FIELD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      GSTIN (GST Number)
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">Optional</span>
                  </div>
                  <input
                    type="text"
                    maxLength={15}
                    value={regData.gstin}
                    onChange={(e) => setRegData({ ...regData, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Official Email *
                    </label>
                    {isEmailAlreadyRegistered && (
                      <span className="text-[10px] text-red-400 font-bold animate-in fade-in">
                        Already Registered!
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => {
                      setRegData({ ...regData, email: e.target.value });
                      if (error) setError('');
                    }}
                    placeholder="name@footwearshop.com"
                    className={`w-full px-3.5 py-2 rounded-xl bg-brand-card border text-white text-sm focus:outline-none transition-colors ${
                      isEmailAlreadyRegistered 
                        ? 'border-red-500/80 focus:border-red-400 text-red-200' 
                        : 'border-brand-border focus:border-brand-gold'
                    }`}
                  />
                  {isEmailAlreadyRegistered && (
                    <div className="mt-1 text-[11px] text-red-400 flex items-center justify-between animate-in fade-in">
                      <span>User already registered with this email.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setLoginIdentifier(regData.email);
                          setError('');
                        }}
                        className="text-brand-gold font-bold underline hover:text-yellow-300"
                      >
                        Sign in instead →
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Create Login Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full pl-3.5 pr-11 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* RETAILER BANK DETAILS (OPTIONAL EXPANDABLE) */}
              <div className="pt-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setShowRegBankFields(!showRegBankFields)}
                  className="w-full flex items-center justify-between text-xs text-brand-gold font-bold py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>+ Add Bank Details for Settlements / Rebates (Optional)</span>
                  </span>
                  {showRegBankFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRegBankFields && (
                  <div className="mt-3 p-3.5 bg-brand-card/50 rounded-xl border border-brand-border/60 space-y-3 animate-in fade-in">
                    <p className="text-[11px] text-slate-400">
                      Used for wholesale credit notes, trade discount rebates, and security deposits.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={regData.bankName}
                          onChange={(e) => setRegData({ ...regData, bankName: e.target.value })}
                          placeholder="e.g. State Bank of India, HDFC"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase mb-1">Bank Account Number</label>
                        <input
                          type="text"
                          value={regData.accountNo}
                          onChange={(e) => setRegData({ ...regData, accountNo: e.target.value })}
                          placeholder="e.g. 50200012345678"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={regData.ifsc}
                          onChange={(e) => setRegData({ ...regData, ifsc: e.target.value.toUpperCase() })}
                          placeholder="e.g. SBIN0001245"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase mb-1">UPI ID (Optional)</label>
                        <input
                          type="text"
                          value={regData.upiId}
                          onChange={(e) => setRegData({ ...regData, upiId: e.target.value })}
                          placeholder="e.g. shop@upi"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Mail className="w-4 h-4" />
                <span>{loading ? 'Sending Verification OTP...' : 'Verify Email & Proceed'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-1">
                A 6-digit OTP will be sent to your email to verify account ownership.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
