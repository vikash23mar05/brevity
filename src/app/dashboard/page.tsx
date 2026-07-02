'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setShortening(true);
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: newUrl, customAlias: customAlias || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten url');
      }
      
      setNewUrl('');
      setCustomAlias('');
      fetchLinks(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to shorten url:', err);
    } finally {
      setShortening(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="flex items-center justify-between px-12 h-16 bg-white border-b border-[#f0f0f0] sticky top-0 z-10">
        <Link href="/" className="text-[14px] font-extrabold tracking-[0.12em] uppercase text-black no-underline">
          Brevity
        </Link>
        <div className="flex gap-6 items-center">
          <span className="text-[13px] font-semibold text-black">Dashboard</span>
          <Link href="/analytics" className="text-[13px] font-medium text-[#555] hover:text-black">Analytics</Link>
          <div className="w-[1px] h-4 bg-[#e8e8e8]"></div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-[13px] font-bold text-[#555] hover:text-black bg-transparent border-none cursor-pointer">
              Log out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto pt-16 px-12 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-[32px] font-extrabold text-black mb-1.5 tracking-[-0.02em]">Your Links</h1>
            <p className="text-[14px] text-[#555]">Manage and track your shortened URLs.</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full max-w-[400px]">
            <form onSubmit={handleShorten} className="flex border-2 border-black rounded-[7px] overflow-hidden focus-within:border-[#2233ee] transition-colors bg-white w-full">
              <input 
                type="url" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Paste long URL..." 
                required
                disabled={shortening}
                className="flex-1 text-[13px] px-4 py-2.5 border-none outline-none text-black placeholder-[#bbb] bg-transparent"
              />
              <button 
                type="submit" 
                disabled={shortening}
                className="text-[12px] font-bold text-white bg-black border-none px-5 cursor-pointer tracking-[0.06em] hover:bg-[#2233ee] transition-colors disabled:opacity-50"
              >
                {shortening ? '...' : 'CREATE'}
              </button>
            </form>
            
            <div className="flex items-center bg-white border border-[#e8e8e8] rounded-[6px] overflow-hidden">
              <span className="text-[12px] font-semibold text-[#999] bg-[#f9f9f9] px-3 py-2 border-r border-[#e8e8e8]">brevity.com/</span>
              <input 
                type="text" 
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="custom-alias (optional)" 
                disabled={shortening}
                className="flex-1 text-[12px] px-3 py-2 border-none outline-none text-black placeholder-[#bbb] bg-transparent"
              />
            </div>
            {error && <p className="text-[11px] font-bold text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e8] rounded-[10px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-[14px] text-[#555]">Loading your links...</div>
          ) : links.length === 0 ? (
            <div className="p-12 text-center text-[14px] text-[#555]">You haven't shortened any links yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  <th className="py-4 px-6 text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase font-sans">Short Link</th>
                  <th className="py-4 px-6 text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase font-sans hidden sm:table-cell">Original URL</th>
                  <th className="py-4 px-6 text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase font-sans text-right">Clicks</th>
                  <th className="py-4 px-6 text-[11px] font-bold tracking-[0.08em] text-[#999] uppercase font-sans text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link._id} className="border-b border-[#f4f4f4] hover:bg-[#fafafa] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-black no-underline hover:text-[#2233ee]">
                          brevity.com/{link.shortCode}
                        </a>
                        <button 
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${link.shortCode}`)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#f0f0f0] rounded-[5px] text-[#555] hover:bg-[#e0e0e0] hover:text-black transition-all cursor-pointer border-none flex items-center justify-center"
                          title="Copy to clipboard"
                        >
                          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-none stroke-current stroke-[2px]"><path d="M8 7v10a2 2 0 002 2h6m-6-14h6a2 2 0 012 2v10a2 2 0 01-2 2h-6a2 2 0 01-2-2V7a2 2 0 012-2z" /><path d="M16 7V5a2 2 0 00-2-2h-6a2 2 0 00-2 2v10a2 2 0 002 2h2" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <div className="text-[13px] text-[#777] whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]">
                        {link.originalUrl}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block bg-[#f4f4f4] px-2.5 py-1 rounded-[5px] text-[12px] font-bold text-black border border-[#e8e8e8]">
                        {link.clicks}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-[13px] font-medium text-[#999]">
                        {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
