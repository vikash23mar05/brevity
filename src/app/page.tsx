'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const introRef = useRef<HTMLDivElement>(null);
  const brandNameRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const curtainWrapperRef = useRef<HTMLDivElement>(null);
  
  const [showIntro, setShowIntro] = useState(true);
  
  // State for the URL shortener form
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    
    if (!url) return;

    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(`${window.location.origin}/${data.shortCode}`);
      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If user has already seen the intro in this session, skip it (optional UX improvement)
    // For now, let's run it every time they hit the landing page for demonstration.
    const runIntro = async () => {
      const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

      if (!brandNameRef.current || !cursorRef.current || !curtainWrapperRef.current || !introRef.current) return;

      const letters = brandNameRef.current.querySelectorAll('.brand-letter');
      const LETTER_COUNT = letters.length;

      // Phase 0: Short black hold
      await wait(150);

      // Phase 1: Brand name fades in
      letters.forEach(l => {
        (l as HTMLElement).style.transition = 'color 0.2s ease';
        (l as HTMLElement).style.color = '#282828';
      });
      await wait(180);

      // Phase 2: Scan
      cursorRef.current.style.opacity = '1';
      cursorRef.current.style.position = 'absolute';
      cursorRef.current.style.top = '50%';
      cursorRef.current.style.transform = 'translateY(-50%)';

      const containerLeft = brandNameRef.current.getBoundingClientRect().left;

      const placeAt = (idx: number) => {
        const target = idx < LETTER_COUNT ? letters[idx] : letters[LETTER_COUNT - 1];
        const rect = target.getBoundingClientRect();
        const viewportX = idx < LETTER_COUNT ? rect.left : rect.right;
        if (cursorRef.current) {
          cursorRef.current.style.left = (viewportX - containerLeft) + 'px';
        }
      };

      const SCAN_DURATION = 350;
      const STEP_MS = SCAN_DURATION / LETTER_COUNT;

      placeAt(0);
      await wait(30);

      for (let i = 0; i < LETTER_COUNT; i++) {
        (letters[i] as HTMLElement).style.transition = 'color 0.03s linear';
        (letters[i] as HTMLElement).style.color = '#ffffff';
        placeAt(i + 1);
        await wait(STEP_MS);
      }

      // Phase 3: Blinks
      await wait(100);
      cursorRef.current.style.opacity = '0';
      await wait(90);
      cursorRef.current.style.opacity = '1';
      await wait(60);

      // Phase 4: Cursor disappears
      cursorRef.current.style.transition = 'opacity 0.08s';
      cursorRef.current.style.opacity = '0';
      await wait(120);

      // Phase 5: Curtain in
      curtainWrapperRef.current.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)';
      curtainWrapperRef.current.style.transform = 'translateX(0%)';

      await wait(300);
      brandNameRef.current.style.opacity = '0';
      await wait(470);

      // Phase 6: Curtain out
      curtainWrapperRef.current.style.transition = 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)';
      curtainWrapperRef.current.style.transform = 'translateX(100%)';
      await wait(750);

      // Phase 7: Remove
      introRef.current.style.transition = 'opacity 0.15s';
      introRef.current.style.opacity = '0';
      await wait(160);
      setShowIntro(false);
    };

    runIntro();
  }, []);

  return (
    <>
      {/* LANDING PAGE CONTENT */}
      <div className="fixed inset-0 bg-white overflow-y-auto z-0">
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-12 h-16 bg-white z-10 border-b border-[#f0f0f0]">
          <div className="text-[14px] font-extrabold tracking-[0.12em] uppercase text-black">Brevity</div>
          <ul className="flex gap-8 list-none m-0 p-0">
            <li><a href="#" className="text-[13px] font-medium text-[#555] hover:text-black transition-colors">Features</a></li>
            <li><a href="#" className="text-[13px] font-medium text-[#555] hover:text-black transition-colors">Analytics</a></li>
            <li><a href="#" className="text-[13px] font-medium text-[#555] hover:text-black transition-colors">Pricing</a></li>
            <li><a href="#" className="text-[13px] font-medium text-[#555] hover:text-black transition-colors">Docs</a></li>
          </ul>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-[13px] font-semibold text-black bg-transparent border-[1.5px] border-[#ddd] px-[22px] py-[9px] rounded-[7px] hover:border-black transition-colors">Log in</Link>
            <Link href="/register" className="text-[13px] font-bold text-white bg-[#2233ee] px-[22px] py-[9px] rounded-[7px] hover:bg-[#1122cc] transition-colors border-[1.5px] border-[#2233ee]">Get Started</Link>
          </div>
        </nav>

        <main className="pt-40 px-12 pb-20 max-w-[920px]">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#2233ee] uppercase mb-7">URL Shortener + Analytics</p>
          <h1 className="text-[clamp(44px,6.5vw,92px)] font-extrabold leading-[1.01] text-black tracking-[-0.03em] mb-7">
            Shorten links.<br/>Track everything.
          </h1>
          <p className="text-[18px] text-[#555] leading-[1.65] max-w-[500px] mb-12">
            BREVITY turns long URLs into sharp short links — with Redis-cached
            redirects, real-time analytics, and JWT-protected dashboards.
          </p>
          
          <form onSubmit={handleShorten} className="flex max-w-[560px] border-2 border-black rounded-[9px] overflow-hidden focus-within:border-[#2233ee] transition-colors">
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..." 
              required
              disabled={loading}
              className="flex-1 text-[15px] p-4 border-none outline-none text-black bg-white placeholder-[#bbb] disabled:bg-[#f9f9f9]"
            />
            <button 
              type="submit"
              disabled={loading}
              className="text-[13px] font-bold text-white bg-black border-none px-7 cursor-pointer tracking-[0.06em] hover:bg-[#2233ee] transition-colors disabled:opacity-50"
            >
              {loading ? 'SHORTENING...' : 'SHORTEN →'}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-3 font-semibold">{error}</p>}
          
          {shortUrl && (
            <div className="mt-4 p-4 bg-[#f0f2ff] border border-[#2233ee] rounded-[9px] max-w-[560px] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.05em] text-[#2233ee] uppercase mb-1">Your short link is ready:</p>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-[16px] font-extrabold text-black hover:underline">
                  {shortUrl}
                </a>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="text-[12px] font-bold text-[#2233ee] bg-white border border-[#2233ee] px-4 py-2 rounded-[6px] hover:bg-[#2233ee] hover:text-white transition-colors"
              >
                COPY
              </button>
            </div>
          )}
        </main>

        <div className="flex gap-14 px-12 pt-16 pb-10 border-t border-[#eee] mt-16">
          <div>
            <div className="text-[38px] font-extrabold text-black tracking-[-0.03em]">1M+</div>
            <div className="text-[12px] font-medium text-[#999] mt-1.5">Links shortened</div>
          </div>
          <div>
            <div className="text-[38px] font-extrabold text-black tracking-[-0.03em]">&lt;5ms</div>
            <div className="text-[12px] font-medium text-[#999] mt-1.5">Avg. redirect time</div>
          </div>
          <div>
            <div className="text-[38px] font-extrabold text-black tracking-[-0.03em]">99.9%</div>
            <div className="text-[12px] font-medium text-[#999] mt-1.5">Uptime SLA</div>
          </div>
          <div>
            <div className="text-[38px] font-extrabold text-black tracking-[-0.03em]">Base62</div>
            <div className="text-[12px] font-medium text-[#999] mt-1.5">Collision-free codes</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1px] bg-[#eee] mx-12 mb-20 border border-[#eee]">
          <div className="bg-white p-11">
            <div className="w-[38px] h-[38px] bg-[#2233ee] rounded-[9px] mb-5 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            </div>
            <div className="text-[15px] font-bold text-black mb-2.5">Redis-Cached Redirects</div>
            <div className="text-[13px] text-[#777] leading-[1.65]">Cache-aside pattern with configurable TTL. Sub-millisecond hits after the first request.</div>
          </div>
          <div className="bg-white p-11">
            <div className="w-[38px] h-[38px] bg-[#2233ee] rounded-[9px] mb-5 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div className="text-[15px] font-bold text-black mb-2.5">Real SQL Analytics</div>
            <div className="text-[13px] text-[#777] leading-[1.65]">GROUP BY + date_trunc aggregation. Daily buckets, top referrers, device breakdown.</div>
          </div>
          <div className="bg-white p-11">
            <div className="w-[38px] h-[38px] bg-[#2233ee] rounded-[9px] mb-5 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div className="text-[15px] font-bold text-black mb-2.5">JWT Auth + Rate Limiting</div>
            <div className="text-[13px] text-[#777] leading-[1.65]">bcrypt passwords, HS256 tokens, Redis fixed-window limiter — 10 links/hour per user.</div>
          </div>
        </div>
      </div>

      {/* INTRO OVERLAY */}
      {showIntro && (
        <div ref={introRef} className="fixed inset-0 bg-black z-[1000] flex items-center justify-center overflow-hidden">
          <div ref={brandNameRef} id="brand-name" className="flex items-center select-none relative z-10 transition-opacity">
            {['B', 'R', 'E', 'V', 'I', 'T', 'Y'].map((letter, i) => (
              <span key={i} className="brand-letter text-[clamp(32px,4.5vw,60px)] font-extrabold tracking-[0.20em] text-[#222] leading-none inline-block">
                {letter}
              </span>
            ))}
            <div ref={cursorRef} className="inline-block w-[clamp(16px,2.2vw,30px)] h-[clamp(28px,4vw,54px)] bg-[#2233ee] opacity-0 align-middle shrink-0" />
          </div>

          <div ref={curtainWrapperRef} className="absolute inset-0 flex -translate-x-full z-0 will-change-transform">
            <div className="flex-1 h-full bg-[#8899ff]"></div>
            <div className="flex-1 h-full bg-[#5566ee]"></div>
            <div className="flex-1 h-full bg-[#3344ee]"></div>
            <div className="flex-1 h-full bg-[#1a28cc]"></div>
            <div className="flex-1 h-full bg-[#0d18aa]"></div>
          </div>
        </div>
      )}
    </>
  );
}
