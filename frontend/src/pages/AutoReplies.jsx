import React, { useState, useEffect } from 'react'
import api from '../api/client'

const AutoReplies = () => {
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newReply, setNewReply] = useState({ keyword: '', response: '', status: 'active' })

  useEffect(() => { fetchReplies() }, [])

  const fetchReplies = async () => {
    setLoading(true)
    try {
      const response = await api.get('/auto-replies/')
      setReplies(response.data.replies || [])
    } catch (error) { setReplies([]) }
    setLoading(false)
  }

  const createReply = async () => {
    if (!newReply.keyword || !newReply.response) { alert('Please enter keyword and response'); return }
    try {
      await api.post('/auto-replies/create/', newReply)
      setShowModal(false)
      setNewReply({ keyword: '', response: '', status: 'active' })
      fetchReplies()
      alert('Auto-reply created!')
    } catch (error) { alert('Failed to create auto-reply') }
  }

  const deleteReply = async (replyId) => {
    if (window.confirm('Delete this auto-reply?')) {
      try { await api.delete(`/auto-replies/${replyId}/delete/`); fetchReplies() } catch (error) {}
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Auto-Replies</h1><p className="text-gray-500 mt-1">Set up automatic responses for common keywords</p></div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Auto-Reply</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        : replies.length === 0 ? <div className="text-center py-12"><div className="text-6xl mb-4">🤖</div><p className="text-gray-500">No auto-replies configured</p><button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Create your first auto-reply</button></div>
        : <div className="divide-y divide-gray-200">{replies.map(reply => (<div key={reply.reply_id} className="p-5 hover:bg-gray-50"><div className="flex justify-between items-start"><div className="flex-1"><div className="flex items-center space-x-2 mb-2"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Keyword: {reply.keyword}</span><span className={`px-2 py-1 text-xs rounded-full ${reply.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{reply.status}</span></div><p className="text-gray-700">{reply.response}</p></div><button onClick={() => deleteReply(reply.reply_id)} className="text-red-600 hover:text-red-800">Delete</button></div></div>))}</div>}
      </div>

      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl max-w-md w-full p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add Auto-Reply</h2><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button></div><div className="space-y-4"><input type="text" placeholder="Trigger Keyword (e.g., hello, price)" value={newReply.keyword} onChange={(e) => setNewReply({...newReply, keyword: e.target.value.toLowerCase()})} className="w-full px-3 py-2 border rounded-lg" /><textarea placeholder="Auto-Reply Message" rows={4} value={newReply.response} onChange={(e) => setNewReply({...newReply, response: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><select value={newReply.status} onChange={(e) => setNewReply({...newReply, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="flex justify-end space-x-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={createReply} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button></div></div></div>)}
    </div>
  )
}

export default AutoReplies