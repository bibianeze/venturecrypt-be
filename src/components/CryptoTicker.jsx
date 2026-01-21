import { TrendingUp, TrendingDown } from 'lucide-react';
import './CryptoTicker.css'; // We'll create this

function CryptoTicker() {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$45,231', change: '+2.5%', isUp: true, color: 'from-orange-500 to-yellow-500', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,845', change: '+5.2%', isUp: true, color: 'from-blue-500 to-purple-500', icon: 'Ξ' },
    { symbol: 'BNB', name: 'Binance', price: '$312.45', change: '-1.3%', isUp: false, color: 'from-yellow-500 to-orange-500', icon: 'B' },
    { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '0.0%', isUp: true, color: 'from-green-500 to-emerald-500', icon: '₮' },
    { symbol: 'SOL', name: 'Solana', price: '$98.76', change: '+8.1%', isUp: true, color: 'from-purple-500 to-pink-500', icon: 'S' },
    { symbol: 'XRP', name: 'Ripple', price: '$0.62', change: '+3.4%', isUp: true, color: 'from-blue-400 to-cyan-400', icon: 'X' },
    { symbol: 'USDC', name: 'USD Coin', price: '$1.00', change: '0.0%', isUp: true, color: 'from-blue-500 to-indigo-500', icon: 'U' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.45', change: '+1.8%', isUp: true, color: 'from-blue-600 to-cyan-500', icon: 'A' },
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.08', change: '-2.1%', isUp: false, color: 'from-yellow-400 to-yellow-600', icon: 'Ð' },
    { symbol: 'TRX', name: 'TRON', price: '$0.11', change: '+4.5%', isUp: true, color: 'from-red-500 to-pink-500', icon: 'T' },
  ];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-container">
        <div className="ticker-track">
          {/* First set */}
          {cryptos.map((crypto, index) => (
            <CryptoCard key={`first-${index}`} crypto={crypto} />
          ))}
          {/* Duplicate set */}
          {cryptos.map((crypto, index) => (
            <CryptoCard key={`second-${index}`} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CryptoCard({ crypto }) {
  return (
    <div className="crypto-card group flex items-center gap-4 px-6 py-4 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-white/30 hover:scale-105 transition-all">
      <div className={`w-14 h-14 bg-gradient-to-br ${crypto.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform`}>
        <span className="text-white font-bold text-2xl">{crypto.icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">{crypto.symbol}</span>
          <span className="text-gray-400 text-sm">{crypto.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-white font-semibold">{crypto.price}</span>
          <div className={`flex items-center gap-1 text-sm font-medium ${crypto.isUp ? 'text-green-400' : 'text-red-400'}`}>
            {crypto.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{crypto.change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoTicker;