

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TopBar = ({ credits, user, onLogout }) => {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    // Clear all storage
    sessionStorage.clear()
    localStorage.clear()
    
    // Call parent logout handler
    if (onLogout) onLogout()
    
    // Redirect to landing page
    navigate('/')
    
    // Reload to reset all states
    window.location.reload()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</button>
          <button className="text-gray-700 hover:text-blue-600 transition-colors">Tutorial</button>
          <button className="text-gray-700 hover:text-blue-600 transition-colors">Help</button>
          <button className="text-gray-700 hover:text-blue-600 transition-colors">Billing & Payments</button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <span className="text-green-600">💰</span>
            <span className="font-semibold text-green-700">{credits} Credits</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none">
              <span className="text-xl">👤</span>
              <span>{user?.name || 'My Profile'}</span>
              <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Demo User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'demo@whatsappcrm.com'}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <span className="mr-2">👤</span> Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <span className="mr-2">🔑</span> Change Password
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <span className="mr-2">🎁</span> Refer & Earn
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <span className="mr-2">🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="text-gray-700 hover:text-blue-600 transition-colors relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar