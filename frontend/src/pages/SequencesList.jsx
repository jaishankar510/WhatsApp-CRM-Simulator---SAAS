
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const SequencesList = () => {
  const navigate = useNavigate()
  const [sequences, setSequences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSequences()
  }, [])

  const fetchSequences = async () => {
    setLoading(true)
    try {
      const response = await api.get('/sequences/')
      setSequences(response.data || [])
    } catch (error) {
      console.error('Error fetching sequences:', error)
      setSequences([
        { sequence_id: '1', name: 'Welcome Sequence', type: 'one-time', status: 'active', active: true, category: 'Onboarding', created_by: 'Admin', created_at: new Date().toISOString(), whatsapp_number: '+91 9876543210' },
        { sequence_id: '2', name: 'Abandoned Cart', type: 'ongoing', status: 'draft', active: false, category: 'Sales', created_by: 'Marketing', created_at: new Date().toISOString(), whatsapp_number: '+91 9876543210' },
      ])
    }
    setLoading(false)
  }

  const deleteSequence = async (sequenceId) => {
    if (window.confirm('Delete this sequence?')) {
      try {
        await api.delete(`/sequences/${sequenceId}/delete/`)
        fetchSequences()
        alert('Sequence deleted successfully!')
      } catch (error) { 
        console.error(error) 
      }
    }
  }

  const getTypeBadge = (type) => {
    return type === 'one-time' 
      ? 'bg-purple-100 text-purple-700' 
      : 'bg-orange-100 text-orange-700'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Sequences</h1>
          <p className="text-gray-500 mt-1">Create automated message sequences for your customers</p>
        </div>
        <button 
          onClick={() => navigate('/sequences/create')} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Sequence
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sequences.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500">No sequences yet</p>
            <button 
              onClick={() => navigate('/sequences/create')} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create your first sequence
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sequences.map((seq) => (
                  <tr key={seq.sequence_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{seq.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadge(seq.type)}`}>
                        {seq.type === 'one-time' ? 'One-Time' : 'Ongoing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{seq.whatsapp_number || '+919876543210'}</td>
                    <td className="px-6 py-4">{seq.category || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${seq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {seq.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => deleteSequence(seq.sequence_id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SequencesList