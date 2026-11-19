import { useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// Original vector workstation: no canvas, external models, or render loop.
export default function EngineeringScene() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [mode, setMode] = useState('build');
  const move = event => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current.style.setProperty('--scene-x', (((event.clientX - rect.left) / rect.width - .5) * 7) + 'deg');
    ref.current.style.setProperty('--scene-y', (((event.clientY - rect.top) / rect.height - .5) * -7) + 'deg');
  };
  const reset = () => {
    ref.current?.style.setProperty('--scene-x', '0deg');
    ref.current?.style.setProperty('--scene-y', '0deg');
  };
  return <div className="engineering-scene" ref={ref} onPointerMove={move} onPointerLeave={reset}>
    <div className="scene-caption mono"><span><i />THE WORKBENCH</span><span aria-hidden="true" className="scene-file">{mode === 'build' ? 'JS' : 'PY'}</span></div>
    <div className="scene-perspective">
      <svg className="workstation" viewBox="0 0 600 500" role="img" aria-labelledby="workstation-title workstation-desc">
        <title id="workstation-title">Shivam’s digital workbench</title><desc id="workstation-desc">An original illustration of a code workstation and an orange robot assistant. Switch between build and explore for another view.</desc>
        <defs>
          <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--scene-panel)" /><stop offset="1" stopColor="var(--scene-dark)" /></linearGradient>
          <linearGradient id="robot" x1="0" x2="1" y2="1"><stop stopColor="#ffd1a2" /><stop offset="1" stopColor="#ef8546" /></linearGradient>
          <radialGradient id="scene-glow"><stop stopColor="var(--accent)" stopOpacity=".15" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
          <pattern id="scene-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="var(--scene-line)" strokeWidth=".6" /></pattern>
        </defs>
        <circle cx="310" cy="238" r="235" fill="url(#scene-glow)" />
        <g fill="none" stroke="var(--scene-line)" strokeWidth="1"><circle cx="306" cy="236" r="202" /><circle cx="306" cy="236" r="244" strokeDasharray="3 9" /><path d="M30 236h540M306 8v468" strokeDasharray="3 8" /></g>
        <path d="M48 338 302 200 566 346 307 488Z" fill="url(#scene-grid)" opacity=".7" />
        <path d="m95 340 200-111 221 122-206 114Z" fill="url(#desk)" stroke="var(--scene-line)" /><path d="m95 340 215 115 206-104v10L310 477 95 350Z" fill="var(--scene-dark)" stroke="var(--scene-line)" />
        <path d="m282 303 38 21v49l-38-20Z" fill="var(--scene-panel)" stroke="var(--scene-line)" /><path d="m247 373 55-30 65 36-55 30Z" fill="var(--scene-panel)" stroke="var(--scene-line)" />
        <g transform="translate(158 96) skewY(6)">
          <rect width="302" height="218" rx="13" fill="var(--scene-panel)" stroke="var(--scene-line)" strokeWidth="2" />
          <rect x="11" y="11" width="280" height="183" rx="6" fill="var(--scene-dark)" />
          <path d="M11 42h280M51 42v152" stroke="var(--scene-line)" />
          <g fill="#ff9b61"><circle cx="24" cy="27" r="3" /><circle cx="35" cy="27" r="3" opacity=".5" /><circle cx="46" cy="27" r="3" opacity=".3" /></g>
          <text x="68" y="30" className="scene-small">{mode === 'build' ? 'a-little-curiosity.js' : 'explore.py'}</text>
          <g className="scene-code" fontSize="12"><text x="24" y="68" className="scene-small">01</text><text x="24" y="94" className="scene-small">02</text><text x="24" y="120" className="scene-small">03</text><text x="24" y="146" className="scene-small">04</text>
            <text x="66" y="69" fill="#ffb080">{mode === 'build' ? 'const developer = {' : 'def explore(idea):'}</text>
            <text x="81" y="95" fill="#e0e7ef">{mode === 'build' ? 'name: "Shivam",' : '  ask_questions()'}</text>
            <text x="81" y="121" fill="#92ded0">{mode === 'build' ? 'mindset: "keep building"' : '  build_something(idea)'}</text>
            <text x="66" y="147" fill="#ffb080">{mode === 'build' ? '};' : '  return learn()'}</text>
          </g>
          <path d="M67 170h133" stroke="var(--scene-line)" strokeWidth="4" strokeLinecap="round" /><circle cx="151" cy="205" r="3" fill="var(--accent)" />
        </g>
        <path d="m204 367 78-43 90 49-78 43Z" fill="var(--scene-dark)" stroke="var(--scene-line)" /><g stroke="var(--scene-line)" strokeWidth="3"><path d="m221 366 58-31m-44 39 58-31m-44 39 58-31m-44 39 58-31m-42 39 58-31" /></g>
        <g className="scene-robot" transform="translate(77 247)"><ellipse cx="35" cy="105" rx="36" ry="12" fill="#000" opacity=".18" /><path d="M23 83v17h13V83m11 0v17h13V83" stroke="#db7741" strokeWidth="8" strokeLinejoin="round" /><rect x="13" y="51" width="55" height="37" rx="13" fill="url(#robot)" /><path d="M10 65 1 79m69-15 11 10M40 10V0" stroke="#ffad76" strokeWidth="8" strokeLinecap="round" /><circle cx="40" cy="0" r="5" fill="#6ddacb" /><rect x="0" y="12" width="80" height="53" rx="17" fill="url(#robot)" /><rect x="9" y="22" width="62" height="31" rx="9" fill="#15212b" /><g className="scene-eyes" fill="#9ce9da"><rect x="22" y="31" width="9" height="10" rx="4" /><rect x="48" y="31" width="9" height="10" rx="4" /></g><path d="M33 47h13" stroke="#9ce9da" strokeWidth="2" strokeLinecap="round" /><path d="M35 70h10" stroke="#15212b" strokeWidth="3" strokeLinecap="round" /></g>
        <g transform="translate(417 362)"><path d="m0 0 25-14L49 0 24 14Z" fill="var(--scene-panel)" stroke="var(--scene-line)" /><path d="M0 0v25l24 14V14m0 25 25-14V0" fill="var(--scene-dark)" stroke="var(--scene-line)" /><path d="M25-14v-28m0 11c-18 0-20-17-20-17 17 0 20 8 20 17m0-4c17 0 20-17 20-17-17 0-20 8-20 17" fill="#427f73" stroke="#7ecdbb" /></g>
        <g stroke="var(--accent)" fill="var(--accent)"><path d="M491 85h14m-7-7v14M105 170h10m-5-5v10" /><circle cx="479" cy="273" r="3" /><circle cx="302" cy="35" r="4" /></g>
      </svg>
    </div>
    <div className="scene-controls"><span className="mono">Workbench mode</span><div role="group" aria-label="Workbench illustration mode">{['build', 'explore'].map(item => <button key={item} aria-pressed={mode === item} onClick={() => setMode(item)}>{item === 'build' ? 'Build' : 'Explore'}</button>)}</div></div>
  </div>;
}

