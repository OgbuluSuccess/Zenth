import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'animate.css';

// Import custom hooks
import useTemplateInit from './hooks/useTemplateInit';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Import pages (to be created)
import Home from './pages/Home';
import Investments from './pages/Investments';
import CryptoInvestments from './pages/crypto/CryptoInvestments';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MarketOverview from './pages/MarketOverview';
import Dashboard from './pages/Dashboard';
import DashboardTailwind from './pages/DashboardTailwind';
import DashboardNew from './pages/DashboardNew';
import Portfolio from './pages/Portfolio';
import Rewards from './pages/Rewards';
import Referrals from './pages/Referrals';
import MyInvestments from './pages/MyInvestments';
import Transactions from './pages/Transactions';
import AdminDashboardNew from './pages/admin/AdminDashboardNew';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import InvestmentPlansManager from './pages/admin/InvestmentPlansManager';
import UserManagement from './pages/admin/UserManagement';
import ReferralSettingsManager from './pages/admin/ReferralSettingsManager';
import MoneyTransferManager from './pages/admin/MoneyTransferManager';
import TransactionManager from './pages/admin/TransactionManager';
import Deposit from './pages/Deposit'; // <-- Add this line
import Withdraw from './pages/Withdraw'; // <-- Add this line

// Import components
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

function App() {
  // Initialize template scripts and styles
  useTemplateInit();

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/crypto-investments" element={<CryptoInvestments />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/register" element={<RegisterAdmin />} />
              <Route path="/market-overview" element={<MarketOverview />} />
              
              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardNew />} />
                <Route path="/dashboard-old" element={<Dashboard />} />
                <Route path="/dashboard-tailwind" element={<DashboardTailwind />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/my-investments" element={<MyInvestments />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/crypto" element={<DashboardNew />} />
                <Route path="/exchange" element={<DashboardNew />} />
                <Route path="/settings" element={<DashboardNew />} />
                <Route path="/deposit" element={<Deposit />} /> {/* <-- Add this line */} 
                <Route path="/withdraw" element={<Withdraw />} /> {/* <-- Add this line */} 
              </Route>
              
              {/* Admin Routes - also protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
                <Route path="/admin/investment-plans" element={<InvestmentPlansManager />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/referral-settings" element={<ReferralSettingsManager />} />
                <Route path="/admin/money-transfer" element={<MoneyTransferManager />} />
                <Route path="/admin/transactions" element={<TransactionManager />} />
              </Route>
            
              {/* Add more routes as needed */}
            </Routes>
            </AppLayout>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
