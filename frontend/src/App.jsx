



// import React, { useState, useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Sidebar from './components/Sidebar'
// import TopBar from './components/TopBar'
// import LandingPage from './pages/LandingPage'
// import Dashboard from './pages/Dashboard'
// import OnboardingWizard from './pages/OnboardingWizard'
// import Templates from './pages/Templates'
// import SequencesList from './pages/SequencesList'
// import CreateSequence from './pages/CreateSequence'
// import Contacts from './pages/Contacts'
// import AutoReplies from './pages/AutoReplies'
// import FAQs from './pages/FAQs'
// import IntegrationStatus from './pages/IntegrationStatus'
// import WhatsAppInbox from './pages/WhatsAppInbox'

// function AppContent() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [credits, setCredits] = useState(250)
//   const [user, setUser] = useState(() => {
//     const saved = sessionStorage.getItem('user')
//     return saved ? JSON.parse(saved) : { name: 'Demo User', email: 'demo@whatsappcrm.com' }
//   })
  
//   const [onboardingComplete, setOnboardingComplete] = useState(() => {
//     return sessionStorage.getItem('onboarding_complete') === 'true'
//   })
  
//   const [showLanding, setShowLanding] = useState(() => {
//     return !sessionStorage.getItem('onboarding_complete')
//   })

//   useEffect(() => {
//     if (onboardingComplete) {
//       sessionStorage.setItem('onboarding_complete', 'true')
//       // Set user from onboarding data
//       const onboardingData = sessionStorage.getItem('onboarding_data')
//       if (onboardingData) {
//         try {
//           const data = JSON.parse(onboardingData)
//           if (data.fullName && data.businessEmail) {
//             setUser({ name: data.fullName, email: data.businessEmail })
//             sessionStorage.setItem('user', JSON.stringify({ name: data.fullName, email: data.businessEmail }))
//           }
//         } catch (e) {
//           console.error('Error parsing onboarding data', e)
//         }
//       }
//     }
//   }, [onboardingComplete])

//   const handleStartSetup = () => {
//     setShowLanding(false)
//     sessionStorage.setItem('landing_shown', 'true')
//   }

//   const handleOnboardingComplete = () => {
//     setOnboardingComplete(true)
//     setShowLanding(false)
//     sessionStorage.setItem('onboarding_complete', 'true')
//     sessionStorage.removeItem('onboarding_data')
//     sessionStorage.removeItem('onboarding_step')
//   }

//   const handleLogout = () => {
//     setOnboardingComplete(false)
//     setShowLanding(true)
//     setUser({ name: 'Demo User', email: 'demo@whatsappcrm.com' })
//     sessionStorage.clear()
//     localStorage.clear()
//     sessionStorage.setItem('landing_shown', 'true')
//   }

//   // Show landing page if not onboarded and landing not hidden
//   if (showLanding && !onboardingComplete) {
//     return <LandingPage onStartSetup={handleStartSetup} />
//   }

//   // Show onboarding wizard if not complete
//   if (!onboardingComplete) {
//     return <OnboardingWizard onComplete={handleOnboardingComplete} />
//   }

//   // Show main app with sidebar and dashboard after onboarding complete
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar 
//         collapsed={sidebarCollapsed} 
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//         onboardingComplete={onboardingComplete}
//       />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <TopBar credits={credits} user={user} onLogout={handleLogout} />
//         <main className="flex-1 overflow-y-auto p-6">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/inbox" element={<WhatsAppInbox />} />
//             <Route path="/templates" element={<Templates />} />
//             <Route path="/sequences" element={<SequencesList />} />
//             <Route path="/sequences/create" element={<CreateSequence />} />
//             <Route path="/contacts" element={<Contacts />} />
//             <Route path="/auto-replies" element={<AutoReplies />} />
//             <Route path="/faqs" element={<FAQs />} />
//             <Route path="/integration" element={<IntegrationStatus />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   )
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   )
// }

// export default App




import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import OnboardingWizard from './pages/OnboardingWizard'
import Templates from './pages/Templates'
import SequencesList from './pages/SequencesList'
import CreateSequence from './pages/CreateSequence'
import Contacts from './pages/Contacts'
import IntegrationStatus from './pages/IntegrationStatus'
import WhatsAppInbox from './pages/WhatsAppInbox'

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [credits, setCredits] = useState(250)
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true'
  })
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return sessionStorage.getItem('onboarding_complete') === 'true'
  })
  const [showSignup, setShowSignup] = useState(true)

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get('/onboarding-status/')
        if (response.data.onboarded) {
          setOnboardingComplete(true)
          sessionStorage.setItem('onboarding_complete', 'true')
        }
      } catch (error) {
        console.error('Error checking status:', error)
      }
    }
  }

  const handleSignupSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    sessionStorage.setItem('user', JSON.stringify(userData))
    sessionStorage.setItem('isAuthenticated', 'true')
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    sessionStorage.setItem('user', JSON.stringify(userData))
    sessionStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setOnboardingComplete(false)
    sessionStorage.clear()
    localStorage.clear()
  }

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true)
    sessionStorage.setItem('onboarding_complete', 'true')
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return <LandingPage onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setShowSignup(false)} />
    } else {
      return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setShowSignup(true)} />
    }
  }

  if (!onboardingComplete) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} onboardingComplete={onboardingComplete} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar credits={credits} user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbox" element={<WhatsAppInbox />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/sequences" element={<SequencesList />} />
            <Route path="/sequences/create" element={<CreateSequence />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/integration" element={<IntegrationStatus />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App




