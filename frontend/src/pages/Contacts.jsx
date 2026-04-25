import React, { useState, useEffect } from 'react'
import api from '../api/client'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', company: '' })

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/contacts/')
      setContacts(response.data.contacts || [])
    } catch (error) { setContacts([]) }
    setLoading(false)
  }

  const createContact = async () => {
    if (!newContact.name || !newContact.phone) { alert('Please enter name and phone'); return }
    try {
      await api.post('/contacts/create/', newContact)
      setShowModal(false)
      setNewContact({ name: '', phone: '', email: '', company: '' })
      fetchContacts()
      alert('Contact created!')
    } catch (error) { alert('Failed to create contact') }
  }

  const deleteContact = async (contactId) => {
    if (window.confirm('Delete this contact?')) {
      try { await api.delete(`/contacts/${contactId}/delete/`); fetchContacts() } catch (error) { console.error(error) }
    }
  }

  const filteredContacts = contacts.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Contacts</h1><p className="text-gray-500 mt-1">Manage your WhatsApp contacts</p></div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Contact</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative"><input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /><span className="absolute left-3 top-2.5 text-gray-400">🔍</span></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        : filteredContacts.length === 0 ? <div className="text-center py-12"><div className="text-6xl mb-4">👥</div><p className="text-gray-500">No contacts found</p><button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Add your first contact</button></div>
        : <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{filteredContacts.map(contact => (<tr key={contact.contact_id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{contact.name}</td><td className="px-6 py-4 text-gray-600">{contact.phone}</td><td className="px-6 py-4 text-gray-600">{contact.email || '-'}</td><td className="px-6 py-4 text-gray-600">{contact.company || '-'}</td><td className="px-6 py-4"><button onClick={() => deleteContact(contact.contact_id)} className="text-red-600 hover:text-red-800">Delete</button></td></tr>))}</tbody></table>}
      </div>

      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl max-w-md w-full p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add Contact</h2><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button></div><div className="space-y-4"><input type="text" placeholder="Full Name *" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><input type="tel" placeholder="Phone Number *" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><input type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({...newContact, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><input type="text" placeholder="Company" value={newContact.company} onChange={(e) => setNewContact({...newContact, company: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div className="flex justify-end space-x-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={createContact} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Contact</button></div></div></div>)}
    </div>
  )
}

export default Contacts