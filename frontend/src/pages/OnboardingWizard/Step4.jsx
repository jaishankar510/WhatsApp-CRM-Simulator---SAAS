



import React, { useState, useEffect } from 'react'
import api from '../../api/client'

const Step4 = ({ data, updateData, onComplete }) => {
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [displayOtp, setDisplayOtp] = useState('')
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendOtp = async () => {
    if (!data.whatsappNumber) {
      setError('Please enter a WhatsApp number first')
      return
    }
    
    setSendingOtp(true)
    setError('')
    setSuccess('')
    setDisplayOtp('')
    
    try {
      const response = await api.post('/send-otp/')
      if (response.data.otp) {
        setDisplayOtp(response.data.otp)
        setOtpSent(true)
        setCountdown(30)
        setSuccess('OTP sent successfully!')
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    }
    setSendingOtp(false)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    
    setVerifyingOtp(true)
    setError('')
    
    try {
      // Verify OTP
      const verifyResponse = await api.post('/verify-otp/', { otp: otp.toString() })
      
      if (verifyResponse.data.verified) {
        setOtpVerified(true)
        updateData({ otpVerified: true })
        setSuccess('OTP verified successfully! Completing setup...')
        
        // Prepare onboarding data
        const onboardingData = {
          full_name: data.fullName || '',
          business_email: data.businessEmail || '',
          whatsapp_number: data.whatsappNumber || '',
          country_code: data.countryCode || '+91',
          company_name: data.companyName || '',
          employee_count: data.employeeCount || '',
          annual_revenue: data.annualRevenue || '',
          industries: data.industries || [],
          sub_category: data.subCategory || '',
          objectives: data.objectives || [],
          is_verified: true
        }
        
        setCompleting(true)
        
        try {
          // Complete onboarding
          const saveResponse = await api.post('/complete-onboarding/', onboardingData)
          if (saveResponse.data.success) {
            setSuccess('✅ Onboarding completed successfully! Redirecting...')
            // Call onComplete after a short delay
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 2000)
          } else {
            setError(saveResponse.data.error || 'Failed to complete onboarding')
            setOtpVerified(false)
          }
        } catch (saveErr) {
          console.error('Save error:', saveErr)
          setError(saveErr.response?.data?.error || 'Failed to save onboarding data')
          setOtpVerified(false)
        }
        setCompleting(false)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.response?.data?.error || 'Verification failed. Please try again.')
    }
    setVerifyingOtp(false)
  }

  const handleResendOtp = () => {
    if (countdown === 0) {
      handleSendOtp()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Number Entry & Validation</h2>
      <p className="text-gray-500 mb-6">Verify your WhatsApp number to get started</p>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <select
            value={data.countryCode}
            onChange={(e) => updateData({ countryCode: e.target.value })}
            className="w-28 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="+91">+91 (India)</option>
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+61">+61 (Australia)</option>
            <option value="+81">+81 (Japan)</option>
            <option value="+49">+49 (Germany)</option>
          </select>
          <input
            type="tel"
            value={data.whatsappNumber}
            onChange={(e) => updateData({ whatsappNumber: e.target.value })}
            placeholder="WhatsApp Number"
            className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={otpSent}
          />
        </div>
        
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={sendingOtp || !data.whatsappNumber}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {sendingOtp ? 'Sending...' : 'Send OTP'}
          </button>
        )}
        
        {otpSent && !otpVerified && (
          <div>
            {displayOtp && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-sm text-yellow-800 mb-1">📱 Demo Mode - Test OTP</p>
                <p className="text-3xl font-bold text-yellow-800 tracking-wider">{displayOtp}</p>
                <p className="text-xs text-yellow-600 mt-1">Enter this OTP to verify your number</p>
              </div>
            )}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl mb-3"
              maxLength="6"
              autoFocus
            />
            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.length !== 6 || completing}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors mb-3"
            >
              {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center">
              {countdown > 0 ? (
                <span className="text-gray-500">Resend OTP in {countdown}s</span>
              ) : (
                <button onClick={handleResendOtp} className="text-blue-600 hover:underline">Resend OTP</button>
              )}
            </div>
          </div>
        )}
        
        {otpVerified && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 text-3xl">✓</span>
            <p className="text-green-700 font-medium mt-2">Number Verified Successfully!</p>
            <p className="text-sm text-green-600 mt-1">{completing ? 'Completing setup...' : 'Setup complete! Redirecting...'}</p>
          </div>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">📌 Important Notes:</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Use a number that can receive SMS or call for OTP</li>
          <li>• Meta recommends a fresh number not already registered on WhatsApp</li>
          <li>• Make sure the number is active and can receive messages</li>
          <li>• This number will be used for your WhatsApp Business account</li>
        </ul>
      </div>
      
      <div className="text-center text-sm text-gray-400 mb-4">
        Step 4 of 4
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => window.history.back()}
          className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleVerifyOtp}
          disabled={!otpVerified || completing}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${otpVerified ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {completing ? 'Completing...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  )
}

export default Step4