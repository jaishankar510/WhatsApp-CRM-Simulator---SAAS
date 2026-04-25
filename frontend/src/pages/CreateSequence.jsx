import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const CreateSequence = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [contacts, setContacts] = useState([])
  const [templates, setTemplates] = useState([])
  const [whatsappNumbers, setWhatsappNumbers] = useState([])
  
  const [sequenceData, setSequenceData] = useState({
    name: '',
    type: 'one-time',
    retries_enabled: false,
    category: '',
    whatsapp_number: '',
    selected_templates: [],
    recipients: [],
    schedule_type: 'immediate',
    schedule_date: '',
    schedule_time: '',
    fallback_channel: 'whatsapp'
  })

  useEffect(() => {
    fetchContacts()
    fetchTemplates()
    fetchWhatsappNumbers()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts/')
      setContacts(response.data.contacts || [])
    } catch (error) {
      setContacts([
        { contact_id: '1', name: 'John Doe', phone: '+919876543210', email: 'john@example.com' },
        { contact_id: '2', name: 'Jane Smith', phone: '+919887766554', email: 'jane@example.com' },
      ])
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates/')
      setTemplates(response.data || [])
    } catch (error) {
      setTemplates([
        { template_id: '1', name: 'Welcome Template', body: 'Hello {{name}}, welcome to our service!', status: 'approved' },
        { template_id: '2', name: 'Order Confirmation', body: 'Your order #{{order_id}} has been confirmed!', status: 'approved' },
      ])
    }
  }

  const fetchWhatsappNumbers = async () => {
    try {
      const response = await api.get('/onboarding-current/')
      if (response.data.success) {
        const number = `${response.data.country_code} ${response.data.whatsapp_number}`
        setWhatsappNumbers([{ id: '1', number: number, name: response.data.company_name }])
        setSequenceData(prev => ({ ...prev, whatsapp_number: number }))
      }
    } catch (error) {
      setWhatsappNumbers([{ id: '1', number: '+91 9876543210', name: 'Default Business' }])
    }
  }

  const updateSequenceData = (data) => setSequenceData(prev => ({ ...prev, ...data }))

  const toggleTemplate = (template) => {
    const exists = sequenceData.selected_templates.find(t => t.template_id === template.template_id)
    if (exists) {
      updateSequenceData({ selected_templates: sequenceData.selected_templates.filter(t => t.template_id !== template.template_id) })
    } else {
      updateSequenceData({ selected_templates: [...sequenceData.selected_templates, { ...template, day: sequenceData.selected_templates.length + 1, time: '09:00' }] })
    }
  }

  const toggleRecipient = (contactId) => {
    if (sequenceData.recipients.includes(contactId)) {
      updateSequenceData({ recipients: sequenceData.recipients.filter(id => id !== contactId) })
    } else {
      updateSequenceData({ recipients: [...sequenceData.recipients, contactId] })
    }
  }

  const selectAllRecipients = () => {
    if (sequenceData.recipients.length === contacts.length) {
      updateSequenceData({ recipients: [] })
    } else {
      updateSequenceData({ recipients: contacts.map(c => c.contact_id) })
    }
  }

  const handleSubmit = async () => {
    if (!sequenceData.name) { alert('Please enter sequence name'); return }
    if (sequenceData.selected_templates.length === 0) { alert('Please select at least one template'); return }
    if (sequenceData.recipients.length === 0) { alert('Please select at least one recipient'); return }
    try {
      await api.post('/sequences/create/', sequenceData)
      alert('Sequence created successfully!')
      navigate('/sequences')
    } catch (error) {
      alert('Failed to create sequence')
    }
  }

  const steps = ['Details', 'Templates', 'Recipients', 'Schedule']

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-semibold ${currentStep > index + 1 ? 'bg-green-500 text-white' : currentStep === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <div className="text-sm mt-2 font-medium">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Sequence Details</h2>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Sequence Name *</label><input type="text" value={sequenceData.name} onChange={(e) => updateSequenceData({ name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Welcome Sequence" /></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Sequence Type *</label><div className="grid grid-cols-2 gap-4"><div className={`border rounded-lg p-4 cursor-pointer ${sequenceData.type === 'one-time' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => updateSequenceData({ type: 'one-time' })}><div className="flex items-center space-x-3"><input type="radio" checked={sequenceData.type === 'one-time'} onChange={() => updateSequenceData({ type: 'one-time' })} /><div><h3 className="font-semibold">One-Time Sequence</h3><p className="text-xs text-gray-500">Send once to selected recipients</p></div></div></div><div className={`border rounded-lg p-4 cursor-pointer ${sequenceData.type === 'ongoing' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => updateSequenceData({ type: 'ongoing' })}><div className="flex items-center space-x-3"><input type="radio" checked={sequenceData.type === 'ongoing'} onChange={() => updateSequenceData({ type: 'ongoing' })} /><div><h3 className="font-semibold">Ongoing Sequence</h3><p className="text-xs text-gray-500">Continuous automation for new contacts</p></div></div></div></div></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label><select value={sequenceData.whatsapp_number} onChange={(e) => updateSequenceData({ whatsapp_number: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="">Select WhatsApp number</option>{whatsappNumbers.map(wn => (<option key={wn.id} value={wn.number}>{wn.number} - {wn.name}</option>))}</select></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={sequenceData.category} onChange={(e) => updateSequenceData({ category: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="">Select Category</option><option value="Onboarding">Onboarding</option><option value="Sales">Sales</option><option value="Retention">Retention</option><option value="Promotional">Promotional</option></select></div>
          <div className="mb-6"><label className="flex items-center space-x-2"><input type="checkbox" checked={sequenceData.retries_enabled} onChange={(e) => updateSequenceData({ retries_enabled: e.target.checked })} /><span>Enable Retries for failed messages</span></label>{sequenceData.retries_enabled && <div className="ml-6 mt-2 text-sm text-gray-500">• Retry up to 3 times • 5 minutes interval</div>}</div>
          <div className="flex justify-end"><button onClick={() => setCurrentStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next →</button></div>
        </div>
      )}

      {/* Step 2: Templates */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Select Templates</h2>
          <p className="text-gray-500 text-sm mb-4">Choose templates for your sequence (can select multiple)</p>
          <div className="grid grid-cols-1 gap-3 mb-6 max-h-96 overflow-y-auto">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500"><p>No templates found.</p><button onClick={() => window.location.href = '/templates'} className="mt-2 text-blue-600 text-sm">Create Template →</button></div>
            ) : (
              templates.map(template => (
                <div key={template.template_id} className={`border rounded-lg p-4 cursor-pointer ${sequenceData.selected_templates.find(t => t.template_id === template.template_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => toggleTemplate(template)}>
                  <div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center space-x-2"><input type="checkbox" checked={!!sequenceData.selected_templates.find(t => t.template_id === template.template_id)} onChange={() => toggleTemplate(template)} /><span className="font-semibold">{template.name}</span><span className={`text-xs px-2 py-0.5 rounded-full ${template.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{template.status}</span></div><p className="text-sm text-gray-600 mt-1 ml-6">{template.body?.substring(0, 100)}...</p></div></div>
                </div>
              ))
            )}
          </div>
          {sequenceData.selected_templates.length > 0 && (<div className="mb-6 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2">Selected Templates ({sequenceData.selected_templates.length})</h3>{sequenceData.selected_templates.map((t, idx) => (<div key={t.template_id} className="flex items-center justify-between text-sm py-1"><span>{idx + 1}. {t.name}</span><div className="flex space-x-2"><span className="text-gray-500">Day: {t.day || idx + 1}</span><span className="text-gray-500">Time: {t.time || '09:00'}</span></div></div>))}</div>)}
          <div className="flex justify-between"><button onClick={() => setCurrentStep(1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">← Back</button><button onClick={() => setCurrentStep(3)} disabled={sequenceData.selected_templates.length === 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">Next →</button></div>
        </div>
      )}

      {/* Step 3: Recipients */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Select Recipients</h2>
          <p className="text-gray-500 text-sm mb-4">Choose contacts to receive this sequence</p>
          <div className="mb-4 flex justify-between items-center"><button onClick={selectAllRecipients} className="text-sm text-blue-600 hover:underline">{sequenceData.recipients.length === contacts.length ? 'Deselect All' : 'Select All'}</button><span className="text-sm text-gray-500">{sequenceData.recipients.length} contacts selected</span></div>
          <div className="border rounded-lg max-h-96 overflow-y-auto mb-6">
            {contacts.length === 0 ? (<div className="text-center py-8 text-gray-500"><p>No contacts found.</p><button onClick={() => window.location.href = '/contacts'} className="mt-2 text-blue-600 text-sm">Add Contact →</button></div>) : (contacts.map(contact => (<label key={contact.contact_id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b"><input type="checkbox" checked={sequenceData.recipients.includes(contact.contact_id)} onChange={() => toggleRecipient(contact.contact_id)} className="mr-3" /><div><p className="font-medium">{contact.name}</p><p className="text-sm text-gray-500">{contact.phone}</p></div></label>)))}
          </div>
          <div className="flex justify-between"><button onClick={() => setCurrentStep(2)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">← Back</button><button onClick={() => setCurrentStep(4)} disabled={sequenceData.recipients.length === 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">Next →</button></div>
        </div>
      )}

      {/* Step 4: Schedule */}
      {currentStep === 4 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Schedule Settings</h2>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label><div className="grid grid-cols-2 gap-4"><div className={`border rounded-lg p-4 cursor-pointer ${sequenceData.schedule_type === 'immediate' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => updateSequenceData({ schedule_type: 'immediate' })}><div className="flex items-center space-x-2"><input type="radio" checked={sequenceData.schedule_type === 'immediate'} onChange={() => updateSequenceData({ schedule_type: 'immediate' })} /><span>Immediate</span></div><p className="text-xs text-gray-500 mt-1 ml-5">Start immediately after creation</p></div><div className={`border rounded-lg p-4 cursor-pointer ${sequenceData.schedule_type === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => updateSequenceData({ schedule_type: 'scheduled' })}><div className="flex items-center space-x-2"><input type="radio" checked={sequenceData.schedule_type === 'scheduled'} onChange={() => updateSequenceData({ schedule_type: 'scheduled' })} /><span>Schedule for later</span></div><p className="text-xs text-gray-500 mt-1 ml-5">Choose date and time</p></div></div></div>
          {sequenceData.schedule_type === 'scheduled' && (<div className="mb-6 grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={sequenceData.schedule_date} onChange={(e) => updateSequenceData({ schedule_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" value={sequenceData.schedule_time} onChange={(e) => updateSequenceData({ schedule_time: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>)}
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Fallback Channel</label><div className="flex space-x-4"><label className="flex items-center space-x-2"><input type="radio" value="whatsapp" checked={sequenceData.fallback_channel === 'whatsapp'} onChange={(e) => updateSequenceData({ fallback_channel: e.target.value })} /><span>WhatsApp</span></label><label className="flex items-center space-x-2"><input type="radio" value="email" checked={sequenceData.fallback_channel === 'email'} onChange={(e) => updateSequenceData({ fallback_channel: e.target.value })} /><span>Email</span></label><label className="flex items-center space-x-2"><input type="radio" value="sms" checked={sequenceData.fallback_channel === 'sms'} onChange={(e) => updateSequenceData({ fallback_channel: e.target.value })} /><span>SMS</span></label></div></div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2">Sequence Summary</h3><div className="space-y-1 text-sm"><p><span className="text-gray-500">Name:</span> {sequenceData.name}</p><p><span className="text-gray-500">Type:</span> {sequenceData.type === 'one-time' ? 'One-Time' : 'Ongoing'}</p><p><span className="text-gray-500">WhatsApp Number:</span> {sequenceData.whatsapp_number}</p><p><span className="text-gray-500">Templates:</span> {sequenceData.selected_templates.length}</p><p><span className="text-gray-500">Recipients:</span> {sequenceData.recipients.length}</p><p><span className="text-gray-500">Schedule:</span> {sequenceData.schedule_type === 'immediate' ? 'Immediate' : `${sequenceData.schedule_date} at ${sequenceData.schedule_time}`}</p></div></div>
          <div className="flex justify-between"><button onClick={() => setCurrentStep(3)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">← Back</button><button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create Sequence</button></div>
        </div>
      )}
    </div>
  )
}

export default CreateSequence