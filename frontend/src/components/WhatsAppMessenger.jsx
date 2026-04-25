
import React, { useState, useEffect } from 'react'
import api from '../api/client'

const WhatsAppMessenger = () => {
  const [contacts, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState([])
  const [message, setMessage] = useState('')
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [bulkMode, setBulkMode] = useState(false)

  useEffect(() => {
    fetchContacts()
    fetchTemplates()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts/')
      setContacts(response.data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates/')
      setTemplates(response.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.template_id === templateId)
    if (template) {
      setMessage(template.body)
      setSelectedTemplate(templateId)
    }
  }

  const toggleContact = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId))
    } else {
      setSelectedContacts([...selectedContacts, contactId])
    }
  }

  const handleSendSingle = async () => {
    if (!selectedContacts.length || !message) {
      alert('Please select a contact and enter a message')
      return
    }

    const contact = contacts.find(c => c.id === selectedContacts[0])
    if (!contact) return

    setSending(true)
    try {
      const response = await api.post('/send-whatsapp/', {
        to_number: contact.phone,
        message: message
      })
      setResult({ success: response.data.success, message: response.data.message })
      setTimeout(() => setResult(null), 3000)
    } catch (error) {
      setResult({ success: false, message: 'Failed to send message' })
    }
    setSending(false)
  }

  const handleSendBulk = async () => {
    if (!selectedContacts.length || !message) {
      alert('Please select contacts and enter a message')
      return
    }

    const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id))
    
    setSending(true)
    try {
      const response = await api.post('/send-bulk-whatsapp/', {
        contacts: selectedContactsData,
        message: message
      })
      setResult({ 
        success: true, 
        message: `Sent to ${response.data.sent} of ${response.data.total} contacts` 
      })
      setTimeout(() => setResult(null), 3000)
    } catch (error) {
      setResult({ success: false, message: 'Failed to send messages' })
    }
    setSending(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold flex items-center">
          <span className="text-2xl mr-2">💬</span> 
          WhatsApp Messenger
        </h2>
        <p className="text-gray-500 text-sm mt-1">Send WhatsApp messages to your contacts</p>
      </div>

      <div className="p-6">
        {/* Mode Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setBulkMode(false)}
            className={`px-4 py-2 rounded-lg ${!bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Single Message
          </button>
          <button
            onClick={() => setBulkMode(true)}
            className={`px-4 py-2 rounded-lg ${bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Bulk Broadcast
          </button>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`mb-4 p-3 rounded-lg ${result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {result.message}
          </div>
        )}

        {/* Contacts Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Contacts {bulkMode ? '(Multiple)' : '(Single)'}
          </label>
          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No contacts found. Complete onboarding to add contacts.
              </div>
            ) : (
              contacts.map(contact => (
                <label
                  key={contact.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <input
                    type={bulkMode ? "checkbox" : "radio"}
                    name="contact"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContact(contact.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                    {contact.company && (
                      <div className="text-xs text-gray-400">{contact.company}</div>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Template (Optional)
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select a template --</option>
            {templates.map(template => (
              <option key={template.template_id} value={template.template_id}>
                {template.name} ({template.status})
              </option>
            ))}
          </select>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your message here... Use {{name}} for personalization"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Use {'{{name}}'} to personalize messages
          </p>
        </div>

        {/* Send Button */}
        <button
          onClick={bulkMode ? handleSendBulk : handleSendSingle}
          disabled={sending || selectedContacts.length === 0 || !message}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {sending ? 'Sending...' : bulkMode ? `Send to ${selectedContacts.length} Contacts` : 'Send Message'}
        </button>

        {/* Demo Info */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
          <p className="text-yellow-800">📱 Demo Mode Notice</p>
          <p className="text-yellow-700 text-xs mt-1">
            To send real WhatsApp messages, configure Twilio credentials in backend/whatsapp_service.py
          </p>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppMessenger