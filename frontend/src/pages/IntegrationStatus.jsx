


import React, { useState, useEffect } from 'react'
import api from '../api/client'

const IntegrationStatus = () => {
  const [mode, setMode] = useState('connected')
  const [status, setStatus] = useState(null)
  const [onboardingData, setOnboardingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testNumber, setTestNumber] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showApiStatusModal, setShowApiStatusModal] = useState(false)

  const userId = 'user_123'

  // API Status Data
  const [apiStatus, setApiStatus] = useState({
    webhookStatus: 'UP',
    metaApiStatus: 'UP',
    apiResponseTime: '127ms',
    successRate: '99.9%',
    lastSyncTime: 'Today, 10:42 AM',
    rateLimit: '85%',
    activeConnections: '1,234'
  })

  useEffect(() => {
    fetchStatus()
    fetchOnboardingData()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await api.get(`/integration/${userId}/`)
      setStatus(response.data)
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  const fetchOnboardingData = async () => {
    try {
      const response = await api.get('/onboarding-current/')
      if (response.data.success) {
        setOnboardingData(response.data)
        const fullNumber = `${response.data.country_code}${response.data.whatsapp_number}`
        setTestNumber(fullNumber)
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error)
    }
  }

  const updateStatus = async (newStatus) => {
    setLoading(true)
    setMode(newStatus)
    try {
      await api.post(`/integration/${userId}/update/`, { status: newStatus })
      await fetchStatus()
    } catch (error) {
      console.error('Error updating status:', error)
    }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendTestMessage = async () => {
    if (!testNumber) {
      alert('Please enter a phone number')
      return
    }
    setSending(true)
    try {
      await api.post('/send-test-message/', { 
        phone: testNumber, 
        message: testMessage || 'Hello! This is a test message from WhatsApp CRM.'
      })
      alert('Test message sent successfully!')
      setTestMessage('')
    } catch (error) {
      alert('Failed to send test message')
    }
    setSending(false)
  }

  const getContactNumber = () => {
    if (onboardingData) {
      return `${onboardingData.country_code || '+91'} ${onboardingData.whatsapp_number || ''}`
    }
    return '+91 9876543210'
  }

  const getBusinessName = () => {
    if (onboardingData) {
      return onboardingData.company_name || 'Business Name'
    }
    return 'Acme Corp Ltd.'
  }

  const getObjectives = () => {
    if (onboardingData && onboardingData.objectives) {
      return onboardingData.objectives
    }
    return []
  }

  // API Status Modal Component
  const ApiStatusModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">API Connection Status</h2>
              <button 
                onClick={() => setShowApiStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5">
            {/* Webhook Status */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Webhook Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-600 font-medium">{apiStatus.webhookStatus}</span>
              </div>
            </div>

            {/* Meta Graph API */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Meta Graph API</span>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-600 font-medium">{apiStatus.metaApiStatus}</span>
              </div>
            </div>

            {/* API Response Time */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">API Response Time</span>
              <span className="text-gray-700 font-medium">{apiStatus.apiResponseTime}</span>
            </div>

            {/* Success Rate */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Success Rate</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">{apiStatus.successRate}</span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Rate Limit Usage */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Rate Limit Usage</span>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">{apiStatus.rateLimit}</span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Active Connections */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Active Connections</span>
              <span className="text-gray-700 font-medium">{apiStatus.activeConnections}</span>
            </div>

            {/* Last Sync Time */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Last Sync Time</span>
              <span className="text-gray-700">{apiStatus.lastSyncTime}</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">📡</span>
                <span className="text-xs text-gray-500">All systems operational</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <button 
                onClick={() => setShowApiStatusModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WhatsApp Integration</h1>
        <p className="text-gray-500 mt-1">Manage your WhatsApp Business API Connection & Setting</p>
      </div>

      {/* DEV MODE Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">DEV MODE - TOGGLE STATE</span>
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => updateStatus('connected')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'connected' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Connected
            </button>
            <button
              onClick={() => updateStatus('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'pending' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => updateStatus('failed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'failed' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Failed
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && mode === 'connected' && status && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <h3 className="font-semibold text-green-800">WhatsApp API Connected</h3>
                <p className="text-green-700 text-sm mt-1">
                  Your WhatsApp API is now live. You can start sending test messages and configuring flows.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Contacted Number</span>
                  <span>{getContactNumber()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Display Name (Meta Verified)</span>
                  <span>{getBusinessName()}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Verification Status</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">WABA ID</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm">{status.waba_id || 'WABA' + Math.floor(Math.random() * 1000000)}</code>
                    <button onClick={() => copyToClipboard(status.waba_id || 'WABA123456')} className="text-blue-600 hover:text-blue-700">
                      📋
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {copied && <div className="text-green-600 text-sm text-center mt-4">Copied!</div>}
          </div>

          {/* Need Help Link */}
          <div className="mb-6">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Need help? Learn how WhatsApp campaign work in Leadbug →
            </a>
          </div>

          {/* Objectives Section */}
          {getObjectives().length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Objectives</h3>
              <div className="flex flex-wrap gap-2">
                {getObjectives().map((obj, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {obj.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setShowApiStatusModal(true)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            View API Status
          </button>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border rounded-lg text-sm">
              <option>{onboardingData?.country_code || '+91'}</option>
              <option>+1</option>
              <option>+44</option>
            </select>
            <input
              type="tel"
              placeholder={onboardingData?.whatsapp_number || '70224589478'}
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-40"
            />
            <input
              type="text"
              placeholder="Message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-48"
            />
            <button
              onClick={sendTestMessage}
              disabled={sending}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              Send Test Message
            </button>
          </div>
        </div>
      </div>

      {/* Next Steps & Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
          <p className="text-sm text-gray-500">Create Message Templates</p>
          <p className="text-xs text-gray-400 mt-1">WhatsApp requires pre-approved for outbound marketing</p>
          <button 
            onClick={() => window.location.href = '/templates'}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Create Template →
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Activity Overview</h3>
            <select className="text-sm border rounded-lg px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-24 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            No activity yet. Send a test message to get started!
          </div>
        </div>
      </div>

      {/* Integration Info */}
      {onboardingData && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-medium">Your WhatsApp Business is connected!</span><br />
            Business: {onboardingData.company_name}<br />
            Contact: {onboardingData.business_email}<br />
            Number: {onboardingData.country_code} {onboardingData.whatsapp_number}
          </p>
        </div>
      )}

      {/* API Status Modal */}
      {showApiStatusModal && <ApiStatusModal />}
    </div>
  )
}

export default IntegrationStatus