import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../lib/supabaseClient';
import narayanjiLogo from '../assets/narayanji-logo.png';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    // Bypass actual OTP sending, just show the OTP sent toast and set isOtpSent
    setIsOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `6-digit OTP sent to +91 ${phone}`,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For development, only allow the dummy OTP
      if (otpString !== '123456') {
        setIsLoading(false);
        toast({
          title: "OTP Verification Failed",
          description: 'Invalid OTP',
          variant: "destructive"
        });
        return;
      }
      // Call supabase verifyOtp with the dummy OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `${phone}`,
        token: '123456',
        type: 'sms',
      });
      setIsLoading(false);
      if (error || !data.session) {
        toast({
          title: "OTP Verification Failed",
          description: error?.message || 'Invalid OTP',
          variant: "destructive"
        });
        return;
      }
      // Save JWT token
      localStorage.setItem('narayanji_auth', data.session.access_token);
      localStorage.setItem('narayanji_phone', phone);
      toast({
        title: "Login Successful",
        description: "Welcome to Narayanji Gajak",
      });
      navigate('/catalog');
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: err.message || 'Something went wrong',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={narayanjiLogo}
              alt="Narayanji Logo"
              className="w-28 h-20 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Narayanji Gajak</h1>
            <p className="text-gray-600 mt-2">Distributor Portal</p>
          </div>

          {!isOtpSent ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Phone Login</h2>
              <p className="text-gray-600 mb-6">Enter your phone number to continue</p>
              
              <div className="space-y-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 rounded-l-none"
                    maxLength={10}
                  />
                </div>
                
                <Button 
                  onClick={handleSendOtp}
                  disabled={isLoading || phone.length !== 10}
                  className="w-full btn-primary"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
              <p className="text-gray-600 mb-6">
                Enter 6-digit OTP sent to<br />
                <span className="font-medium">+91 {phone}</span>
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      maxLength={1}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
                
                <button 
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="w-full text-center text-brand-red font-medium"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
