import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  ArrowRight,
  LogOut,
  Activity,
  PieChart,
  X,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  ArrowUpRight,
  Lock,
  Mail,
  Home
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [newInvestment, setNewInvestment] = useState(null);

  useEffect(() => {
    loadDashboardData();
    
    const handleFocus = () => {
      console.log('🔄 Tab focused - refreshing balance...');
      loadDashboardData();
    };
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing data...');
      loadDashboardData();
    }, 30000);
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(refreshInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        navigate('/login');
        return;
      }

      setUser(userData);

      const statsResponse = await axios.get('http://localhost:5000/api/investment/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);

      const investmentsResponse = await axios.get('http://localhost:5000/api/investment/my-investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(investmentsResponse.data);

      const plansResponse = await axios.get('http://localhost:5000/api/investment/plans');
      setPlans(plansResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleInvestmentSuccess = (investment) => {
    setNewInvestment(investment);
    setShowSuccessModal(true);
    setShowInvestModal(false);
    loadDashboardData();
  };

  const handleWithdrawClick = () => {
    if (stats?.userTier < 3) {
      setShowTierModal(true);
    } else {
      setShowWithdrawModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate completed investments count from investments array
  const completedCount = investments.filter(inv => inv.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A]">
      {/* Navbar */}
      <nav className="bg-[#0B0F1A]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CryptoInvest</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-white transition"
                title="Back to Home"
              >
                <Home className="w-5 h-5" />
              </button>

              <button
                onClick={loadDashboardData}
                className="p-2 text-gray-400 hover:text-white transition"
                title="Refresh Balance"
              >
                <Activity className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium hidden sm:block">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-400">Here's what's happening with your investments today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-gray-300 font-medium">Available Balance</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats?.balance?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-400">Ready to invest</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <PieChart className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-gray-300 font-medium">Total Invested</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats?.totalInvested?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-400">Across all plans</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-gray-300 font-medium">Total Earned</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats?.totalEarned?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-green-400">+{completedCount} completed</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-gray-300 font-medium">Active Investments</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats?.activeInvestments || 0}
            </div>
            <p className="text-sm text-gray-400">{stats?.pendingInvestments || 0} pending approval</p>
          </div>
        </div>

        {/* Weekly Returns Tracker */}
        <WeeklyReturnsTracker investments={investments} />

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Invest Now */}
          <div className="p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl border border-blue-500/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Invest?</h2>
                <p className="text-gray-300">Start earning weekly returns today</p>
              </div>
              <button
                onClick={() => setShowInvestModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                Invest Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Withdraw */}
          <div className="p-8 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-green-600/20 rounded-3xl border border-green-500/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h2>
                <p className="text-gray-300">Request to transfer your earnings</p>
              </div>
              <button
                onClick={handleWithdrawClick}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                Withdraw
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Investments */}
        <RecentInvestments investments={investments} />
      </div>

      {/* Modals */}
      {showInvestModal && (
        <InvestmentModal
          plans={plans}
          onClose={() => setShowInvestModal(false)}
          onSuccess={handleInvestmentSuccess}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          investment={newInvestment}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showWithdrawModal && (
        <WithdrawModal
          stats={stats}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            loadDashboardData();
          }}
        />
      )}

      {showTierModal && (
        <TierRestrictionModal
          onClose={() => setShowTierModal(false)}
        />
      )}
    </div>
  );
}

// Simplified Tier Restriction Modal
function TierRestrictionModal({ onClose }) {
  // WhatsApp icon component
  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl max-w-lg w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Withdrawal Not Available</h2>
          <p className="text-gray-400">Your investment is still maturing</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-yellow-400 font-bold text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Investment Maturity Required
          </h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Your investment is currently in <span className="font-bold text-white">Tier 1</span> and has not yet reached maturity. 
            Withdrawals are only available to investors in <span className="font-bold text-white">Tier 3</span>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            This tier system ensures your investment achieves maximum growth and compounding benefits before withdrawal.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h4 className="text-blue-400 font-bold mb-3">Need More Information?</h4>
          <p className="text-gray-300 text-sm mb-4">
            For detailed information about upgrading your investment tier and unlocking withdrawal privileges, please contact our admin team.
          </p>
          
          <div className="space-y-3">
            <a 
              href="mailto:contact@venture-crypt.com"
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Email Support</div>
                <div className="text-gray-400 text-xs">contact@venture-crypt.com</div>
              </div>
            </a>

            <a 
              href="https://wa.me/13215782270"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
            >
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition">
                <WhatsAppIcon />
              </div>
              <div>
                <div className="text-white font-medium text-sm">WhatsApp Support</div>
                <div className="text-gray-400 text-xs">+1 321 578 2270</div>
              </div>
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

// Withdraw Modal Component
function WithdrawModal({ stats, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cryptos = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '₮' },
    { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', icon: 'B' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/investment/withdraw',
        {
          amount: parseFloat(amount),
          withdrawalMethod,
          withdrawalAddress
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Withdrawal request submitted successfully! Our team will process it within 24-48 hours.');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl max-w-md w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full items-center justify-center mb-4">
            <ArrowUpRight className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h2>
          <p className="text-gray-400">Available balance: ${stats?.balance?.toLocaleString()}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={stats?.balance}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="10,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Method
            </label>
            <select
              required
              value={withdrawalMethod}
              onChange={(e) => setWithdrawalMethod(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select cryptocurrency</option>
              {cryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.symbol}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {withdrawalMethod} Address
            </label>
            <input
              type="text"
              required
              value={withdrawalAddress}
              onChange={(e) => setWithdrawalAddress(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter your wallet address"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              ⚠️ Withdrawals are processed within 24-48 hours. Please ensure your wallet address is correct.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Success Modal Component
function SuccessModal({ investment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl max-w-md w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Investment Submitted!</h2>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-yellow-200 text-lg font-semibold mb-3">
              ⏳ Awaiting Admin Approval
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your investment of <span className="font-bold text-white">${investment?.amount?.toLocaleString()}</span> has been received and is pending admin verification.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white font-semibold">{investment?.plan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white font-semibold">{investment?.duration} days (4 weeks)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weekly Return:</span>
              <span className="text-cyan-400 font-semibold">{investment?.weeklyReturnPercentage}%</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-3">
              <span className="text-gray-400">Expected Final Value:</span>
              <span className="text-white font-bold text-lg">${investment?.finalReturn?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Profit:</span>
              <span className="text-green-400 font-bold">${investment?.totalProfit?.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <p className="text-blue-200 text-sm">
              💡 You'll receive notifications for each weekly return. Your investment will compound automatically each week for maximum growth!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

// Weekly Returns Tracker Component - FIXED
function WeeklyReturnsTracker({ investments }) {
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  
  const calculateWeeklyEarnings = () => {
    let totalWeeklyEarnings = 0;
    
    activeInvestments.forEach(inv => {
      // Access weeklyReturnPercentage from planSnapshot
      const weeklyRate = inv.planSnapshot?.weeklyReturnPercentage || 0;
      const currentValue = inv.currentValue || inv.amount || 0;
      const weeklyEarning = (currentValue * weeklyRate) / 100;
      totalWeeklyEarnings += weeklyEarning;
    });
    
    return totalWeeklyEarnings;
  };

  // Calculate compounded monthly projection
  const calculateMonthlyProjection = () => {
    let totalMonthlyProfit = 0;
    
    activeInvestments.forEach(inv => {
      const weeklyRate = inv.planSnapshot?.weeklyReturnPercentage || 0;
      const startValue = inv.currentValue || inv.amount || 0;
      const weeksRemaining = 4 - (inv.weeksCompleted || 0);
      
      // Calculate final value after remaining weeks of compounding
      let finalValue = startValue;
      for (let i = 0; i < weeksRemaining; i++) {
        finalValue = finalValue * (1 + weeklyRate / 100);
      }
      
      // Add the profit from this investment
      totalMonthlyProfit += (finalValue - startValue);
    });
    
    return totalMonthlyProfit;
  };

  const weeklyEarnings = calculateWeeklyEarnings();
  const monthlyProjection = calculateMonthlyProjection();

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-yellow-500/20 rounded-xl">
          <Clock className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Weekly Earnings Tracker</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">This Week's Earnings</div>
          <div className="text-4xl font-bold text-white">
            ${weeklyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-yellow-400 mt-2">From active investments</p>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Total Projected Profit</div>
          <div className="text-4xl font-bold text-white">
            ${monthlyProjection.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-gray-400 mt-2">After 4 weeks compounding</p>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Active Investments</div>
          <div className="text-4xl font-bold text-white">
            {activeInvestments.length}
          </div>
          <p className="text-sm text-gray-400 mt-2">Currently growing</p>
        </div>
      </div>

      {activeInvestments.length === 0 && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-center">No active investments yet. Start investing to see your weekly earnings!</p>
        </div>
      )}

      {activeInvestments.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="text-sm font-medium text-gray-400 mb-2">Active Investment Breakdown:</div>
          {activeInvestments.map((inv, idx) => {
            // Fixed: Access weeklyReturnPercentage from planSnapshot
            const weeklyRate = inv.planSnapshot?.weeklyReturnPercentage || 0;
            const currentValue = inv.currentValue || inv.amount || 0;
            const weeklyReturn = (currentValue * weeklyRate) / 100;
            
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{inv.planSnapshot?.name || 'Investment'}</div>
                  <div className="text-sm text-gray-400">Week {(inv.weeksCompleted || 0) + 1} of 4</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+${weeklyReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-400">this week</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Recent Investments Component - FIXED
function RecentInvestments({ investments }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Investments</h2>
      
      {investments.length === 0 ? (
        <div className="p-12 bg-white/5 rounded-2xl border border-white/10 text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No investments yet</h3>
          <p className="text-gray-400 mb-6">Start your investment journey with weekly compounding returns!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {investments.map((investment) => (
            <div
              key={investment._id}
              className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{investment.planSnapshot?.name || 'Investment'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(investment.status)}`}>
                      {investment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Initial Amount</div>
                      <div className="text-white font-semibold">${investment.amount?.toLocaleString() || '0'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Current Value</div>
                      <div className="text-cyan-400 font-semibold">${(investment.currentValue || investment.amount || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Weekly Return</div>
                      <div className="text-white font-semibold">{investment.planSnapshot?.weeklyReturnPercentage || 0}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Progress</div>
                      <div className="text-white font-semibold">Week {(investment.weeksCompleted || 0)}/4</div>
                    </div>
                  </div>
                </div>
                
                {investment.status === 'active' && (
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Expected Final Value</div>
                    <div className="text-lg font-bold text-green-400">
                      ${investment.finalReturn?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      +${investment.totalProfit?.toLocaleString() || '0'} profit
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Investment Modal Component
function InvestmentModal({ plans, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedUsdtVariant, setSelectedUsdtVariant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const cryptos = [
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      color: 'from-orange-500 to-yellow-500', 
      icon: '₿', 
      address: 'bc1qdlgajqdz0cqlyj85wmdzzgpjf20pjv52srxpv8' 
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      color: 'from-blue-500 to-purple-500', 
      icon: 'Ξ', 
      address: '0xdB64196439F1b2563C5Ce45EC66Fa980d8eC11CB' 
    },
    { 
      id: 'usdt', 
      name: 'Tether (USDT)', 
      symbol: 'USDT', 
      color: 'from-green-500 to-emerald-500', 
      icon: '₮', 
      hasVariants: true,
      variants: [
        { 
          id: 'usdt-sol', 
          name: 'USDT (Solana)', 
          symbol: 'USDT-SOL', 
          network: 'Solana Network',
          address: '5pVArUS9TeXrhoF5aonAwByYhTZ9VmAbSS7rhLhC92BP' 
        },
        { 
          id: 'usdt-erc20', 
          name: 'USDT (ERC20)', 
          symbol: 'USDT-ERC20', 
          network: 'Ethereum Network',
          address: '0xdB64196439F1b2563C5Ce45EC66Fa980d8eC11CB' 
        },
        { 
          id: 'usdt-bep20', 
          name: 'USDT (BEP20)', 
          symbol: 'USDT-BEP20', 
          network: 'Binance Smart Chain',
          address: '0xdB64196439F1b2563C5Ce45EC66Fa980d8eC11CB' 
        }
      ]
    },
    { 
      id: 'bnb', 
      name: 'Binance Coin', 
      symbol: 'BNB', 
      color: 'from-yellow-500 to-orange-500', 
      icon: 'B', 
      address: '0xdB64196439F1b2563C5Ce45EC66Fa980d8eC11CB' 
    },
  ];

  const calculateExpectedReturns = (amount, weeklyRate) => {
    let currentValue = amount;
    const returns = [];
    
    for (let week = 1; week <= 4; week++) {
      const weeklyReturn = currentValue * (weeklyRate / 100);
      currentValue += weeklyReturn;
      returns.push({
        week,
        value: Math.round(currentValue * 100) / 100,
        return: Math.round(weeklyReturn * 100) / 100
      });
    }
    
    return returns;
  };

  const handleAmountSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const eligiblePlans = plans.filter(plan => 
      numAmount >= plan.minimumAmount && 
      (!plan.maximumAmount || numAmount <= plan.maximumAmount)
    );

    if (eligiblePlans.length === 0) {
      setError(`No plans available for $${numAmount.toLocaleString()}. Minimum is $${plans[0]?.minimumAmount.toLocaleString()}`);
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(3);
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    
    // If USDT with variants, don't set address yet - wait for variant selection
    if (crypto.hasVariants) {
      setSelectedUsdtVariant(null);
      setWalletAddress('');
    } else {
      setWalletAddress(crypto.address);
    }
    
    setStep(4);
  };
  
  const handleUsdtVariantSelect = (variant) => {
    setSelectedUsdtVariant(variant);
    setWalletAddress(variant.address);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmInvestment = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/investment/invest',
        {
          planId: selectedPlan._id,
          amount: parseFloat(amount),
          transactionProof: `${selectedCrypto.symbol} - Wallet: ${walletAddress.substring(0, 10)}...`
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSuccess(response.data.investment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  const eligiblePlans = plans.filter(plan => {
    const numAmount = parseFloat(amount);
    return numAmount >= plan.minimumAmount && (!plan.maximumAmount || numAmount <= plan.maximumAmount);
  });

  const expectedReturns = selectedPlan ? calculateExpectedReturns(parseFloat(amount), selectedPlan.weeklyReturnPercentage) : [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl max-w-4xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">New Investment</h2>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-white/10'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Enter Amount */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">How much do you want to invest?</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10,000"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Minimum: $10,000 • Earn weekly compounding returns</p>
              </div>
              <button
                onClick={handleAmountSubmit}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Select Plan */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                ← Back
              </button>
              <h3 className="text-xl font-bold text-white mb-4">
                Choose Your Investment Plan for ${parseFloat(amount).toLocaleString()}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {eligiblePlans.map((plan) => {
                  const returns = calculateExpectedReturns(parseFloat(amount), plan.weeklyReturnPercentage);
                  const finalValue = returns[3].value;
                  const totalProfit = finalValue - parseFloat(amount);
                  
                  return (
                    <div
                      key={plan._id}
                      onClick={() => handlePlanSelect(plan)}
                      className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 cursor-pointer transition group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">{plan.name}</h4>
                          <p className="text-gray-400 text-sm">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">{plan.weeklyReturnPercentage}%</div>
                          <div className="text-xs text-gray-400">per week</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-gray-300">
                          <span>Initial Investment:</span>
                          <span className="font-semibold">${parseFloat(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-cyan-400">
                          <span>After 4 Weeks:</span>
                          <span className="font-semibold">${finalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-400 border-t border-white/10 pt-2">
                          <span>Total Profit:</span>
                          <span className="font-bold">${totalProfit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Weekly Breakdown */}
                      <div className="bg-white/5 rounded-lg p-3 mb-3">
                        <div className="text-xs text-gray-400 mb-2">Weekly Growth:</div>
                        {returns.map((ret, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-300 mb-1">
                            <span>Week {ret.week}:</span>
                            <span className="text-cyan-400">${ret.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 transition">
                        Select {plan.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Select Crypto */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                ← Back
              </button>
              <h3 className="text-xl font-bold text-white mb-4">Select Payment Method</h3>
              <p className="text-gray-400 mb-6">Choose which cryptocurrency you'll use to fund this investment</p>
              <div className="grid md:grid-cols-2 gap-4">
                {cryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    onClick={() => handleCryptoSelect(crypto)}
                    className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 cursor-pointer transition group flex items-center gap-4"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${crypto.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition`}>
                      <span className="text-white font-bold text-3xl">{crypto.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{crypto.name}</h4>
                      <p className="text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Payment Instructions */}
          {step === 4 && (
            <div>
              <button
                onClick={() => setStep(3)}
                className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                ← Back
              </button>
              <div className="text-center mb-6">
                <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${selectedCrypto.color} rounded-full items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-4xl">{selectedCrypto.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Complete Payment</h3>
                <p className="text-gray-400">
                  Send {selectedUsdtVariant ? selectedUsdtVariant.name : selectedCrypto.name} to complete your investment
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Investment Amount</div>
                    <div className="text-2xl font-bold text-white">${parseFloat(amount).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Plan</div>
                    <div className="text-2xl font-bold text-white">{selectedPlan.name}</div>
                  </div>
                </div>

                {/* USDT Variant Selector */}
                {selectedCrypto.hasVariants && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select USDT Network
                    </label>
                    <div className="space-y-2">
                      {selectedCrypto.variants.map((variant) => (
                        <div
                          key={variant.id}
                          onClick={() => handleUsdtVariantSelect(variant)}
                          className={`p-4 rounded-lg cursor-pointer transition border ${
                            selectedUsdtVariant?.id === variant.id
                              ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-semibold">{variant.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{variant.network}</div>
                            </div>
                            {selectedUsdtVariant?.id === variant.id && (
                              <Check className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Returns Summary */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-blue-400 mb-3">Expected Weekly Growth:</div>
                  <div className="space-y-2">
                    {expectedReturns.map((ret, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-300">Week {ret.week}:</span>
                        <span className="text-white font-semibold">${ret.value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                      <span className="text-gray-300">Total Profit:</span>
                      <span className="text-green-400 font-bold">
                        +${(expectedReturns[3].value - parseFloat(amount)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Address Section - Only show if address is available */}
                {walletAddress && (
                  <div className="border-t border-white/10 pt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Send {selectedUsdtVariant ? `${selectedUsdtVariant.name}` : `${selectedCrypto.name} (${selectedCrypto.symbol})`} to this address:
                    </label>
                    
                    {selectedUsdtVariant && (
                      <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-xs text-blue-400 font-semibold mb-1">Network</div>
                        <div className="text-sm text-white">{selectedUsdtVariant.network}</div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={walletAddress}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      ⚠️ Only send {selectedUsdtVariant ? `${selectedUsdtVariant.symbol} on ${selectedUsdtVariant.network}` : `${selectedCrypto.name} (${selectedCrypto.symbol})`} to this address. Sending other cryptocurrencies or using the wrong network may result in loss of funds.
                    </p>
                  </div>
                )}
              </div>

              {!walletAddress && selectedCrypto.hasVariants && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-200 text-sm text-center">
                    ⚠️ Please select a USDT network above to continue
                  </p>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">Important Instructions:</p>
                    <ul className="space-y-1 text-yellow-200/80">
                      <li>• Send the exact equivalent of ${parseFloat(amount).toLocaleString()} in {selectedUsdtVariant ? selectedUsdtVariant.name : `${selectedCrypto.name} (${selectedCrypto.symbol})`}</li>
                      {selectedUsdtVariant && (
                        <li>• Make sure you're using the {selectedUsdtVariant.network}</li>
                      )}
                      <li>• Your investment will compound weekly automatically</li>
                      <li>• Activation typically takes 10-30 minutes after admin approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmInvestment}
                disabled={loading || !walletAddress}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    I've Completed the Payment
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-400 mt-3">
                Click this button after you've sent the payment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;