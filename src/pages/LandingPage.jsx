import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Lock, 
  ChevronDown,
  Menu,
  X,
  Star,
  Quote,
  Award
} from 'lucide-react';
import CryptoTicker from '../components/CryptoTicker';

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleInvestClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0B0F1A]/80 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VentureCrypt</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition">
                How It Works
              </button>
              <button onClick={() => scrollToSection('plans')} className="text-gray-300 hover:text-white transition">
                Plans
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-white transition">
                FAQ
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium">{user.fullName}</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 text-white hover:text-gray-300 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0B0F1A] border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-300 hover:text-white transition py-2">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-gray-300 hover:text-white transition py-2">
                How It Works
              </button>
              <button onClick={() => scrollToSection('plans')} className="block w-full text-left text-gray-300 hover:text-white transition py-2">
                Plans
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-gray-300 hover:text-white transition py-2">
                FAQ
              </button>
              
              {user ? (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="text-white font-medium pb-2">Welcome, {user.fullName}!</div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="block w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-center"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-6 py-2 bg-white/5 text-white rounded-lg border border-white/10 text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="block w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 text-sm font-medium">🚀 Weekly Compounding Returns</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Wealth with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Smart Crypto Investing
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 leading-relaxed px-4 sm:px-0">
              Experience weekly compounding growth with returns up to 50% per week. Join thousands of investors 
              building generational wealth through our proven crypto investment platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleInvestClick}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Earning Weekly
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-8 py-4 bg-white/5 text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 transition"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">$250M+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">15K+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">107%</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">Avg. Monthly ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CryptoTicker/>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Why CryptoInvest Stands Out
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 px-4 sm:px-0">
              The most powerful platform for exponential wealth growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Bank-Level Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Military-grade encryption protects every transaction. Your investments are secured with institutional-grade infrastructure.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Weekly Compounding</h3>
              <p className="text-gray-400 leading-relaxed">
                Watch your wealth multiply every 7 days. Automatic compounding accelerates your returns exponentially.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Activation</h3>
              <p className="text-gray-400 leading-relaxed">
                Start earning within minutes. No complex processes, no waiting periods - just immediate growth.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">24/7 Elite Support</h3>
              <p className="text-gray-400 leading-relaxed">
                Dedicated investment specialists available around the clock. Get personalized guidance anytime.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Complete Transparency</h3>
              <p className="text-gray-400 leading-relaxed">
                Real-time portfolio tracking. See every weekly growth increment as your wealth compounds.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-500/50 transition backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Tiered Rewards</h3>
              <p className="text-gray-400 leading-relaxed">
                Unlock elite benefits as you grow. Progress through tiers for exclusive advantages and privileges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Your Path to Exponential Growth
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 px-4 sm:px-0">
              Start earning compounding returns in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full text-white text-3xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Join CryptoInvest</h3>
                <p className="text-gray-400 leading-relaxed">
                  Quick registration with just your email. Verified and ready to invest in under 60 seconds.
                </p>
              </div>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full text-white text-3xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Select Your Plan</h3>
                <p className="text-gray-400 leading-relaxed">
                  Choose from 15% to 50% weekly returns. Pick the plan that matches your wealth-building goals.
                </p>
              </div>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full text-white text-3xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Watch It Multiply</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatic weekly compounding. Your investment grows exponentially without lifting a finger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Weekly Compounding Plans
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 px-4 sm:px-0">
              Choose your wealth acceleration strategy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Plan */}
            <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="text-blue-400 font-semibold mb-2 text-sm">STARTER</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">15%</div>
              <div className="text-gray-400 mb-6 text-sm">Per Week • 4 Weeks</div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  Min: $10,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  Max: $50,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  ~75% total return
                </div>
              </div>
              <button
                onClick={handleInvestClick}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group-hover:shadow-lg group-hover:shadow-blue-500/50 text-sm sm:text-base font-medium"
              >
                Start Growing
              </button>
            </div>

            {/* Growth Plan */}
            <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="text-cyan-400 font-semibold mb-2 text-sm">GROWTH</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">20%</div>
              <div className="text-gray-400 mb-6 text-sm">Per Week • 4 Weeks</div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  Min: $50,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  Max: $150,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  ~107% total return
                </div>
              </div>
              <button
                onClick={handleInvestClick}
                className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition group-hover:shadow-lg group-hover:shadow-cyan-500/50 text-sm sm:text-base font-medium"
              >
                Accelerate Growth
              </button>
            </div>

            {/* Premium Plan */}
            <div className="relative p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-purple-500 group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="text-purple-400 font-semibold mb-2 text-sm">PREMIUM</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">25%</div>
              <div className="text-gray-400 mb-6 text-sm">Per Week • 4 Weeks</div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                  Min: $150,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                  Max: $500,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                  ~144% total return
                </div>
              </div>
              <button
                onClick={handleInvestClick}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition text-sm sm:text-base font-medium"
              >
                Go Premium
              </button>
            </div>

            {/* Elite Plan */}
            <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border-2 border-yellow-500 group">
              <div className="text-yellow-400 font-semibold mb-2 text-sm flex items-center gap-1">
                <Award className="w-4 h-4" />
                ELITE
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50%</div>
              <div className="text-gray-400 mb-6 text-sm">Per Week • 4 Weeks</div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  Min: $500,000
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  No maximum
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  ~406% total return
                </div>
              </div>
              <button
                onClick={handleInvestClick}
                className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition text-sm sm:text-base font-medium"
              >
                Join Elite
              </button>
            </div>
          </div>

          {/* Compounding Example */}
          <div className="mt-12 p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">The Power of Weekly Compounding</h3>
              <p className="text-gray-300">Example: $10,000 in Starter Plan (15% weekly)</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Week 1</div>
                <div className="text-xl font-bold text-white">$11,500</div>
                <div className="text-xs text-green-400">+$1,500</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Week 2</div>
                <div className="text-xl font-bold text-white">$13,225</div>
                <div className="text-xs text-green-400">+$1,725</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Week 3</div>
                <div className="text-xl font-bold text-white">$15,209</div>
                <div className="text-xs text-green-400">+$1,984</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border-2 border-green-500">
                <div className="text-sm text-gray-400 mb-1">Week 4</div>
                <div className="text-xl font-bold text-green-400">$17,490</div>
                <div className="text-xs text-green-400">+$2,281</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-block px-6 py-3 bg-green-500/20 border border-green-500 rounded-lg">
                <span className="text-green-400 font-bold text-lg">Total Profit: $7,490 (74.9% in 4 weeks!)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Reviews Section */}
      <ReviewsSection handleInvestClick={handleInvestClick} />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Multiply Your Wealth?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4 sm:px-0">
              Join 15,000+ investors experiencing weekly compounding growth
            </p>
            <button
              onClick={handleInvestClick}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105 inline-flex items-center gap-2"
            >
              Start Earning Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">VentureCrypt</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 VentureCrypt. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

// FAQ Section Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does weekly compounding work?",
      answer: "Every 7 days, your returns are automatically reinvested into your principal amount. For example, with a 15% weekly return, $10,000 becomes $11,500 after week 1, then $13,225 after week 2, and so on. This exponential growth is the power of compounding."
    },
    {
      question: "What's the minimum investment amount?",
      answer: "Our Starter Plan begins at just $10,000, making exponential wealth growth accessible to serious investors. Choose from four tiers: Starter ($10K-$50K), Growth ($50K-$150K), Premium ($150K-$500K), or Elite ($500K+)."
    },
    {
      question: "When can I withdraw my earnings?",
      answer: "Withdrawals are available once you reach Tier 3 status by investing $5 million or more across your portfolio. This ensures your investment has reached full maturity for maximum compounding benefits. Until then, your funds continue growing exponentially each week."
    },
    {
      question: "How secure are my investments?",
      answer: "We employ military-grade encryption, cold wallet storage, and institutional-grade security protocols. Your investments are protected by the same security standards used by major financial institutions, plus regular third-party security audits."
    },
    {
      question: "Are there any hidden fees?",
      answer: "Absolutely none. The returns shown are exactly what you receive. We believe in complete transparency - no management fees, no withdrawal fees, no hidden charges. What you see is what you get."
    },
    {
      question: "Can I have multiple active investments?",
      answer: "Yes! Many investors diversify across multiple plans simultaneously to maximize returns and accelerate their path to higher tiers. Each investment compounds independently."
    },
    {
      question: "What happens after 4 weeks?",
      answer: "After your 4-week investment period completes, your final compounded value (principal + all profits) is added to your account balance. You can then reinvest, start a new plan, or continue accumulating towards withdrawal eligibility."
    },
    {
      question: "How do I track my weekly growth?",
      answer: "Your dashboard provides real-time tracking of each investment, showing your current value after each weekly compound, progress through the 4-week period, and projected final returns. You'll see exactly how your wealth multiplies each week."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 px-4 sm:px-0">
            Everything you need to know about compounding returns
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition"
              >
                <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reviews Section Component (Updated with life-changing testimonials)
function ReviewsSection({ handleInvestClick }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    review: '',
    plan: 'Starter Plan'
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log('Review submitted:', reviewForm);
    alert('Thank you for your review! It will be published after verification.');
    setReviewForm({ name: '', role: '', review: '', plan: 'Starter Plan' });
    setShowReviewForm(false);
  };

  const reviews = [
    {
      name: "Victoria Chen",
      role: "Former Corporate Executive",
      initials: "VC",
      rating: 5,
      review: "I left my corporate job after three months on the Premium plan. Watching my investments compound weekly was surreal. This platform didn't just grow my money - it changed my entire life trajectory. Financial freedom is real.",
      plan: "Premium"
    },
    {
      name: "Marcus Thompson",
      role: "Tech Entrepreneur",
      initials: "MT",
      rating: 5,
      review: "The weekly compounding is absolutely insane. I started with the Growth plan and couldn't believe what I was seeing each week. My portfolio doubled faster than any traditional investment I've ever made. VentureCrypt is the real deal.",
      plan: "Growth"
    },
    {
      name: "Sarah Rodriguez",
      role: "Real Estate Investor",
      initials: "SR",
      rating: 5,
      review: "I've invested in everything - stocks, real estate, startups. Nothing compares to these returns. The transparency and weekly growth updates are incredible. This is the smartest money move I've ever made. My family's future is secure.",
      plan: "Elite"
    },
    {
      name: "David Park",
      role: "Financial Analyst",
      initials: "DP",
      rating: 5,
      review: "As someone who analyzes investments professionally, I was skeptical at first. Then I saw the math - weekly compounding at these rates is exponential wealth building. Four months in and I'm absolutely blown away. Game changer.",
      plan: "Premium"
    },
    {
      name: "Jennifer Walsh",
      role: "Small Business Owner",
      initials: "JW",
      rating: 5,
      review: "Started with $10K in the Starter plan just to test the waters. The weekly growth was consistent and transparent. Now I'm in the Premium tier and this platform has literally transformed my financial situation. Cannot recommend enough.",
      plan: "Starter"
    },
    {
      name: "Robert Kim",
      role: "Investment Banker",
      initials: "RK",
      rating: 5,
      review: "Twenty years in investment banking and I've never seen returns like this. The compounding effect is mathematically beautiful. I moved a significant portion of my portfolio here and it's been the best financial decision of my career.",
      plan: "Elite"
    },
    {
      name: "Amanda Foster",
      role: "Medical Professional",
      initials: "AF",
      rating: 5,
      review: "Working 80-hour weeks as a surgeon, I needed passive income that actually worked. CryptoInvest delivered beyond my wildest expectations. The weekly compounding is automatic and the returns are life-changing. I'm planning early retirement.",
      plan: "Premium"
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      initials: "MC",
      rating: 5,
      review: "I built financial models to verify the returns before investing. The math checks out perfectly. Weekly compounding at these rates creates exponential growth. Three months in and I'm already seeing generational wealth being built. Absolutely phenomenal.",
      plan: "Growth"
    },
    {
      name: "Lisa Anderson",
      role: "Marketing Director",
      initials: "LA",
      rating: 5,
      review: "This platform gave me financial independence I never thought possible. The transparency, the consistent weekly returns, the compounding effect - everything is exactly as promised. I tell everyone about CryptoInvest. It's truly life-changing.",
      plan: "Premium"
    }
  ];

  const getPlanColor = (plan) => {
    const colors = {
      'Starter': 'text-blue-400 bg-blue-500/10',
      'Growth': 'text-cyan-400 bg-cyan-500/10',
      'Premium': 'text-purple-400 bg-purple-500/10',
      'Elite': 'text-yellow-400 bg-yellow-500/10'
    };
    return colors[plan] || 'text-gray-400 bg-gray-500/10';
  };

  return (
    <section className="py-16 sm:py-20 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Life-Changing Results
          </h2>
          <p className="text-base sm:text-lg text-gray-400 px-4 sm:px-0 max-w-2xl mx-auto">
            Real stories from investors who transformed their wealth with weekly compounding
          </p>
        </div>

        {/* Review Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mb-12 pb-8 border-b border-white/10 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">4.9/5</div>
            <div className="text-xs sm:text-sm text-gray-400">Rating</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">4,821</div>
            <div className="text-xs sm:text-sm text-gray-400">Success Stories</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">99%</div>
            <div className="text-xs sm:text-sm text-gray-400">Recommend</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {review.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{review.name}</div>
                    <div className="text-xs text-gray-400 truncate">{review.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                "{review.review}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className={`text-xs px-2 py-1 rounded ${getPlanColor(review.plan)}`}>
                  {review.plan} Plan
                </span>
                <div className="text-xs text-green-400 font-semibold">✓ Verified Investor</div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Form Toggle */}
        <div className="text-center">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/20 hover:bg-white/10 hover:border-blue-500/50 transition text-sm font-medium inline-flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Share Your Success Story
            </button>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.role}
                        onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition text-sm"
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Plan Type
                    </label>
                    <select
                      value={reviewForm.plan}
                      onChange={(e) => setReviewForm({ ...reviewForm, plan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition text-sm"
                    >
                      <option value="Starter Plan">Starter Plan</option>
                      <option value="Growth Plan">Growth Plan</option>
                      <option value="Premium Plan">Premium Plan</option>
                      <option value="Elite Plan">Elite Plan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Success Story
                    </label>
                    <textarea
                      required
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none text-sm"
                      placeholder="Share how CryptoInvest transformed your financial journey..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-medium text-sm"
                    >
                      Submit Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-12 border-t border-white/10">
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Join 15,000+ investors building exponential wealth with weekly compounding
          </p>
          <button
            onClick={handleInvestClick}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105 inline-flex items-center gap-2"
          >
            Start Your Wealth Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Auth Modal Component
function AuthModal({ onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl p-8 max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to CryptoInvest</h2>
          <p className="text-gray-400">Start earning weekly compounding returns</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleNavigate('/signup')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            Create New Account
          </button>
          
          <button
            onClick={() => handleNavigate('/login')}
            className="w-full py-4 bg-white/5 text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 transition"
          >
            Sign In to Existing Account
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default LandingPage;