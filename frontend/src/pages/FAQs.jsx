import React, { useState, useEffect } from 'react'
import api from '../api/client'

const FAQs = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' })

  useEffect(() => { fetchFaqs() }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const response = await api.get('/faqs/')
      setFaqs(response.data.faqs || [])
    } catch (error) { setFaqs([]) }
    setLoading(false)
  }

  const createFaq = async () => {
    if (!newFaq.question || !newFaq.answer) { alert('Please enter question and answer'); return }
    try {
      await api.post('/faqs/create/', newFaq)
      setShowModal(false)
      setNewFaq({ question: '', answer: '', category: 'General' })
      fetchFaqs()
      alert('FAQ created!')
    } catch (error) { alert('Failed to create FAQ') }
  }

  const deleteFaq = async (faqId) => {
    if (window.confirm('Delete this FAQ?')) {
      try { await api.delete(`/faqs/${faqId}/delete/`); fetchFaqs() } catch (error) {}
    }
  }

  const filteredFaqs = faqs.filter(f => f.question?.toLowerCase().includes(searchTerm.toLowerCase()) || f.answer?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">FAQs</h1><p className="text-gray-500 mt-1">Frequently Asked Questions for your customers</p></div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add FAQ</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative"><input type="text" placeholder="Search FAQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /><span className="absolute left-3 top-2.5 text-gray-400">🔍</span></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        : filteredFaqs.length === 0 ? <div className="text-center py-12"><div className="text-6xl mb-4">❓</div><p className="text-gray-500">No FAQs found</p><button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Add your first FAQ</button></div>
        : <div className="divide-y divide-gray-200">{filteredFaqs.map(faq => (<div key={faq.faq_id} className="p-5 hover:bg-gray-50"><div className="flex justify-between items-start"><div className="flex-1"><div className="flex items-center space-x-2 mb-2"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{faq.category}</span></div><h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3><p className="text-gray-600">{faq.answer}</p></div><button onClick={() => deleteFaq(faq.faq_id)} className="text-red-600 hover:text-red-800 ml-4">Delete</button></div></div>))}</div>}
      </div>

      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl max-w-2xl w-full p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add FAQ</h2><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button></div><div className="space-y-4"><input type="text" placeholder="Question" value={newFaq.question} onChange={(e) => setNewFaq({...newFaq, question: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><textarea placeholder="Answer" rows={4} value={newFaq.answer} onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><select value={newFaq.category} onChange={(e) => setNewFaq({...newFaq, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="General">General</option><option value="Technical">Technical</option><option value="Billing">Billing</option><option value="Support">Support</option></select></div><div className="flex justify-end space-x-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={createFaq} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create FAQ</button></div></div></div>)}
    </div>
  )
}

export default FAQs