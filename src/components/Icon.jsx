const paths={
 search:'m21 21-5-5 M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16',
 chevron:'m8 10 4 4 4-4',plus:'M12 5v14M5 12h14',minus:'M5 12h14',
 undo:'M4 9h10a6 6 0 0 1 0 12M4 9l5-5M4 9l5 5',redo:'M20 9H10a6 6 0 0 0 0 12M20 9l-5-5M20 9l-5 5',
 plan:'M3 3h18v18H3zM3 12h8V3M11 16v5M16 12h5',
 cube:'m12 2 9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10',
 fit:'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5',
 download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
 upload:'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5',
 folder:'M3 6h7l2 3h9v12H3z',save:'M4 3h13l4 4v14H3V3h1M7 3v6h9V3M7 21v-8h10v8',
 present:'M3 3h18v13H3zM12 16v5m-5 0 5-5 5 5',
 cursor:'m5 3 14 10-7 1-3 7-4-18z',
 palette:'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4 2 2 0 0 1 1-4h3a3 3 0 0 0 3-3 9 9 0 0 0-9-7zM7 9h.01M10 6h.01M15 7h.01M6 13h.01',
 list:'M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01',
 sliders:'M4 7h16M4 17h16M8 4v6M16 14v6',
};
export default function Icon({name,size=18,...props}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d={paths[name]||paths.plan}/></svg>;}
export function GoogleIcon(){return <svg className="google-icon" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.17v5h6.61c3.87-3.57 6.08-8.84 6.08-14.67Z"/><path fill="#34A853" d="M24 44c5.5 0 10.11-1.82 13.48-4.87l-6.61-5c-1.83 1.23-4.17 1.97-6.87 1.97-5.31 0-9.82-3.58-11.43-8.4H5.75v5.16A20.36 20.36 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.57 27.7a12.16 12.16 0 0 1 0-7.4v-5.16H5.75a20 20 0 0 0 0 17.72l6.82-5.16Z"/><path fill="#EA4335" d="M24 11.9c3 0 5.67 1.03 7.8 3.06l5.85-5.85A19.66 19.66 0 0 0 24 4 20.36 20.36 0 0 0 5.75 15.14l6.82 5.16c1.61-4.82 6.12-8.4 11.43-8.4Z"/></svg>;}
