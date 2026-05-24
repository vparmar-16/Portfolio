import { useState, useEffect, useCallback } from "react";

const G = {
  bg: "#080807",
  surface: "#101010",
  border: "#1c1b19",
  accent: "#c8a050",
  cream: "#f0ebe0",
  muted: "#6b6660",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

const CATS = ["All", "Landscape", "Portrait", "Urban", "Nature"];

const PHOTOS = [
  { id: 1,  cat: "Landscape", w: 900, h: 600, seed: "volcanic15",   title: "Morning Mist",     loc: "Iceland" },
  { id: 2,  cat: "Portrait",  w: 600, h: 900, seed: "face64",       title: "Quiet Gaze",       loc: "Paris" },
  { id: 3,  cat: "Urban",     w: 900, h: 600, seed: "tokyo37",      title: "City Lines",       loc: "Tokyo" },
  { id: 4,  cat: "Nature",    w: 900, h: 600, seed: "bloom82",      title: "Wild Bloom",       loc: "Tuscany" },
  { id: 5,  cat: "Portrait",  w: 600, h: 900, seed: "portrait91",   title: "Golden Hour",      loc: "Barcelona" },
  { id: 6,  cat: "Landscape", w: 900, h: 600, seed: "fjord23",      title: "Open Waters",      loc: "Norway" },
  { id: 7,  cat: "Urban",     w: 900, h: 600, seed: "concrete47",   title: "Concrete Dreams",  loc: "New York" },
  { id: 8,  cat: "Nature",    w: 600, h: 900, seed: "forest55",     title: "Forest Still",     loc: "Oregon" },
  { id: 9,  cat: "Landscape", w: 900, h: 600, seed: "desert11",     title: "Dusk Roads",       loc: "Patagonia" },
  { id: 10, cat: "Portrait",  w: 600, h: 900, seed: "soft73",       title: "Soft Light",       loc: "Amsterdam" },
  { id: 11, cat: "Urban",     w: 900, h: 600, seed: "nightmkt29",   title: "Night Market",     loc: "Seoul" },
  { id: 12, cat: "Nature",    w: 900, h: 600, seed: "storm68",      title: "Storm Coming",     loc: "Scotland" },
  { id: 13, cat: "Landscape", w: 900, h: 600, seed: "alpine44",     title: "Above the Clouds", loc: "Swiss Alps" },
  { id: 14, cat: "Portrait",  w: 600, h: 900, seed: "shadow19",     title: "Half Shadow",      loc: "Havana" },
  { id: 15, cat: "Urban",     w: 900, h: 600, seed: "alley88",      title: "Side Street",      loc: "Lisbon" },
];

export default function Portfolio() {
  const [filter, setFilter]     = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [section, setSection]   = useState("work");
  const [loaded, setLoaded]     = useState({});

  const filtered = filter === "All" ? PHOTOS : PHOTOS.filter(p => p.cat === filter);

  const navigate = useCallback((dir) => {
    if (!lightbox) return;
    const idx = filtered.findIndex(p => p.id === lightbox.id);
    setLightbox(filtered[(idx + dir + filtered.length) % filtered.length]);
  }, [lightbox, filtered]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "Escape")      setLightbox(null);
      if (e.key === "ArrowRight")  navigate(1);
      if (e.key === "ArrowLeft")   navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, navigate]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const imgUrl = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  const lbIdx = lightbox ? filtered.findIndex(p => p.id === lightbox.id) : -1;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${G.bg}; }
        ::selection { background: ${G.accent}22; }
        .masonry { columns: 3 240px; column-gap: 6px; }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background: ${G.surface};
        }
        .masonry-item img {
          width: 100%;
          display: block;
          transition: transform 0.55s cubic-bezier(.25,.46,.45,.94);
          filter: brightness(0.92);
        }
        .masonry-item:hover img {
          transform: scale(1.06);
          filter: brightness(1);
        }
        .photo-cap {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 45%, transparent 70%);
          opacity: 0;
          transition: opacity 0.32s ease;
          display: flex; align-items: flex-end;
          padding: 18px;
        }
        .masonry-item:hover .photo-cap { opacity: 1; }
        .skeleton {
          position: absolute; inset: 0;
          background: ${G.surface};
          animation: shimmer 1.6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .nav-link {
          background: none; border: none; cursor: pointer;
          font-family: ${G.sans}; font-size: 12px; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: ${G.muted}; padding: 0;
          transition: color 0.2s;
        }
        .nav-link:hover { color: ${G.cream}; }
        .nav-link.on { color: ${G.cream}; }
        .filter-pill {
          background: none; border: none; cursor: pointer;
          font-family: ${G.sans}; font-size: 11px; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: ${G.muted}; padding: 14px 18px;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .filter-pill:hover { color: ${G.cream}; }
        .filter-pill.on { color: ${G.cream}; border-bottom-color: ${G.accent}; }
        .lb-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: none; border: 1px solid #1c1b19;
          color: ${G.muted}; cursor: pointer; font-size: 20px;
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
          transition: color 0.2s, border-color 0.2s;
        }
        .lb-arrow:hover { color: ${G.cream}; border-color: ${G.muted}; }
        .contact-row {
          display: flex; align-items: baseline; gap: 28px;
          padding: 16px 0; border-bottom: 1px solid #1c1b19;
        }
        .contact-row:first-child { border-top: 1px solid #1c1b19; }
        @media (max-width: 600px) {
          .masonry { columns: 2 140px; }
          header { padding: 0 20px !important; }
          .content-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: G.bg, color: G.cream, fontFamily: G.sans }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: G.bg, borderBottom: `1px solid ${G.border}`,
          padding: "0 48px", height: 58,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            className="nav-link on"
            style={{ fontFamily: G.serif, fontSize: 18, fontWeight: 300, letterSpacing: "0.04em", textTransform: "none" }}
            onClick={() => setSection("work")}
          >
            Alex Mercer
          </button>
          <nav style={{ display: "flex", gap: 36 }}>
            <button className={`nav-link ${section === "work" ? "on" : ""}`} onClick={() => setSection("work")}>Work</button>
            <button className={`nav-link ${section === "about" ? "on" : ""}`} onClick={() => setSection("about")}>About</button>
          </nav>
        </header>

        {section === "work" ? (
          <>
            {/* Hero */}
            <div className="content-pad" style={{ padding: "72px 48px 52px", borderBottom: `1px solid ${G.border}` }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: G.accent, marginBottom: 18 }}>
                Photography · {new Date().getFullYear()}
              </p>
              <h1 style={{
                fontFamily: G.serif, fontSize: "clamp(52px, 8vw, 100px)",
                fontWeight: 300, lineHeight: 1.0, color: G.cream, marginBottom: 28,
              }}>
                <em>Seeing</em> the world<br />differently.
              </h1>
              <p style={{ fontSize: 14, color: G.muted, maxWidth: 420, lineHeight: 1.85 }}>
                Landscapes, portraits, and quiet moments found between places — a visual journal spanning five continents.
              </p>
            </div>

            {/* Filters */}
            <div style={{ borderBottom: `1px solid ${G.border}`, display: "flex", paddingLeft: 30 }}>
              {CATS.map(cat => (
                <button key={cat} className={`filter-pill ${filter === cat ? "on" : ""}`} onClick={() => setFilter(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="content-pad" style={{ padding: "16px 16px 80px" }}>
              <div className="masonry">
                {filtered.map(photo => (
                  <div key={photo.id} className="masonry-item" onClick={() => setLightbox(photo)}>
                    {!loaded[photo.id] && (
                      <div className="skeleton" style={{ paddingBottom: `${(photo.h / photo.w) * 100}%` }} />
                    )}
                    <img
                      src={imgUrl(photo.seed, photo.w, photo.h)}
                      alt={photo.title}
                      loading="lazy"
                      onLoad={() => setLoaded(l => ({ ...l, [photo.id]: true }))}
                      style={{ opacity: loaded[photo.id] ? 1 : 0, transition: "opacity 0.4s" }}
                    />
                    <div className="photo-cap">
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: G.accent, marginBottom: 5 }}>
                          {photo.cat}
                        </div>
                        <div style={{ fontFamily: G.serif, fontSize: 19, fontStyle: "italic", color: G.cream, lineHeight: 1.1 }}>
                          {photo.title}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(240,235,224,0.45)", marginTop: 3 }}>
                          {photo.loc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* About */
          <div className="content-pad" style={{ maxWidth: 760, margin: "0 auto", padding: "80px 48px 100px" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: G.accent, marginBottom: 28 }}>
              About
            </p>
            <h2 style={{
              fontFamily: G.serif, fontSize: "clamp(36px, 5vw, 62px)",
              fontWeight: 300, lineHeight: 1.15, marginBottom: 44, color: G.cream,
            }}>
              Light is the medium.<br /><em>Patience is the craft.</em>
            </h2>
            <div style={{ color: "rgba(240,235,224,0.7)", lineHeight: 1.9, fontSize: 15, maxWidth: 580, display: "flex", flexDirection: "column", gap: 20 }}>
              <p>Based between New York and London, I work across landscape, portrait, and documentary photography — drawn to the moments just before and just after the obvious shot.</p>
              <p>My work has appeared in editorial publications and private collections across Europe and North America. I take on a small number of commissions each year to give each project the full attention it deserves.</p>
              <p>Available for editorial assignments, fine art prints, and select commercial projects.</p>
            </div>
            <div style={{ marginTop: 64 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: G.accent, marginBottom: 24 }}>
                Contact
              </p>
              {[
                ["Email",     "hello@alexmercer.photo"],
                ["Instagram", "@alexmercerphoto"],
                ["Location",  "New York / London"],
                ["For hire",  "Editorial · Fine Art · Commercial"],
              ].map(([label, val]) => (
                <div key={label} className="contact-row">
                  <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: G.muted, minWidth: 96 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 15, color: G.cream }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(4,4,3,0.97)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setLightbox(null)}
          >
            <button
              aria-label="Close lightbox"
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute", top: 20, right: 24,
                background: "none", border: "none", color: G.muted,
                cursor: "pointer", fontSize: 12, letterSpacing: "0.12em",
                fontFamily: G.sans, textTransform: "uppercase",
              }}
            >
              esc ✕
            </button>
            <div style={{
              position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)",
              fontSize: 11, letterSpacing: "0.15em", color: G.muted, fontFamily: G.sans,
            }}>
              {lbIdx + 1} / {filtered.length}
            </div>
            <button className="lb-arrow" style={{ left: 24 }} onClick={e => { e.stopPropagation(); navigate(-1); }}>‹</button>
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: "80vw", maxHeight: "85vh" }}>
              <img
                key={lightbox.seed}
                src={imgUrl(lightbox.seed, lightbox.w * 2, lightbox.h * 2)}
                alt={lightbox.title}
                style={{ maxWidth: "80vw", maxHeight: "78vh", objectFit: "contain", display: "block" }}
              />
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: G.accent }}>{lightbox.cat}</span>
                <span style={{ fontFamily: G.serif, fontSize: 21, fontStyle: "italic", color: G.cream }}>{lightbox.title}</span>
                <span style={{ fontSize: 12, color: G.muted }}>{lightbox.loc}</span>
              </div>
            </div>
            <button className="lb-arrow" style={{ right: 24 }} onClick={e => { e.stopPropagation(); navigate(1); }}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
