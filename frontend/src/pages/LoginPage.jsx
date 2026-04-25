import React, { useState } from 'react'
import api from '../api/client'

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/send-login-otp/', { email })
      if (response.data.success) {
        setOtpSent(true)
        setWhatsappNumber(response.data.whatsapp_number)
        setCountdown(30)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) clearInterval(timer)
            return prev - 1
          })
        }, 1000)
      } else {
        setError(response.data.error)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/verify-login-otp/', { otp })
      if (response.data.success) {
        onLoginSuccess(response.data.user)
      } else {
        setError(response.data.error)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-4xl">💬</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-green-100 text-sm mt-1">Login to your WhatsApp CRM account</p>
          </div>

          <div className="p-6">
            {!otpSent ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" required />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">{loading ? 'Sending...' : 'Send OTP'}</button>
              </form>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-700">OTP sent to {whatsappNumber}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-3 py-2 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="123456" />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">{loading ? 'Verifying...' : 'Verify & Login'}</button>
                {countdown > 0 && <p className="text-center text-sm text-gray-500 mt-3">Resend OTP in {countdown}s</p>}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="text-green-600 hover:underline">Sign Up</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage