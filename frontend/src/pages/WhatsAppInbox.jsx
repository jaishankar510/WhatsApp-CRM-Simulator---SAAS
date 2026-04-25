import React, { useState, useEffect } from 'react'
import api from '../api/client'

const WhatsAppInbox = () => {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(() => {
      if (selectedChat) fetchMessages(selectedChat.id)
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedChat])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await api.get('/contacts/')
      const contacts = response.data.contacts || []
      const convos = contacts.map(contact => ({
        id: contact.contact_id,
        name: contact.name,
        phone: contact.phone,
        lastMessage: contact.last_message || 'No messages yet',
        time: contact.last_message_time || 'Just now',
        unread: Math.floor(Math.random() * 3),
        avatar: contact.name?.charAt(0).toUpperCase() || 'U'
      }))
      setConversations(convos)
    } catch (error) {
      setConversations([
        { id: '1', name: 'John Doe', phone: '+919876543210', lastMessage: 'Hey, how are you?', time: '10:30 AM', unread: 2, avatar: 'J' },
        { id: '2', name: 'Jane Smith', phone: '+919887766554', lastMessage: 'Thank you!', time: '9:45 AM', unread: 0, avatar: 'J' },
        { id: '3', name: 'Mike Johnson', phone: '+919998887777', lastMessage: 'When will you deliver?', time: 'Yesterday', unread: 1, avatar: 'M' },
      ])
    }
    setLoading(false)
  }

  const fetchMessages = async (chatId) => {
    const contact = conversations.find(c => c.id === chatId)
    if (contact) {
      setMessages([
        { id: 1, text: contact.lastMessage, sender: 'them', time: '10:30 AM', status: 'read' },
        { id: 2, text: 'Hello! How can I help you today?', sender: 'me', time: '10:32 AM', status: 'read' },
      ])
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return

    setSending(true)
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }
    setMessages([...messages, newMsg])
    const messageToSend = newMessage
    setNewMessage('')

    try {
      await api.post('/send-whatsapp/', { to_number: selectedChat.phone, message: messageToSend })
      const updatedConvos = conversations.map(c => c.id === selectedChat.id ? { ...c, lastMessage: messageToSend, time: 'Just now' } : c)
      setConversations(updatedConvos)
    } catch (error) {
      console.error('Error sending message:', error)
    }
    setSending(false)
  }

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Left Sidebar - Conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Chats</h2>
          <div className="relative mt-2">
            <input type="text" placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No conversations found</div>
          ) : (
            filteredConversations.map(chat => (
              <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">{chat.avatar}</div>
                  {chat.unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{chat.unread}</span>}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center"><p className="font-medium text-gray-900">{chat.name}</p><span className="text-xs text-gray-400">{chat.time}</span></div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-gray-400">{chat.phone}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-4">💬</div><p className="text-gray-500">Select a conversation to start messaging</p></div></div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">{selectedChat.avatar}</div>
                <div className="ml-3"><p className="font-semibold text-gray-900">{selectedChat.name}</p><p className="text-xs text-gray-500">{selectedChat.phone}</p></div>
              </div>
              <div className="flex space-x-2"><button className="p-2 hover:bg-gray-100 rounded-lg">📞</button><button className="p-2 hover:bg-gray-100 rounded-lg">ℹ️</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'} flex items-center justify-end space-x-1`}>
                      <span>{msg.time}</span>
                      {msg.sender === 'me' && <span>{msg.status === 'read' ? '✓✓' : '✓'}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={sendMessage} disabled={!newMessage.trim() || sending} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50">➤</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WhatsAppInbox