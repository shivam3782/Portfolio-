import { useEffect, useRef } from "react";
/** CSS perspective scene: no WebGL, canvas, autoplay or animation frame loop. */
export default function RetroScene() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const move = (event) => {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)")
        .matches ||
      navigator.connection?.saveData ||
      navigator.hardwareConcurrency < 4 ||
      document.documentElement.dataset.effects === "off"
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current.style.setProperty(
      "--tilt",
      `${(event.clientX - rect.left - rect.width / 2) / 70}deg`,
    );
  };
  return (
    <div
      className="retro-scene"
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current.style.setProperty("--tilt", "0deg")}
      role="img"
      aria-label="An isometric retro computer displaying a pixel mountain landscape and Ready to build"
    >
      <div className="scene-grid" />
      <div className="scene-orbit orbit-one" />
      <div className="scene-orbit orbit-two" />
      <span className="scene-spark spark-one">+</span>
      <span className="scene-spark spark-two">+</span>
      <div className="scene-machine">
        <div className="monitor">
          <div className="monitor-face">
            <div className="monitor-screen">
              <div className="screen-top">
                <span>SHIVAM.OS</span>
                <span>● ● ●</span>
              </div>
              <svg
                viewBox="0 0 300 170"
                aria-hidden="true"
                className="pixel-landscape"
              >
                <defs>
                  <linearGradient id="sunset" x2="0" y2="1">
                    <stop stopColor="#ffbb7d" />
                    <stop offset="1" stopColor="#ff985f" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="66" r="38" fill="url(#sunset)" />
                <g fill="#0f2630">
                  <path d="M0 97h20V79h20V62h20v17h20v18h20v18h20v55H0zM190 120V96h20V78h20V58h20v20h20v18h30v74H190z" />
                </g>
                <path
                  d="M0 140h20v-18h20v-18h20v18h20v18h20v-18h20v-18h20V86h20v18h20v18h20v18h20v-18h20v-18h20v18h20v18h20v30H0z"
                  fill="#377f79"
                />
                <path
                  d="M0 158h60v-12h60v-12h60v12h60v12h60v12H0z"
                  fill="#69ccbc"
                />
                <g fill="#cae6db">
                  <path d="M42 32h4v4h-4zM248 27h4v4h-4zM102 18h4v4h-4zM269 65h4v4h-4z" />
                </g>
              </svg>
              <span className="screen-title">
                READY TO
                <br />
                <b>BUILD_</b>
              </span>
              <div className="screen-bottom">IDEAS → USEFUL SOFTWARE</div>
            </div>
            <div className="monitor-chin">
              <span>s/</span>
              <span className="power-light" />
              <span className="monitor-slots">▥▥▥</span>
            </div>
          </div>
        </div>
        <div className="monitor-stand" />
        <div className="monitor-foot" />
        <div className="keyboard">
          <div className="keys">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="spacebar" />
        </div>
        <div className="cartridge">
          <span>
            BUILD
            <br />
            LEARN
            <br />
            <b>REPEAT</b>
          </span>
          <i />
        </div>
      </div>
    </div>
  );
}
