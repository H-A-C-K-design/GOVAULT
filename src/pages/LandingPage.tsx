import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Search, 
  Building2, 
  BarChart3, 
  ShieldAlert, 
  ArrowRight, 
  Cloud, 
  LogIn,
  Workflow,
  UserPlus
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-gov-500 selection:text-white">
      <Navbar />

      <section className="relative pt-16 pb-24 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-navy-900 to-slate-950 border-b border-slate-800">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gov-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left pt-2"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gov-900/80 border border-gov-700/60 text-gov-300 text-xs font-semibold shadow-inner">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL ENTERPRISE PLATFORM FOR GOVERNMENT OFFICES</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Smart Digital <br />
                <span className="bg-gradient-to-r from-gov-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Documentation System
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Securely digitize, manage, track, and retrieve official government documents, departmental records, and approval workflows from one centralized digital infrastructure.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 hover:from-gov-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-gov-950/50 border border-gov-400/30 transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <LogIn className="w-5 h-5 text-gov-400" />
                  <span>Officer Login</span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" /> HTTPS Port 443
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gov-400" /> Firestore Database Sync
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Immutable Audit Logs
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-left hidden sm:block">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gov-400">STATE GOVERNANCE DIRECTORY</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">LIVE FIRESTORE DATABASE</span>
                </div>
                <p className="text-xs text-slate-400">
                  Officer user profiles, authentication sessions, and document revision logs are securely managed on Cloud Infrastructure.
                </p>
              </div>
            </motion.div>

            {/* Enterprise Governance Showcase Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-6"
            >
              <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 border border-gov-500/30 shadow-2xl backdrop-blur-xl space-y-6">
                
                {/* Official Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/gov_logo.png" 
                      alt="Government Seal" 
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-md bg-slate-950 p-0.5" 
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                        <span>Government of India</span>
                        <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">Official Seal</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Smart Digital Documentation System</p>
                    </div>
                  </div>
                </div>

                {/* Platform Pillars */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-gov-600/30 text-gov-300 shrink-0 border border-gov-500/30 mt-0.5">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Encrypted Document Vault</h4>
                      <p className="text-[11px] text-slate-300">HTTPS Port 443 restricted socket with AES-256 binary document encryption.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-300 shrink-0 border border-indigo-500/30 mt-0.5">
                      <Workflow className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Department Sign-off Workflows</h4>
                      <p className="text-[11px] text-slate-300">Multi-stage review, verification, and digital authorization workflows.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-purple-600/30 text-purple-300 shrink-0 border border-purple-500/30 mt-0.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Immutable Audit Trail</h4>
                      <p className="text-[11px] text-slate-300">Append-only audit logs capturing officer actions, uploads, and approvals.</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Portal CTAs */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 hover:from-gov-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all border border-gov-400/30 flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Officer Sign In</span>
                  </Link>

                  <Link
                    to="/register"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4 text-gov-400" />
                    <span>Register New Officer</span>
                  </Link>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gov-400">SYSTEM CAPABILITIES</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">Built for High-Accountability Government Workflows</h3>
            <p className="text-sm text-slate-400">
              GovDoc replaces slow paper filing with secure cloud storage, automated approvals, and role-restricted document access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Digital Document Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized storage for official Circulars, Policies, Orders, Gazettes, and Reports with PDF/DOCX metadata taggings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Secure Officer Access</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-stage officer onboarding requiring admin verification before granting access to confidential files.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Department Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated department channels for Revenue, Health, Municipal, PWD, Education, Agriculture, and Finance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Fast Search & Retrieval</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant search across document numbers, title tags, departments, officer names, and priority levels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <Workflow className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Structured Approval Workflow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-tier approval pipeline from Officer creation to Reviewer audit and Department Head sign-off.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white">Immutable Audit Trails</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Append-only log recording logins, uploads, views, downloads, approvals, and role updates for 100% accountability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <Cloud className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Secure Cloud Storage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Firebase Storage rules preventing public write access and enforcing strict MIME/size validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gov-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gov-900 text-gov-300 flex items-center justify-center border border-gov-700">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Analytics Dashboard</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time visual charts tracking department document output, approval velocity, and registration trends.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="workflow" className="py-20 bg-slate-950 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">DOCUMENT LIFECYCLE</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">Standardized Document Movement Flow</h3>
            <p className="text-sm text-slate-400">Every document moves through a transparent, audited 5-step lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold text-sm flex items-center justify-center mx-auto">1</div>
              <h4 className="font-bold text-sm text-white">Upload</h4>
              <p className="text-[11px] text-slate-400">Officer attaches document file with metadata and confidentiality tags.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold text-sm flex items-center justify-center mx-auto">2</div>
              <h4 className="font-bold text-sm text-white">Verify</h4>
              <p className="text-[11px] text-slate-400">System checks file MIME type, size limits, and security permissions.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold text-sm flex items-center justify-center mx-auto">3</div>
              <h4 className="font-bold text-sm text-white">Process</h4>
              <p className="text-[11px] text-slate-400">Department reviewer inspects content, requests revisions or remarks.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold text-sm flex items-center justify-center mx-auto">4</div>
              <h4 className="font-bold text-sm text-white">Approve</h4>
              <p className="text-[11px] text-slate-400">Authorized approver grants digital sign-off. Status updated to Approved.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto">5</div>
              <h4 className="font-bold text-sm text-white">Archive</h4>
              <p className="text-[11px] text-slate-400">Document version stored securely with permanent audit log record.</p>
            </div>

          </div>
        </div>
      </section>

      <section id="security" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>SECURE-BY-DEFAULT ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Strict Compliance with Government Security Guidelines</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                GovDoc is constructed assuming only <strong>TCP Port 443</strong> is publicly exposed. All internal backend databases and cloud storage operate over encrypted HTTPS channels.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">HTTPS / TLS Exclusively (Port 443):</strong> No unencrypted HTTP port 80, SSH, FTP, or open database ports exposed publicly.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Role-Based Access Control (RBAC):</strong> Granular rules for Super Admin, Department Admin, Officer, and Reviewer.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Firestore & Storage Security Rules:</strong> No public read/write permissions allowed. File upload limits strictly enforced.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span>PORT 443 AUDIT STATUS</span>
                <span className="text-emerald-400 font-bold">PASSED 100%</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-300">HTTPS Encryption (TLS v1.3):</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Public Port 80 / FTP / SSH:</span>
                  <span className="text-rose-400 font-bold">Blocked / Disabled</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Firebase App Check Protocol:</span>
                  <span className="text-emerald-400 font-bold">Enforced</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-300">Frontend Admin Key Secrets:</span>
                  <span className="text-emerald-400 font-bold">Zero Exposed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-gov-400 uppercase tracking-wider block mb-1">Documents Managed</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">1,179+</span>
              <span className="text-[10px] text-slate-500 block mt-1">(Sample Demo System Registry)</span>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Active Departments</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">6</span>
              <span className="text-[10px] text-slate-500 block mt-1">(State Secretariats)</span>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Registered Officers</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">306</span>
              <span className="text-[10px] text-slate-500 block mt-1">(Verified Cadres)</span>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Approval Velocity</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">99.4%</span>
              <span className="text-[10px] text-slate-500 block mt-1">(On-Time Sign Off)</span>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-gov-400" />
              <span className="font-bold text-base text-white">GovDoc System</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Official enterprise digital document management platform for government offices, secretariat departments, and public administration.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">System Links</h5>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white transition-colors">Officer Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Officer Registration</Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors">System Infrastructure Status</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Security & Legal</h5>
            <ul className="space-y-2">
              <li><a href="#security" className="hover:text-white transition-colors">HTTPS Port 443 Standard</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Privacy & Data Governance Policy</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Audit Logging Regulations</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Helpdesk & Secretariat</h5>
            <p className="text-slate-400">State Central Secretariat, Block A</p>
            <p className="text-slate-400 mt-1">Official Support Email: helpdesk@gov.in</p>
            <p className="text-slate-400 mt-1">Toll Free: 1800-11-GOVDOC</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 Smart Digital Documentation System (GovDoc). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px] text-emerald-500">TLS v1.3 • Port 443 Protected</p>
        </div>
      </footer>

    </div>
  );
};
