


import React, { useState } from 'react'

const Step3 = ({ data, updateData, onNext, onBack }) => {
  const [warning, setWarning] = useState('')
  
  const objectives = [
    { id: 'leads', label: 'Generate High-intent Leads', icon: '🎯' },
    { id: 'whatsapp_ads', label: 'Click to WhatsApp Ads', icon: '📱' },
    { id: 'quality_leads', label: 'Quality Ad Leads', icon: '⭐' },
    { id: 'whatsapp_forms', label: 'WhatsApp Forms', icon: '📋' },
    { id: 'retarget', label: 'Re-target Qualified Leads in Bulk', icon: '🔄' },
    { id: 'bulk_campaigns', label: 'WhatsApp Bulk Campaigns', icon: '📢' },
    { id: 'followup', label: 'Automate Regular Follow-up on Leads', icon: '🤖' },
    { id: 'notifications', label: 'WhatsApp Automated Notification', icon: '🔔' },
    { id: 'others', label: 'Others Reasons', icon: '💡' }
  ]

  const toggleObjective = (objectiveId) => {
    let newObjectives = [...data.objectives]
    if (newObjectives.includes(objectiveId)) {
      newObjectives = newObjectives.filter(id => id !== objectiveId)
      setWarning('')
    } else {
      if (newObjectives.length >= 3) {
        setWarning('You can only select up to 3 objectives')
        return
      }
      newObjectives.push(objectiveId)
      setWarning('')
    }
    updateData({ objectives: newObjectives })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What would you like to use Leadbug for?</h2>
      <p className="text-gray-500 mb-6">Choose upto 3 Objectives & we will help you achieves the super quick!</p>
      
      {warning && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">⚠️ {warning}</div>}
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {objectives.map(obj => (
          <button key={obj.id} onClick={() => toggleObjective(obj.id)} className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${data.objectives.includes(obj.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">{obj.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{obj.label}</div>
              </div>
              {data.objectives.includes(obj.id) && <span className="text-blue-600 text-xl">✓</span>}
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-400 mt-4 mb-4">Step 3 of 4</div>
      
      <div className="flex space-x-3">
        <button onClick={onBack} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Back</button>
        <button onClick={onNext} disabled={data.objectives.length === 0} className={`flex-1 py-2 rounded-lg font-medium ${data.objectives.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Next</button>
      </div>
    </div>
  )
}

export default Step3