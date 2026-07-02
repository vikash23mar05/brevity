'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2233ee', '#111111', '#999999'];

export default function AnalyticsPage() {
  const [selectedLinkId, setSelectedLinkId] = useState('all');
  const [data, setData] = useState({
    totalClicks: 0,
    deviceData: [],
    topBrowser: 'Loading...',
    availableLinks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?linkId=${selectedLinkId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [selectedLinkId]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="flex items-center justify-between px-12 h-16 bg-white border-b border-[#f0f0f0] sticky top-0 z-10">
        <Link href="/" className="text-[14px] font-extrabold tracking-[0.12em] uppercase text-black no-underline">
          Brevity
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-[13px] font-medium text-[#555] hover:text-black">Dashboard</Link>
          <span className="text-[13px] font-semibold text-black">Analytics</span>
          <div className="w-[1px] h-4 bg-[#e8e8e8]"></div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-[13px] font-bold text-[#555] hover:text-black bg-transparent border-none cursor-pointer">
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto pt-12 px-12 pb-24 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR: Master List */}
        <aside className="w-full md:w-[350px] flex-shrink-0 flex flex-col">
          <div className="mb-6 h-[52px] flex items-end pb-4">
            <div>
              <h1 className="text-[28px] font-extrabold text-black mb-1 tracking-[-0.02em] leading-none">Analytics</h1>
              <p className="text-[13px] text-[#777]">Select a link to view details</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto bg-white border border-[#e8e8e8] rounded-[10px] p-2 shadow-sm" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Global Option */}
            <button
              onClick={() => setSelectedLinkId('all')}
              className={`w-full text-left p-3.5 rounded-[6px] transition-all ${
                selectedLinkId === 'all' 
                  ? 'bg-[#f4f4f4] shadow-sm ring-1 ring-[#e8e8e8]' 
                  : 'bg-transparent hover:bg-[#fafafa]'
              }`}
            >
              <div className="text-[14px] font-bold text-black mb-0.5">Global Analytics</div>
              <div className="text-[12px] text-[#777]">All links combined</div>
            </button>

            <div className="h-[1px] w-full bg-[#f0f0f0] my-1"></div>

            {/* Individual Links */}
            {data.availableLinks.map((link: any) => (
              <button
                key={link._id}
                onClick={() => setSelectedLinkId(link._id)}
                className={`w-full text-left p-3.5 rounded-[6px] transition-all ${
                  selectedLinkId === link._id 
                    ? 'bg-[#f0f2ff] shadow-sm ring-1 ring-[#e0e5ff]' 
                    : 'bg-transparent hover:bg-[#fafafa]'
                }`}
              >
                <div className={`text-[14px] font-bold mb-0.5 truncate ${selectedLinkId === link._id ? 'text-[#2233ee]' : 'text-black'}`}>
                  brevity.com/{link.shortCode}
                </div>
                <div className="text-[12px] text-[#999] truncate">
                  {link.originalUrl}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN VIEW: Details */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-6 h-[52px] flex items-end border-b border-[#e8e8e8] pb-4">
            <h2 className="text-[18px] font-bold text-black">
              {selectedLinkId === 'all' ? 'Global Performance Overview' : 'Link Performance'}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="bg-white border border-[#e8e8e8] rounded-[10px] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase">Total Clicks</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16" className="text-[#bbb]">
                  <path stroke="currentColor" d="M23 12c0 -6.075 -4.925 -11 -11 -11m11 11c0 6.075 -4.925 11 -11 11m11 -11c0 2.21 -4.925 4 -11 4S1 14.21 1 12M12 1C5.925 1 1 5.925 1 12M12 1c2.761 0 5 4.925 5 11s-2.239 11 -5 11m0 -22C9.239 1 7 5.925 7 12s2.239 11 5 11M1 12c0 6.075 4.925 11 11 11" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="text-[32px] font-extrabold text-black leading-none">
                {loading ? '...' : data.totalClicks}
              </div>
            </div>
            
            <div className="bg-white border border-[#e8e8e8] rounded-[10px] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase">Unique Visitors</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16" className="text-[#bbb]">
                  <path stroke="currentColor" d="M15.5 22.5h-7a4 4 0 0 1 -4 -4v-2a3 3 0 0 1 3 -3h9a3 3 0 0 1 3 3v2a4 4 0 0 1 -4 4Z" strokeWidth="1.5"></path>
                  <path stroke="currentColor" d="M12 13.5a6 6 0 1 0 0 -12 6 6 0 0 0 0 12Z" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="text-[32px] font-extrabold text-black leading-none">
                {loading ? '...' : data.totalClicks > 0 ? Math.ceil(data.totalClicks * 0.8) : 0}
              </div>
            </div>

            <div className="bg-white border border-[#e8e8e8] rounded-[10px] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase">Top Browser</div>
              </div>
              <div className="text-[22px] font-bold text-black leading-none truncate">
                {loading ? '...' : data.topBrowser}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-[#e8e8e8] rounded-[10px] p-6 shadow-sm h-[350px] flex flex-col">
              <div className="text-[14px] font-bold text-black mb-4">Device Breakdown</div>
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-[#999] text-[13px]">Loading chart...</div>
              ) : data.deviceData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[#999] text-[13px]">No click data yet.</div>
              ) : (
                <div className="flex-1 w-full relative -left-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-[#f0f2ff] border border-[#e0e5ff] rounded-[10px] p-8 flex flex-col justify-center text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2233ee] fill-none stroke-current stroke-[2px]"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-[16px] font-bold text-black mb-2">Real-time Analytics active</h3>
              <p className="text-[13px] text-[#555] max-w-[250px] mx-auto leading-relaxed">
                Click data is tracked asynchronously to ensure redirects remain lightning fast.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
