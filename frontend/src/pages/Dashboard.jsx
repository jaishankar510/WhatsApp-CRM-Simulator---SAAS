// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../api/client'

// const Dashboard = () => {
//   const navigate = useNavigate()
//   const [stats, setStats] = useState({
//     total_templates: 0,
//     total_sequences: 0,
//     active_sequences: 0,
//     total_contacts: 0,
//     credits: 0
//   })
//   const [loading, setLoading] = useState(true)
//   const [objectives, setObjectives] = useState([])

//   useEffect(() => {
//     fetchDashboardData()
//     fetchUserObjectives()
//   }, [])

//   const fetchDashboardData = async () => {
//     setLoading(true)
//     try {
//       const response = await api.get('/dashboard/stats/')
//       setStats({
//         ...response.data,
//         credits: 250
//       })
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//     }
//     setLoading(false)
//   }

//   const fetchUserObjectives = async () => {
//     // Get objectives from session storage
//     const savedData = sessionStorage.getItem('onboarding_data')
//     if (savedData) {
//       const data = JSON.parse(savedData)
//       setObjectives(data.objectives || [])
//     }
//   }

//   const objectiveLabels = {
//     leads: 'Generate High-intent Leads',
//     whatsapp_ads: 'Click to WhatsApp Ads',
//     quality_leads: 'Quality Ad Leads',
//     whatsapp_forms: 'WhatsApp Forms',
//     retarget: 'Re-target Qualified Leads in Bulk',
//     bulk_campaigns: 'WhatsApp Bulk Campaigns',
//     followup: 'Automate Regular Follow-up on Leads',
//     notifications: 'WhatsApp Automated Notification',
//     others: 'Others Reasons'
//   }

//   const quickActions = [
//     { title: 'Connect Number', icon: '📞', color: 'bg-green-100', status: 'Not Verified', action: '/integration' },
//     { title: 'Greeting Flow', icon: '👋', color: 'bg-blue-100', status: 'Not Verified', action: '/auto-replies' },
//     { title: 'FAQ Auto-replies', icon: '❓', color: 'bg-purple-100', status: 'Not Verified', action: '/faqs' },
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Top Bar Stats */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-6">
//             <button className="text-gray-700 hover:text-blue-600">Dashboard</button>
//             <button className="text-gray-700 hover:text-blue-600">Tutorial</button>
//             <button className="text-gray-700 hover:text-blue-600">Help</button>
//             <button className="text-gray-700 hover:text-blue-600">Billing & Payments</button>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
//               <span className="text-yellow-600">💰</span>
//               <span className="font-semibold text-yellow-700">Available Credits: {stats.credits}</span>
//             </div>
//             <button className="text-gray-700 hover:text-blue-600">👤 My Profile</button>
//             <button className="text-gray-700 hover:text-blue-600">🎁 Refer and Earn</button>
//             <button className="text-gray-700 hover:text-blue-600">🔔</button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {quickActions.map((action, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//             <div className="flex items-center justify-between mb-3">
//               <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
//                 {action.icon}
//               </div>
//               <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">{action.status}</span>
//             </div>
//             <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
//             <button 
//               onClick={() => navigate(action.action)}
//               className="text-blue-600 text-sm hover:underline mt-2"
//             >
//               {action.title === 'Connect Number' ? 'Connect' : action.title === 'Greeting Flow' ? 'Edit Flow' : 'Edit'} →
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Update WhatsApp Profile Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Update WhatsApp Profile</h3>
//           <button className="text-blue-600 text-sm">Update →</button>
//         </div>
//         <p className="text-sm text-gray-500">Make a great first impression</p>
//       </div>

//       {/* Objectives Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Objectives</h3>
//           <button className="text-blue-600 text-sm">View All →</button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {objectives.slice(0, 4).map((obj, idx) => (
//             <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
//               <span className="text-green-500">✓</span>
//               <span>{objectiveLabels[obj] || obj}</span>
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t">
//           <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
//             <span>Via Click to WhatsApp Ads</span>
//             <span className="text-blue-600">Setup →</span>
//           </button>
//           <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
//             <span>Via WhatsApp Forms</span>
//             <span className="text-blue-600">Setup →</span>
//           </button>
//           <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
//             <span>Via WhatsApp Automated Notifications</span>
//             <span className="text-blue-600">Setup →</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard





import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_templates: 0,
    total_sequences: 0,
    active_sequences: 0,
    total_contacts: 0,
    credits: 250
  })
  const [onboardingData, setOnboardingData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    fetchOnboardingData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats/')
      setStats(prev => ({ ...prev, ...response.data }))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchOnboardingData = async () => {
    try {
      const response = await api.get('/onboarding-current/')
      if (response.data.success) {
        setOnboardingData(response.data)
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error)
    }
    setLoading(false)
  }

  const objectiveLabels = {
    leads: 'Generate High-intent Leads',
    whatsapp_ads: 'Click to WhatsApp Ads',
    quality_leads: 'Quality Ad Leads',
    whatsapp_forms: 'WhatsApp Forms',
    retarget: 'Re-target Qualified Leads in Bulk',
    bulk_campaigns: 'WhatsApp Bulk Campaigns',
    followup: 'Automate Regular Follow-up on Leads',
    notifications: 'WhatsApp Automated Notification',
    others: 'Others Reasons'
  }

  const quickActions = [
    { title: 'Connect Number', icon: '📞', color: 'bg-green-100', status: 'Connected', action: '/integration' },
    { title: 'Greeting Flow', icon: '👋', color: 'bg-blue-100', status: onboardingData ? 'Setup' : 'Not Verified', action: '/auto-replies' },
    { title: 'FAQ Auto-replies', icon: '❓', color: 'bg-purple-100', status: 'Configured', action: '/faqs' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {onboardingData?.full_name || 'User'}! 👋
            </h1>
            <p className="text-blue-100 mt-1">
              {onboardingData?.company_name || 'Your business'} is ready to send WhatsApp messages
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <span className="text-2xl">💬</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Contacts</p>
              <p className="text-3xl font-bold mt-1">{stats.total_contacts || 1}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Message Templates</p>
              <p className="text-3xl font-bold mt-1">{stats.total_templates || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Sequences</p>
              <p className="text-3xl font-bold mt-1">{stats.active_sequences || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full text-xl">⚡</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Credits</p>
              <p className="text-3xl font-bold mt-1 text-yellow-600">{stats.credits}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full text-xl">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                {action.icon}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${action.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {action.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
            <button 
              onClick={() => navigate(action.action)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              {action.title === 'Connect Number' ? 'View Status →' : action.title === 'Greeting Flow' ? 'Configure →' : 'Manage →'}
            </button>
          </div>
        ))}
      </div>

      {/* Update WhatsApp Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Update WhatsApp Profile</h3>
          <button className="text-blue-600 text-sm">Update →</button>
        </div>
        <p className="text-sm text-gray-500">Make a great first impression</p>
        {onboardingData && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm"><span className="font-medium">Business Name:</span> {onboardingData.company_name}</p>
            <p className="text-sm"><span className="font-medium">WhatsApp Number:</span> {onboardingData.country_code} {onboardingData.whatsapp_number}</p>
          </div>
        )}
      </div>

      {/* Objectives Section */}
      {onboardingData?.objectives && onboardingData.objectives.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Your Objectives</h3>
            <button className="text-blue-600 text-sm">View All →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onboardingData.objectives.slice(0, 4).map((obj, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>{objectiveLabels[obj] || obj}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>Via Click to WhatsApp Ads</span>
              <span className="text-blue-600">Setup →</span>
            </button>
            <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>Via WhatsApp Forms</span>
              <span className="text-blue-600">Setup →</span>
            </button>
            <button className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>Via WhatsApp Automated Notifications</span>
              <span className="text-blue-600">Setup →</span>
            </button>
          </div>
        </div>
      )}

      {/* Business Info */}
      {onboardingData && (
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-medium">Your WhatsApp Business is ready!</span><br />
            Business: {onboardingData.company_name}<br />
            Contact: {onboardingData.business_email}<br />
            Number: {onboardingData.country_code} {onboardingData.whatsapp_number}
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard