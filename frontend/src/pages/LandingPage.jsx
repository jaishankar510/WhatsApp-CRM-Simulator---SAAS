


import React, { useState } from 'react'
import api from '../api/client'

const LandingPage = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await api.post('/signup/', { email, name })
      if (response.data.success) {
        onSignupSuccess({ email, name })
      } else {
        setError(response.data.error || 'Signup failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed')
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
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-green-100 text-sm mt-1">Start your WhatsApp Business journey</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" required />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">{loading ? 'Creating account...' : 'Create Account'}</button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-green-600 hover:underline">Login</button>
              </p>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Powered by Meta WhatsApp Business Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage