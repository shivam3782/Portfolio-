// Concept art accompanies missing previews; it never represents a product screenshot.
export default function ProjectIllustration({ name }) {
  const kind = /arnav/i.test(name) ? 'spatial' : /hangman/i.test(name) ? 'word' : /krushi/i.test(name) ? 'market' : /insurance/i.test(name) ? 'document' : /cultivate/i.test(name) ? 'yield' : /solar/i.test(name) ? 'solar' : 'system';
  return <div className={'project-illustration illustration-' + kind}>
    <span className="illustration-label mono">CONCEPT ILLUSTRATION / {kind === 'spatial' ? 'WAYFINDING' : kind === 'word' ? 'LEARN THROUGH PLAY' : kind === 'market' ? 'DIRECT CONNECTIONS' : kind === 'solar' ? 'ORBITAL EXPLORATION' : 'SYSTEM THINKING'}</span>
    <svg viewBox="0 0 640 380" aria-hidden="true">
      {kind === 'spatial' ? <>
        <g className="map-blocks" fill="none" stroke="currentColor"><path d="M60 95 250 40 440 150 250 210ZM250 210 440 150 580 235 392 295ZM60 95v120l190 110 142-30M250 210v115M440 150v120M60 215l190-55 190 110M125 76l190 110M190 57l190 110M125 253l190-55M190 290l190-55" /></g>
        <path d="m154 175 96 55 91-27 90 51" fill="none" stroke="var(--art-accent)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="154" cy="175" rx="20" ry="11" fill="var(--art-accent)" opacity=".2" /><circle cx="154" cy="175" r="7" fill="var(--art-accent)" />
        <path d="M431 230c-29-35-27-46-27-52a27 27 0 0 1 54 0c0 13-9 27-27 52Z" fill="var(--art-accent)" /><circle cx="431" cy="177" r="8" fill="var(--art-bg)" />
        <g fill="currentColor" className="art-mono"><text x="82" y="343">START</text><text x="468" y="235">DESTINATION</text><text x="266" y="90">A NEW WAY THROUGH.</text></g>
      </> : kind === 'word' ? <>
        <g fill="none" stroke="currentColor" strokeWidth="2"><path d="M98 268h98M128 268V101h99v29" /><circle cx="227" cy="151" r="21" /><path d="M227 172v52m0-30-27 18m27-18 26 18m-26 12-21 29m21-29 21 29" /></g>
        <text x="320" y="124" className="art-mono" fill="currentColor">A LITTLE PLAY.</text><text x="320" y="147" className="art-mono" fill="currentColor">A LOT TO LEARN.</text>
        <g fill="none" stroke="var(--art-accent)" strokeWidth="2"><rect x="320" y="183" width="49" height="58" rx="5" /><rect x="380" y="183" width="49" height="58" rx="5" /><rect x="440" y="183" width="49" height="58" rx="5" /><rect x="500" y="183" width="49" height="58" rx="5" /></g>
        <text x="331" y="225" className="word-letters" fill="var(--art-accent)">D</text><text x="392" y="225" className="word-letters" fill="var(--art-accent)">B</text><path d="M451 224h26m35 0h26" stroke="var(--art-accent)" strokeWidth="3" />
        <text x="320" y="286" className="art-mono" fill="currentColor">PYTHON / PYGAME / SQLITE</text>
      </> : kind === 'market' ? <>
        <g fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="320" cy="198" rx="212" ry="110" /><ellipse cx="320" cy="198" rx="155" ry="77" strokeDasharray="4 8" /><path d="M105 198h430" strokeDasharray="3 8" /></g>
        <g transform="translate(126 164)" stroke="var(--art-accent)" fill="var(--art-bg)" strokeWidth="3"><path d="M-25 25V-3L0-22 25-3v28ZM-35-3 0-30 35-3M-6 25V8H8v17" /></g>
        <g transform="translate(507 164)" stroke="var(--art-accent)" fill="var(--art-bg)" strokeWidth="3"><path d="M-27-8h54l-6 39h-42ZM-13-8v-6a13 13 0 0 1 26 0v6" /></g>
        <circle cx="320" cy="198" r="54" fill="var(--art-accent)" /><path d="M320 227v-59m0 32c-29 0-31-26-31-26 29 0 31 15 31 26m0-14c29 0 31-26 31-26-29 0-31 15-31 26" stroke="var(--art-bg)" strokeWidth="3" fill="none" />
        <g fill="currentColor" className="art-mono"><text x="93" y="256">FARMER</text><text x="472" y="256">CONSUMER</text><text x="242" y="52">CLOSER TO THE SOURCE.</text></g>
      </> : kind === 'document' ? <>
        <g fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="146" y="72" width="168" height="230" rx="9" /><path d="M174 112h110m-110 26h92m-92 26h110m-110 26h79m-79 26h104m-104 26h88" /></g>
        <rect x="259" y="167" width="236" height="112" rx="15" fill="var(--art-bg)" stroke="var(--art-accent)" strokeWidth="2" /><path d="m280 279-15 21 43-21" fill="var(--art-bg)" stroke="var(--art-accent)" strokeWidth="2" /><path d="M287 199h177m-177 21h148m-148 21h114" stroke="var(--art-accent)" strokeWidth="3" strokeLinecap="round" />
        <text x="350" y="102" className="art-mono" fill="currentColor">COMPLEX POLICY.</text><text x="350" y="125" className="art-mono" fill="currentColor">CLEARER ANSWERS.</text>
      </> : kind === 'yield' ? <>
        <g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M130 190h380" strokeDasharray="4 7" /><rect x="70" y="135" width="130" height="110" rx="12" /><rect x="255" y="135" width="130" height="110" rx="12" /><rect x="440" y="135" width="130" height="110" rx="12" /></g>
        <g stroke="var(--art-accent)" fill="none" strokeWidth="3"><ellipse cx="135" cy="171" rx="24" ry="9" /><path d="M111 171v32c0 12 48 12 48 0v-32m-48 17c0 12 48 12 48 0M303 173l-17 17 17 17m34-34 17 17-17 17m-8-41-13 49M488 213v-19m17 19v-39m17 39v-29" /></g>
        <g className="art-mono" fill="currentColor"><text x="99" y="277">CROP DATA</text><text x="267" y="277">ML PIPELINE</text><text x="454" y="277">PREDICTION</text><text x="196" y="80">FROM DATA TO INSIGHT.</text></g>
      </> : kind === 'solar' ? <>
        <g fill="none" stroke="currentColor"><ellipse cx="320" cy="190" rx="100" ry="40" transform="rotate(-25 320 190)" /><ellipse cx="320" cy="190" rx="180" ry="75" transform="rotate(-25 320 190)" /><ellipse cx="320" cy="190" rx="260" ry="110" transform="rotate(-25 320 190)" /></g><circle cx="320" cy="190" r="43" fill="var(--art-accent)" /><circle cx="166" cy="225" r="13" fill="currentColor" /><circle cx="539" cy="128" r="20" fill="currentColor" /><circle cx="242" cy="163" r="6" fill="currentColor" /><text x="70" y="330" fill="currentColor" className="art-mono">A STUDY IN PERSPECTIVE.</text>
      </> : <>
        <g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M160 190h320M320 100v180" strokeDasharray="5 6" /><rect x="260" y="130" width="120" height="120" rx="15" /><rect x="107" y="163" width="54" height="54" rx="8" /><rect x="480" y="163" width="54" height="54" rx="8" /></g><path d="m304 170-20 20 20 20m32-40 20 20-20 20m-10-49-12 58" fill="none" stroke="var(--art-accent)" strokeWidth="4" /><text x="211" y="317" className="art-mono" fill="currentColor">AN IDEA, ENGINEERED.</text>
      </>}
    </svg>
  </div>;
}

