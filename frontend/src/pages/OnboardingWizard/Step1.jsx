import React, { useState } from 'react'

const Step1 = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState({})
  
  const countryCodes = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
  ]
  
  const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '500+']
  const revenueOptions = ['< $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M+']

  const validateField = (name, value) => {
    if (name === 'businessEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) return 'Email is required'
      if (!emailRegex.test(value)) return 'Invalid email format'
    }
    if (name === 'fullName' && !value) return 'Full name is required'
    if (name === 'whatsappNumber') {
      if (!value) return 'WhatsApp number is required'
      if (!/^\d{10,15}$/.test(value.replace(/\D/g, ''))) return 'Invalid phone number'
    }
    if (name === 'companyName' && !value) return 'Company name is required'
    return ''
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    updateData({ [name]: value })
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const isValid = () => {
    return data.fullName && data.businessEmail && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail) &&
           data.whatsappNumber && data.companyName
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Business Details Capture</h2>
      <p className="text-gray-500 mb-6">Enter your business information to get started</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="fullName" value={data.fullName} onChange={handleChange} onBlur={handleBlur} className={`w-full px-3 py-2 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="John Doe" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
          <input type="email" name="businessEmail" value={data.businessEmail} onChange={handleChange} onBlur={handleBlur} className={`w-full px-3 py-2 border rounded-lg ${errors.businessEmail ? 'border-red-500' : 'border-gray-300'}`} placeholder="contact@company.com" />
          {errors.businessEmail && <p className="text-red-500 text-xs mt-1">{errors.businessEmail}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <div className="flex space-x-2">
            <select value={data.countryCode} onChange={(e) => updateData({ countryCode: e.target.value })} className="w-32 px-3 py-2 border rounded-lg">
              {countryCodes.map(cc => (<option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>))}
            </select>
            <input type="tel" name="whatsappNumber" value={data.whatsappNumber} onChange={handleChange} onBlur={handleBlur} className={`flex-1 px-3 py-2 border rounded-lg ${errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="9876543210" />
          </div>
          {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" name="companyName" value={data.companyName} onChange={handleChange} onBlur={handleBlur} className={`w-full px-3 py-2 border rounded-lg ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your Company" />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
            <select name="employeeCount" value={data.employeeCount} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select</option>
              {employeeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
            <select name="annualRevenue" value={data.annualRevenue} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select</option>
              {revenueOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-400 mt-4">Step 1 of 4</div>
        
        <button onClick={onNext} disabled={!isValid()} className={`w-full mt-2 py-2 rounded-lg font-medium ${isValid() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Continue</button>
      </div>
    </div>
  )
}

export default Step1