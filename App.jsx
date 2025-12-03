import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ClipboardList, 
  Activity, 
  Clock, 
  User, 
  FileText,
  BarChart3,
  LogOut,
  Lock,
  Key,
  ArrowRight,
  WifiOff
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyC4uMyrEpalzit58WraznEr7sEXn5lqLYY",
  authDomain: "saifee-park-security.firebaseapp.com",
  projectId: "saifee-park-security",
  storageBucket: "saifee-park-security.firebasestorage.app",
  messagingSenderId: "1076023360584",
  appId: "1:1076023360584:web:0b8881847acba1e6d26c7d",
  measurementId: "G-RBDCC77V6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'saifee-security'; 

// --- Components ---

// 1. New Access Portal
const AccessPortal = ({ onLogin }) => {
  const [portalMode, setPortalMode] = useState('selection'); 
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (inputValue === 'Saife3SecuX2026') {
      onLogin({ name: 'HQ Commander', role: 'admin' });
    } else {
      setError('Invalid Command Code');
    }
  };

  const handleLeaderLogin = (e) => {
    e.preventDefault();
    if (inputValue.trim().length > 2) {
      onLogin({ name: inputValue, role: 'leader' });
    } else {
      setError('Please enter a valid name (min 3 chars)');
    }
  };

  if (portalMode === 'selection') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
        <button 
            onClick={() => { setPortalMode('admin'); setInputValue(''); setError(''); }}
            className="absolute top-6 right-6 text-slate-700 hover:text-slate-400 transition-colors p-2"
            title="HQ Access"
        >
            <Lock className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="mx-auto bg-emerald-600/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-500/30">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Saifee Park Security</h1>
        </div>

        <div className="w-full max-w-md">
          <button 
            onClick={() => { setPortalMode('leader'); setInputValue(''); setError(''); }}
            className="w-full group relative bg-white rounded-2xl p-8 hover:bg-emerald-50 transition-all duration-300 text-left shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Patrol Logs</h3>
            <p className="text-slate-500 text-sm mb-6">Submit daily shift reports and patrol logs.</p>
            <span className="flex items-center text-emerald-700 font-semibold text-sm group-hover:gap-2 transition-all">
              Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className={`p-8 text-center ${portalMode === 'admin' ? 'bg-slate-800' : 'bg-emerald-600'}`}>
          <button 
            onClick={() => setPortalMode('selection')}
            className="absolute top-4 left-4 text-white/70 hover:text-white text-sm flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {portalMode === 'admin' ? <Lock className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {portalMode === 'admin' ? 'Enter Admin Access Code' : 'Member Identification'}
          </h1>
          <p className="text-white/80 text-sm mt-2">
            {portalMode === 'admin' ? '' : 'Enter your name to begin shift'}
          </p>
        </div>
        
        <form onSubmit={portalMode === 'admin' ? handleAdminLogin : handleLeaderLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {portalMode === 'admin' ? 'Access Code' : 'Full Name'}
            </label>
            <div className="relative">
              {portalMode === 'admin' ? (
                <Key className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              ) : (
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              )}
              <input 
                type={portalMode === 'admin' ? "password" : "text"}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:outline-none transition-all ${
                  portalMode === 'admin' ? 'focus:ring-blue-500' : 'focus:ring-emerald-500'
                }`}
                placeholder={portalMode === 'admin' ? "Required" : "e.g. Member Smith"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {error}</p>}
          </div>

          <button 
            type="submit" 
            className={`w-full text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              portalMode === 'admin' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
             {portalMode === 'admin' ? 'Unlock Dashboard' : 'Start Reporting'}
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className={`text-xs mt-2 ${color.replace('bg-', 'text-')}`}>{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

// 3. Report Form Component
const ReportForm = ({ user, currentUserProfile, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shiftTime: 'Standard Shift',
    patrolRounds: '',
    issuesObserved: '',
    guardNotes: '',
    incidentsReported: '',
    severity: 'Normal',
    status: 'Open'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalSeverity = formData.severity;
      if (formData.incidentsReported.length > 5 && formData.severity === 'Normal') {
        finalSeverity = 'High';
      }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'shift_reports'), {
        ...formData,
        leaderName: currentUserProfile.name,
        leaderRole: currentUserProfile.role,
        severity: finalSeverity,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        shiftTime: 'Standard Shift',
        patrolRounds: '',
        issuesObserved: '',
        guardNotes: '',
        incidentsReported: '',
        severity: 'Normal',
        status: 'Open'
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding report: ", error);
      alert("Note: Data might not save in Demo Mode or without permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          New Shift Report
        </h2>
        <span className="text-xs font-mono text-emerald-200 bg-slate-800 px-2 py-1 rounded border border-slate-700">
          MEMBER: {currentUserProfile.name.toUpperCase()}
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
          <input 
            type="date" 
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">1. Patrol Rounds Completed</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={formData.patrolRounds}
              onChange={(e) => setFormData({...formData, patrolRounds: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">2. Issues Observed</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={formData.issuesObserved}
              onChange={(e) => setFormData({...formData, issuesObserved: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">3. Guard Performance Notes</label>
            <textarea 
              rows="2"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={formData.guardNotes}
              onChange={(e) => setFormData({...formData, guardNotes: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-red-700 mb-2">4. Incidents Reported</label>
              <textarea 
                rows="3"
                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-red-300"
                value={formData.incidentsReported}
                onChange={(e) => setFormData({...formData, incidentsReported: e.target.value})}
              />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-semibold text-slate-800 mb-4">Risk Classification</label>
              <div className="space-y-3">
                {['Normal', 'High', 'Critical'].map((level) => (
                  <label key={level} className={`flex items-center p-3 border rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors ${level === 'Critical' ? 'hover:bg-red-50 border-red-100' : ''}`}>
                    <input 
                      type="radio" 
                      name="severity"
                      className={`w-4 h-4 ${level === 'Critical' ? 'text-red-600' : level === 'High' ? 'text-orange-500' : 'text-green-600'}`}
                      checked={formData.severity === level}
                      onChange={() => setFormData({...formData, severity: level})}
                    />
                    <div className="ml-3">
                      <span className={`block text-sm font-medium ${level === 'Critical' ? 'text-red-700' : 'text-slate-700'}`}>{level}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            Sign & Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// 4. Main Application
export default function App() {
  const [user, setUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null); 
  const [view, setView] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // Track auth errors

  // Auth
  useEffect(() => {
    // Basic anonymous auth
    signInAnonymously(auth).catch((err) => {
        console.error("Auth Error:", err);
        setAuthError(err.message);
    });
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Data Fetching
  useEffect(() => {
    if (!user) return;
    
    // Skip fetching if offline demo mode
    if (user.uid === 'offline-demo') {
        setReports([]);
        setLoading(false);
        return;
    }
    
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'shift_reports'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleStatus = async (reportId, currentStatus) => {
    if (currentProfile?.role !== 'admin') {
      alert("Permission Denied: Only HQ Commanders (Admins) can resolve incidents.");
      return;
    }
    const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
    const reportRef = doc(db, 'artifacts', appId, 'public', 'data', 'shift_reports', reportId);
    await updateDoc(reportRef, { status: newStatus });
  };

  const handleProfileLogin = (profile) => {
    setCurrentProfile(profile);
    if (profile.role === 'leader') setView('entry');
    else setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    setView('dashboard');
  };

  // --- RENDERING ERROR STATE ---
  if (authError) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-lg">
                <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" /> Configuration Error
                </h2>
                <p className="mt-4 text-slate-600">Authentication failed. This usually means <strong>Anonymous Authentication</strong> is not enabled in your Firebase Console.</p>
                <div className="mt-6 bg-slate-100 p-4 rounded text-sm overflow-x-auto">
                    <p className="font-mono text-xs text-slate-500 break-all">{authError}</p>
                </div>
                
                {/* Fallback button */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => { setAuthError(null); setUser({ uid: 'offline-demo', isAnonymous: true }); }}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <WifiOff className="w-4 h-4" />
                        Continue in Demo Mode
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-2">Allows you to view the app UI without backend connection.</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold text-sm text-slate-800">How to fix properly:</h3>
                    <ol className="list-decimal list-inside mt-2 text-sm text-slate-600 space-y-1">
                        <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-600 underline">Firebase Console</a> &gt; Build &gt; Authentication.</li>
                        <li>Click the <strong>Sign-in method</strong> tab.</li>
                        <li>Enable <strong>Anonymous</strong>.</li>
                    </ol>
                </div>
            </div>
        </div>
    )
  }

  if (!currentProfile) {
    return <AccessPortal onLogin={handleProfileLogin} />;
  }

  const totalReports = reports.length;
  const criticalIssues = reports.filter(r => r.severity === 'Critical' && r.status !== 'Resolved').length;
  const highIssues = reports.filter(r => r.severity === 'High' && r.status !== 'Resolved').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
  const criticalReports = reports.filter(r => (r.severity === 'Critical' || r.severity === 'High') && r.status !== 'Resolved');
  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <span className="font-bold text-xl tracking-tight">Saifee Park Security</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 p-1 rounded-lg flex items-center">
                
                {currentProfile.role === 'admin' && (
                  <button 
                    onClick={() => setView('dashboard')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}

                {currentProfile.role === 'leader' && (
                  <button 
                    onClick={() => setView('entry')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'entry' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">New Report</span>
                  </button>
                )}

                {currentProfile.role === 'admin' && (
                  <button 
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'list' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline">Logs</span>
                  </button>
                )}
              </div>

              <div className="h-8 w-px bg-slate-700 mx-2"></div>

              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Security Overview</h1>
                <p className="text-slate-500">Welcome, {currentProfile.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Critical Issues" value={criticalIssues} icon={AlertTriangle} color="bg-red-500" subtext="Requires immediate attention" />
              <StatCard title="Warnings / High Priority" value={highIssues} icon={Activity} color="bg-orange-500" subtext="Monitor closely" />
              <StatCard title="Total Reports Logged" value={totalReports} icon={ClipboardList} color="bg-blue-500" subtext="Across all shifts" />
              <StatCard title="Issues Resolved" value={resolvedCount} icon={CheckCircle} color="bg-green-500" subtext="Closed cases" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50 rounded-t-xl">
                    <h2 className="font-bold text-red-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Action Required ({criticalReports.length})
                    </h2>
                    {currentProfile.role === 'admin' && <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Admin Mode</span>}
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {criticalReports.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p>No critical issues pending. All clear!</p>
                      </div>
                    ) : (
                      criticalReports.map(report => (
                        <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                {report.severity.toUpperCase()}
                              </span>
                              <span className="ml-2 text-sm text-slate-500">{report.date}</span>
                            </div>
                            {currentProfile.role === 'admin' ? (
                              <button 
                                onClick={() => toggleStatus(report.id, report.status)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                Mark Resolved
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Reported to HQ</span>
                            )}
                          </div>
                          <div className="mb-4">
                            <h4 className="font-semibold text-slate-900 mb-1">Member: {report.leaderName}</h4>
                            {report.incidentsReported && (
                                <p className="text-slate-800 bg-red-50 p-3 rounded border border-red-100 mt-2 text-sm">
                                  <span className="font-bold text-red-700 block mb-1">Incident:</span>
                                  {report.incidentsReported}
                                </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Recent Activity
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {recentReports.map(report => (
                    <div key={report.id} className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className={`mt-1 min-w-[8px] h-2 rounded-full ${report.severity === 'Critical' ? 'bg-red-500' : report.severity === 'High' ? 'bg-orange-500' : 'bg-green-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{report.leaderName} filed report</p>
                        <p className="text-xs text-slate-500 mt-0.5 mb-1">{report.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'entry' && currentProfile.role === 'leader' && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <ReportForm user={user} currentUserProfile={currentProfile} onSuccess={() => setView('dashboard')} />
          </div>
        )}

        {view === 'list' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">All Shift Reports</h1>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Risk</th>
                      {currentProfile.role === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{report.status}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-500">{report.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{report.leaderName}</td>
                        <td className="px-6 py-4 text-sm"><span className={`${report.severity === 'Critical' ? 'text-red-600 font-bold' : report.severity === 'High' ? 'text-orange-600' : 'text-slate-500'}`}>{report.severity}</span></td>
                        {currentProfile.role === 'admin' && (
                          <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => toggleStatus(report.id, report.status)}>
                            {report.status === 'Resolved' ? 'Re-open' : 'Resolve'}
                          </td>
                        )}
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
  );
}