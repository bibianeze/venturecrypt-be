import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Search,
  Eye,
  Check,
  X,
  MoreVertical,
  ArrowUpRight,
  LogOut,
  Menu,
  Bell,
  RefreshCw,
} from "lucide-react";
import * as adminApi from "../services/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showManageEarningsModal, setShowManageEarningsModal] = useState(false);
  const [showCreateInvestmentModal, setShowCreateInvestmentModal] =
    useState(false);

  const [addFundsData, setAddFundsData] = useState({
    amount: "",
    type: "credit",
    note: "",
  });

  const [earningsData, setEarningsData] = useState({
    amount: "",
    type: "credit",
    note: "",
  });

  const [newInvestment, setNewInvestment] = useState({
    plan: "Starter",
    amount: "",
    customRate: "",
  });

  // Load all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [statsData, usersData, investmentsData, withdrawalsData] =
        await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getUsers({
            status: filterStatus !== "all" ? filterStatus : undefined,
          }),
          adminApi.getInvestments({
            status: filterStatus !== "all" ? filterStatus : undefined,
          }),
          adminApi.getWithdrawals({
            status: filterStatus !== "all" ? filterStatus : undefined,
          }),
        ]);

      setStats(statsData);
      setUsers(usersData.users || []);
      setInvestments(investmentsData.investments || []);
      setWithdrawals(withdrawalsData.withdrawals || []);
      
      // Debug: Log user balances
      console.log('📊 Users data loaded:', usersData.users?.map(u => ({
        name: u.fullName,
        email: u.email,
        balance: u.accountBalance,
        rawData: u
      })));
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.message.includes("authenticate")) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        alert("Error loading data: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-400 bg-green-500/10 border border-green-500/20",
      pending: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
      completed: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
      rejected: "text-red-400 bg-red-500/10 border border-red-500/20",
      suspended: "text-gray-400 bg-gray-500/10 border border-gray-500/20",
    };
    return colors[status] || colors.pending;
  };

  // User actions
  const handleViewUser = async (user) => {
    try {
      const userData = await adminApi.getUserDetails(user._id);
      setSelectedUser(userData.user);
      setShowUserModal(true);
      setShowActionMenu(null);
    } catch (error) {
      alert("Error loading user details: " + error.message);
    }
  };

  const handleAddFunds = (user) => {
    setSelectedUser(user);
    setShowAddFundsModal(true);
    setShowActionMenu(null);
  };

  const handleManageEarnings = (user) => {
    setSelectedUser(user);
    setShowManageEarningsModal(true);
    setShowActionMenu(null);
  };

  const handleCreateInvestment = (user) => {
    setSelectedUser(user);
    setShowCreateInvestmentModal(true);
    setShowActionMenu(null);
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateUserBalance(
        selectedUser._id,
        addFundsData.amount,
        addFundsData.type,
        addFundsData.note,
      );

      alert(
        `Successfully ${addFundsData.type === "credit" ? "added" : "deducted"} ${formatCurrency(addFundsData.amount)}!`,
      );
      setShowAddFundsModal(false);
      setAddFundsData({ amount: "", type: "credit", note: "" });
      
      // Force immediate refresh
      await loadData();
      
      // Close action menu if open
      setShowActionMenu(null);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleManageEarningsSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateUserEarnings(
        selectedUser._id,
        earningsData.amount,
        earningsData.type,
        earningsData.note,
      );

      alert(
        `Successfully ${earningsData.type === "credit" ? "added" : "deducted"} ${formatCurrency(earningsData.amount)} earnings!`,
      );
      setShowManageEarningsModal(false);
      setEarningsData({ amount: "", type: "credit", note: "" });
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleCreateInvestmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createInvestment({
        userId: selectedUser._id,
        plan: newInvestment.plan,
        amount: parseFloat(newInvestment.amount),
        customRate: newInvestment.customRate
          ? parseFloat(newInvestment.customRate)
          : undefined,
      });

      alert("Investment created successfully!");
      setShowCreateInvestmentModal(false);
      setNewInvestment({ plan: "Starter", amount: "", customRate: "" });
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleApproveInvestment = async (investment) => {
    if (
      window.confirm(
        `Approve investment of ${formatCurrency(investment.amount)}?`,
      )
    ) {
      try {
        await adminApi.approveInvestment(investment._id);
        alert("Investment approved successfully!");
        loadData();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleRejectInvestment = async (investment) => {
    const reason = prompt("Reason for rejection:");
    if (reason) {
      try {
        await adminApi.rejectInvestment(investment._id, reason);
        alert("Investment rejected and amount refunded!");
        loadData();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleCompleteInvestment = async (investment) => {
    if (
      window.confirm(
        `Complete investment and credit ${formatCurrency(investment.amount + (investment.profit || 0))}?`,
      )
    ) {
      try {
        await adminApi.completeInvestment(investment._id);
        alert("Investment completed successfully!");
        loadData();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleApproveWithdrawal = async (withdrawal) => {
    const txHash =
      prompt("Enter transaction hash (optional):") || `TX${Date.now()}`;
    try {
      await adminApi.approveWithdrawal(withdrawal._id, txHash);
      alert("Withdrawal approved successfully!");
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleRejectWithdrawal = async (withdrawal) => {
    const reason = prompt("Reason for rejection:");
    if (reason) {
      try {
        await adminApi.rejectWithdrawal(withdrawal._id, reason);
        alert("Withdrawal rejected and amount refunded!");
        loadData();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleSuspendUser = async (user) => {
    if (window.confirm(`Suspend ${user.fullName}?`)) {
      try {
        await adminApi.updateUserStatus(user._id, "suspended");
        alert("User suspended successfully!");
        loadData();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleActivateUser = async (user) => {
    try {
      await adminApi.updateUserStatus(user._id, "active");
      alert("User activated successfully!");
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
    <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}
          >
            <ArrowUpRight className="w-4 h-4" />
            {change}%
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F1A]/80 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">
                    CryptoInvest
                  </div>
                  <div className="text-xs text-gray-400">Admin Panel</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="p-2 text-gray-400 hover:text-white transition"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-white transition">
                <Bell className="w-5 h-5" />
                {stats && stats.pendingWithdrawals > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-[#0B0F1A]/50 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 z-30 ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab("overview");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "overview" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "users" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
              {users.length > 0 && (
                <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("investments");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "investments" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Investments</span>
              {stats && stats.pendingInvestments > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingInvestments}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("withdrawals");
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === "withdrawals" ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Withdrawals</span>
              {stats && stats.pendingWithdrawals > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingWithdrawals}
                </span>
              )}
            </button>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-400">
                  Welcome back, {localStorage.getItem("adminName") || "Admin"}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers}
                  change={12.5}
                  isPositive={true}
                />
                <StatCard
                  icon={TrendingUp}
                  label="Active Investments"
                  value={stats.activeInvestments}
                  change={8.3}
                  isPositive={true}
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Invested"
                  value={formatCurrency(stats.totalInvested)}
                  change={15.7}
                  isPositive={true}
                />
                <StatCard
                  icon={Bell}
                  label="Pending Withdrawals"
                  value={stats.pendingWithdrawals}
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Recent Users
                    </h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        onClick={() => handleViewUser(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {user.fullName || user.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Investments */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Recent Investments
                    </h3>
                    <button
                      onClick={() => setActiveTab("investments")}
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {investments.slice(0, 5).map((investment) => (
                      <div
                        key={investment._id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                      >
                        <div>
                          <div className="text-white font-medium text-sm">
                            {investment.userId?.fullName ||
                              investment.userId?.email ||
                              "Unknown User"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {investment.plan} Plan
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium text-sm">
                            {formatCurrency(investment.amount)}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(investment.status)}`}
                          >
                            {investment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Users Management
                </h1>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-visible">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                          Balance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                          Investments
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-semibold">
                                  {user.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium">
                                  {user.fullName || "Unknown User"}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-white">
                            {formatCurrency(user.balance || 0)}
                          </td>

                          <td className="px-6 py-4 text-white">
                            {user.investments || 0}
                          </td>

                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right relative overflow-visible">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setShowActionMenu(
                                    showActionMenu === user._id ? null : user._id
                                  )
                                }
                                className="p-2 text-gray-400 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {showActionMenu === user._id && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B0F1A] border border-white/20 rounded-lg shadow-xl z-[999]">
                                  <button
                                    onClick={() => handleAddFunds(user)}
                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                                  >
                                    💰 Manage Funds
                                  </button>

                                  <button
                                    onClick={() => handleManageEarnings(user)}
                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                                  >
                                    📊 Manage Earnings
                                  </button>

                                  <button
                                    onClick={() => handleCreateInvestment(user)}
                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                                  >
                                    📈 Create Investment
                                  </button>

                                  <div className="border-t border-white/10 my-1" />

                                  {user.status === "active" ? (
                                    <button
                                      onClick={() => handleSuspendUser(user)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10"
                                    >
                                      🚫 Suspend User
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleActivateUser(user)}
                                      className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-white/10"
                                    >
                                      ✅ Activate User
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Investments Tab */}
          {activeTab === "investments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Investments Management
                </h1>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Investments Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Profit
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {investments.map((investment) => (
                        <tr
                          key={investment._id}
                          className="hover:bg-white/5 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {investment.userId?.fullName ||
                              investment.userId?.email ||
                              "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {investment.plan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {formatCurrency(investment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                            +{formatCurrency(investment.profit || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs px-3 py-1 rounded ${getStatusColor(investment.status)}`}
                            >
                              {investment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {investment.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApproveInvestment(investment)
                                    }
                                    className="p-2 text-green-400 hover:text-green-300 transition"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectInvestment(investment)
                                    }
                                    className="p-2 text-red-400 hover:text-red-300 transition"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {investment.status === "active" && (
                                <button
                                  onClick={() =>
                                    handleCompleteInvestment(investment)
                                  }
                                  className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === "withdrawals" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Withdrawal Requests
                </h1>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Pending Alert */}
              {stats && stats.pendingWithdrawals > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <Bell className="w-5 h-5 text-red-400" />
                  <div className="flex-1">
                    <p className="text-red-400 font-medium">
                      {stats.pendingWithdrawals} pending withdrawal
                      {stats.pendingWithdrawals > 1 ? "s" : ""} waiting for
                      approval
                    </p>
                  </div>
                </div>
              )}

              {/* Withdrawals Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Wallet
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {withdrawals.map((withdrawal) => (
                        <tr
                          key={withdrawal._id}
                          className="hover:bg-white/5 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {withdrawal.userId?.fullName ||
                              withdrawal.userId?.email ||
                              "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {formatCurrency(withdrawal.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                              {withdrawal.walletAddress?.substring(0, 12)}...
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs px-3 py-1 rounded ${getStatusColor(withdrawal.status)}`}
                            >
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {withdrawal.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApproveWithdrawal(withdrawal)
                                    }
                                    className="p-2 text-green-400 hover:text-green-300 transition"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectWithdrawal(withdrawal)
                                    }
                                    className="p-2 text-red-400 hover:text-red-300 transition"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Manage User Funds
              </h2>
              <button
                onClick={() => setShowAddFundsModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {selectedUser.fullName || selectedUser.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Balance
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-green-400 font-bold">
                  {formatCurrency(selectedUser.balance || 0)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action Type
                </label>
                <select
                  value={addFundsData.type}
                  onChange={(e) =>
                    setAddFundsData({ ...addFundsData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                >
                  <option value="credit">💰 Add Funds (Credit)</option>
                  <option value="debit">➖ Deduct Funds (Debit)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={addFundsData.amount}
                  onChange={(e) =>
                    setAddFundsData({ ...addFundsData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={addFundsData.note}
                  onChange={(e) =>
                    setAddFundsData({ ...addFundsData, note: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none"
                  placeholder="Reason for this transaction..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-medium"
                >
                  {addFundsData.type === "credit"
                    ? "Add Funds"
                    : "Deduct Funds"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Earnings Modal */}
      {showManageEarningsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Manage User Earnings
              </h2>
              <button
                onClick={() => setShowManageEarningsModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleManageEarningsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {selectedUser.fullName || selectedUser.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Total Earnings
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-green-400 font-bold">
                  {formatCurrency(selectedUser.totalEarnings || 0)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action Type
                </label>
                <select
                  value={earningsData.type}
                  onChange={(e) =>
                    setEarningsData({ ...earningsData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                >
                  <option value="credit">📊 Add Earnings (Credit)</option>
                  <option value="debit">➖ Deduct Earnings (Debit)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={earningsData.amount}
                  onChange={(e) =>
                    setEarningsData({ ...earningsData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={earningsData.note}
                  onChange={(e) =>
                    setEarningsData({ ...earningsData, note: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none"
                  placeholder="Reason for this update..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-medium"
                >
                  {earningsData.type === "credit"
                    ? "Add Earnings"
                    : "Deduct Earnings"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowManageEarningsModal(false)}
                  className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Investment Modal */}
      {showCreateInvestmentModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Create Investment
              </h2>
              <button
                onClick={() => setShowCreateInvestmentModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInvestmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {selectedUser.fullName || selectedUser.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Plan
                </label>
                <select
                  value={newInvestment.plan}
                  onChange={(e) =>
                    setNewInvestment({ ...newInvestment, plan: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition"
                >
                  <option value="Starter">Starter Plan (5% - 7 days)</option>
                  <option value="Growth">Growth Plan (12% - 14 days)</option>
                  <option value="Premium">Premium Plan (25% - 30 days)</option>
                  <option value="Elite">Elite Plan (50% - 60 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="0.01"
                  value={newInvestment.amount}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      amount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Minimum: $10,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Return Rate (%) - Optional
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newInvestment.customRate}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      customRate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Leave empty for default rate"
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 Amount will be deducted from user's balance
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition font-medium"
                >
                  Create Investment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateInvestmentModal(false)}
                  className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;