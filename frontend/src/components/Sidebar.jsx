

import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ collapsed, onToggle, onboardingComplete }) => {
  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/inbox', icon: '💬', label: 'Inbox' },
    { path: '/contacts', icon: '👥', label: 'Contacts' },
    { path: '/templates', icon: '📝', label: 'Templates' },
    { path: '/sequences', icon: '⚡', label: 'Sequences' },
    { path: '/auto-replies', icon: '🤖', label: 'Auto-Replies' },
    { path: '/faqs', icon: '❓', label: 'FAQs' },
    { path: '/integration', icon: '🔌', label: 'Integration' },
  ]

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-xl text-blue-600">WhatsApp CRM</span>}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100">
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="flex-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg mb-1
              transition-colors duration-200
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar