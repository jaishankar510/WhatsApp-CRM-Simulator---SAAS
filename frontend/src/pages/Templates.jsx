import React, { useState, useEffect } from 'react'
import api from '../api/client'

const Templates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    header: '',
    body: '',
    footer: '',
    status: 'draft'
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await api.get('/templates/')
      setTemplates(response.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    }
    setLoading(false)
  }

  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.body) {
      alert('Please enter template name and body')
      return
    }
    try {
      await api.post('/templates/create/', newTemplate)
      setShowModal(false)
      setNewTemplate({ name: '', header: '', body: '', footer: '', status: 'draft' })
      fetchTemplates()
      alert('Template created successfully!')
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template')
    }
  }

  const deleteTemplate = async (templateId) => {
    if (window.confirm('Delete this template?')) {
      try {
        await api.delete(`/templates/${templateId}/delete/`)
        fetchTemplates()
      } catch (error) {
        console.error('Error deleting template:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Message Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage reusable message templates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Create Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">No templates yet</p>
            <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Create your first template</button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {templates.map(template => (
                <tr key={template.template_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{template.name}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-md truncate">{template.body?.substring(0, 80)}...</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(template.status)}`}>
                      {template.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{template.created_by || 'Admin'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteTemplate(template.template_id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Message Template</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Template Name *" value={newTemplate.name} onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Header (Optional)" value={newTemplate.header} onChange={(e) => setNewTemplate({...newTemplate, header: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <textarea placeholder="Body * (Use {{variable}} for dynamic content)" rows={5} value={newTemplate.body} onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Footer (Optional)" value={newTemplate.footer} onChange={(e) => setNewTemplate({...newTemplate, footer: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <select value={newTemplate.status} onChange={(e) => setNewTemplate({...newTemplate, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div className="bg-white p-3 rounded border">
                    {newTemplate.header && <div className="font-bold text-blue-600 mb-2">{newTemplate.header}</div>}
                    <div className="text-gray-800 whitespace-pre-wrap">{newTemplate.body || 'Your message will appear here...'}</div>
                    {newTemplate.footer && <div className="text-xs text-gray-500 mt-2">{newTemplate.footer}</div>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={createTemplate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates