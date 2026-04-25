import React, { useState } from 'react'
import api from '../api/client'

const TestPanel = () => {
  const [testNumber, setTestNumber] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await api.post('/test/connection/')
      setConnectionStatus(response.data)
    } catch (error) {
      setConnectionStatus({ success: false, error: error.message })
    }
    setLoading(false)
  }

  const testSendMessage = async () => {
    if (!testNumber) {
      alert('Please enter a phone number')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.post('/test/send-whatsapp/', {
        to_number: testNumber,
        message: testMessage || 'Test message from WhatsApp CRM'
      })
      setTestResult(response.data)
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    }
    setLoading(false)
  }

  const testBulkSend = async () => {
    const numbers = prompt('Enter phone numbers separated by commas (e.g., +919876543210,+919887766554)')
    if (!numbers) return
    
    const numberList = numbers.split(',').map(n => n.trim())
    const msg = prompt('Enter message to send:', 'Bulk test message')
    
    setLoading(true)
    try {
      const response = await api.post('/test/send-bulk/', {
        numbers: numberList,
        message: msg || 'Bulk test message'
      })
      setTestResult(response.data)
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">🧪</span>
        WhatsApp Integration Test Panel
      </h2>

      {/* Connection Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">1. Test Connection</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test WhatsApp API Connection
        </button>
        
        {connectionStatus && (
          <div className={`mt-3 p-3 rounded ${connectionStatus.success ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <p className="font-medium">{connectionStatus.success ? '✓ Connection Successful' : '⚠ Demo Mode'}</p>
            <p className="text-sm mt-1">{connectionStatus.message}</p>
            {connectionStatus.instructions && (
              <div className="mt-2 text-xs">
                {Object.entries(connectionStatus.instructions).map(([key, value]) => (
                  <p key={key}>{key}: {value}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Single Message Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">2. Send Single Test Message</h3>
        <div className="space-y-3">
          <input
            type="tel"
            placeholder="Phone Number (e.g., +919876543210)"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Message (optional)"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button
            onClick={testSendMessage}
            disabled={loading || !testNumber}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Send Test Message
          </button>
        </div>
      </div>

      {/* Bulk Message Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">3. Send Bulk Test Messages</h3>
        <button
          onClick={testBulkSend}
          disabled={loading}
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Send Bulk Test Messages
        </button>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h4 className="font-semibold mb-2">Test Result</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Success:</strong> {testResult.success ? 'Yes' : 'No'}</p>
            {testResult.message && <p><strong>Message:</strong> {testResult.message}</p>}
            {testResult.to_number && <p><strong>Sent to:</strong> {testResult.to_number}</p>}
            {testResult.mode && <p><strong>Mode:</strong> {testResult.mode}</p>}
            {testResult.sent !== undefined && (
              <>
                <p><strong>Total:</strong> {testResult.total}</p>
                <p><strong>Sent:</strong> {testResult.sent}</p>
                <p><strong>Failed:</strong> {testResult.failed}</p>
              </>
            )}
            {testResult.error && <p className="text-red-600"><strong>Error:</strong> {testResult.error}</p>}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📖 How to Test</h4>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>1. Demo Mode (Current):</strong> Messages are simulated - no actual WhatsApp charges</p>
          <p><strong>2. Test OTP:</strong> OTP is displayed on screen - enter that number to verify</p>
          <p><strong>3. Real WhatsApp:</strong> Configure Twilio credentials in backend/whatsapp_service.py</p>
          <p><strong>4. Test Numbers:</strong> Use your own WhatsApp number for testing</p>
        </div>
      </div>
    </div>
  )
}

export default TestPanel