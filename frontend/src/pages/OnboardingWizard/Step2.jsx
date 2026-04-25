import React, { useState, useEffect } from 'react'
import api from '../../api/client'

const Step2 = ({ data, updateData, onNext, onBack }) => {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  
  const industries = [
    { name: 'Marketing & Advertising', icon: '📢', color: 'bg-pink-100' },
    { name: 'Retail', icon: '🛍️', color: 'bg-purple-100' },
    { name: 'Education', icon: '📚', color: 'bg-blue-100' },
    { name: 'Finance', icon: '💰', color: 'bg-green-100' },
    { name: 'Entertainment, Social Media & Gaming', icon: '🎮', color: 'bg-orange-100' },
    { name: 'Healthcare', icon: '🏥', color: 'bg-red-100' },
    { name: 'Technology', icon: '💻', color: 'bg-indigo-100' },
    { name: 'Professional Services', icon: '⚖️', color: 'bg-gray-100' },
  ]

  useEffect(() => {
    if (data.industries.length === 1) {
      fetchSubcategories(data.industries[0])
    }
  }, [data.industries])

  const fetchSubcategories = async (industry) => {
    setLoading(true)
    try {
      const response = await api.get(`/subcategories/${encodeURIComponent(industry)}/`)
      setSubcategories(response.data)
    } catch (error) {
      setSubcategories(['General'])
    }
    setLoading(false)
  }

  const toggleIndustry = (industry) => {
    let newIndustries
    if (data.industries.includes(industry)) {
      newIndustries = data.industries.filter(i => i !== industry)
      if (data.industries.length === 1 && data.industries[0] === industry) {
        updateData({ subCategory: '' })
      }
    } else {
      newIndustries = [...data.industries, industry]
      fetchSubcategories(industry)
    }
    updateData({ industries: newIndustries })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Which Industry does your business belong to?</h2>
      <p className="text-gray-500 mb-6">Well accordingly personalizes your experiences</p>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {industries.map(industry => (
          <button key={industry.name} onClick={() => toggleIndustry(industry.name)} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${data.industries.includes(industry.name) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
            <span className="text-2xl">{industry.icon}</span>
            <span className="text-sm font-medium text-left">{industry.name}</span>
            {data.industries.includes(industry.name) && <span className="ml-auto text-blue-600">✓</span>}
          </button>
        ))}
      </div>
      
      {data.industries.length === 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub - Category</label>
          {loading ? <div className="text-gray-500">Loading...</div> : (
            <select value={data.subCategory} onChange={(e) => updateData({ subCategory: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select a sub-category</option>
              {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          )}
        </div>
      )}
      
      <div className="text-center text-sm text-gray-400 mb-4">Step 2 of 4</div>
      
      <div className="flex space-x-3">
        <button onClick={onBack} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Back</button>
        <button onClick={onNext} disabled={data.industries.length === 0} className={`flex-1 py-2 rounded-lg font-medium ${data.industries.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Next</button>
      </div>
    </div>
  )
}

export default Step2