import { useState, useEffect, useCallback } from "react";

const G = {
  white:  "#eeeeee",
  off:    "#dddddd",
  border: "#cccccc",
  ink:    "#1a1a1a",
  muted:  "#aaaaaa",
  sans:   "'Poppins', system-ui, sans-serif",
  body:   "'DM Sans', system-ui, sans-serif",
};

const PHOTOS = [
  { id:1,  cat:"Events",    w:900, h:600, seed:"event01",   title:"Grad Night"      },
  { id:2,  cat:"Concerts",  w:900, h:600, seed:"concert22", title:"Main Stage"      },
  { id:3,  cat:"Portraits", w:600, h:900, seed:"port44",    title:"Sam"             },
  { id:4,  cat:"Events",    w:900, h:600, seed:"event55",   title:"Frosh Week"      },
  { id:5,  cat:"Concerts",  w:900, h:600, seed:"concert77", title:"Sold Out"        },
  { id:6,  cat:"Portraits", w:600, h:900, seed:"port88",    title:"Golden Hour"     },
  { id:7,  cat:"General",   w:900, h:600, seed:"gen11",     title:"Sunday Market"   },
  { id:8,  cat:"Events",    w:900, h:600, seed:"event33",   title:"Prom 2025"       },
  { id:9,  cat:"Portraits", w:600, h:900, seed:"port99",    title:"Anya"            },
  { id:10, cat:"Concerts",  w:900, h:600, seed:"concert44", title:"Festival Season" },
  { id:11, cat:"General",   w:900, h:600, seed:"gen66",     title:"City Light"      },
  { id:12, cat:"Events",    w:900, h:600, seed:"event88",   title:"Club Night"      },
  { id:13, cat:"Portraits", w:600, h:900, seed:"port22",    title:"Marcus"          },
  { id:14, cat:"Concerts",  w:900, h:600, seed:"concert11", title:"Front Row"       },
  { id:15, cat:"General",   w:600, h:900, seed:"gen33",     title:"Evening Walk"    },
];

const CONTACT = [
  ["Email",     "parmarvishva2015@gmail.com"],
  ["Instagram", "@vip_vish_"],
  ["Location",  "San Diego, CA"],
];

export default function Portfolio() {
  const [lightbox,  setLightbox]  = useState(null);
  const [loaded,    setLoaded]    = useState({});
  const [contact,   setContact]   = useState(false);

  const navigate = useCallback((dir) => {
    if (!lightbox) return;
    const idx = PHOTOS.findIndex(p => p.id === lightbox.id);
    setLightbox(PHOTOS[(idx + dir + PHOTOS.length) % PHOTOS.length]);
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const h = (e) => {
      if (e.key === "Escape")     setLightbox(null);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft")  navigate(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox, navigate]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  // Close contact panel when clicking outside
  useEffect(() => {
    if (!contact) return;
    const h = (e) => {
      if (!e.target.closest(".contact-panel") && !e.target.closest(".contact-trigger"))
        setContact(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [contact]);

  const imgUrl = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${G.white}; }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media(max-width:760px){ .grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:460px){ .grid { grid-template-columns: 1fr; } }

        .card {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: ${G.off};
        }
        .card img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.48s cubic-bezier(.25,.46,.45,.94);
        }
        .card:hover img { transform: scale(1.05); }
        .card-cap {
          position: absolute; inset: 0; border-radius: 10px;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.24s ease;
          display: flex; align-items: flex-end; padding: 14px;
        }
        .card:hover .card-cap { opacity: 1; }

        .lb-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.18);
          color: #fff; cursor: pointer; border-radius: 50%;
          width: 44px; height: 44px; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s;
        }
        .lb-arrow:hover { background: rgba(255,255,255,0.22); }

        .contact-trigger {
          background: none; border: 1.5px solid ${G.border};
          border-radius: 999px; cursor: pointer;
          font-family: ${G.body}; font-size: 13px; font-weight: 500;
          color: ${G.muted}; padding: 6px 16px;
          transition: all 0.16s ease;
        }
        .contact-trigger:hover,
        .contact-trigger.open {
          border-color: ${G.ink}; color: ${G.ink};
        }

        .contact-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: ${G.white}; border: 1px solid ${G.border};
          border-radius: 14px; padding: 22px 24px;
          min-width: 240px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          animation: pop 0.18s cubic-bezier(.34,1.56,.64,1);
          z-index: 100;
        }
        @keyframes pop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        @media(max-width:600px){
          header { padding: 0 16px !important; }
          .pad   { padding: 0 10px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:G.white, fontFamily:G.body, color:G.ink }}>

        {/* ── Header ── */}
        <header style={{
          position:"sticky", top:0, zIndex:50,
          background:"rgba(255,255,255,0.92)", backdropFilter:"blur(10px)",
          borderBottom:`1px solid ${G.border}`,
          padding:"0 28px", height:54,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <span style={{ fontFamily:G.sans, fontSize:15, fontWeight:700, letterSpacing:"-0.01em" }}>
            Vishva Parmar
          </span>

          {/* Contact trigger + panel */}
          <div style={{ position:"relative" }}>
            <button
              className={`contact-trigger${contact?" open":""}`}
              onClick={() => setContact(c => !c)}
            >
              Contact
            </button>

            {contact && (
              <div className="contact-panel">
                <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:G.muted, marginBottom:16 }}>
                  Get in touch
                </p>
                {CONTACT.map(([label, val]) => (
                  <div key={label} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:G.muted, marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:500, color:G.ink }}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── Grid ── */}
        <div className="pad" style={{ padding:"12px 12px 64px" }}>
          <div className="grid">
            {PHOTOS.map(photo => {
              const tall = photo.w < photo.h;
              return (
                <div
                  key={photo.id}
                  className="card"
                  style={{ gridRow: tall ? "span 2" : "span 1", aspectRatio: tall ? "2/3" : "3/2" }}
                  onClick={() => setLightbox(photo)}
                >
                  {!loaded[photo.id] && (
                    <div style={{ position:"absolute", inset:0, background:G.off, borderRadius:10 }} />
                  )}
                  <img
                    src={imgUrl(photo.seed, photo.w, photo.h)}
                    alt={photo.title}
                    loading="lazy"
                    onLoad={() => setLoaded(l => ({ ...l, [photo.id]: true }))}
                    style={{ opacity: loaded[photo.id] ? 1 : 0, transition:"opacity 0.35s" }}
                  />
                  <div className="card-cap">
                    <span style={{ fontFamily:G.sans, fontSize:14, fontWeight:500, color:"#fff" }}>
                      {photo.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Lightbox ── */}
        {lightbox && (
          <div
            role="dialog" aria-modal="true"
            style={{
              position:"fixed", inset:0, zIndex:200,
              background:"rgba(8,8,8,0.96)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} style={{
              position:"absolute", top:18, right:22,
              background:"none", border:"none", color:"rgba(255,255,255,0.4)",
              cursor:"pointer", fontSize:12, letterSpacing:"0.1em",
              textTransform:"uppercase", fontFamily:G.body,
            }}>esc ✕</button>

            <span style={{
              position:"absolute", top:22, left:"50%", transform:"translateX(-50%)",
              fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:G.body,
            }}>
              {PHOTOS.findIndex(p => p.id === lightbox.id) + 1} / {PHOTOS.length}
            </span>

            <button className="lb-arrow" style={{ left:18 }}
              onClick={e => { e.stopPropagation(); navigate(-1); }}>‹</button>

            <div onClick={e => e.stopPropagation()} style={{ maxWidth:"84vw", maxHeight:"88vh" }}>
              <img
                key={lightbox.seed}
                src={imgUrl(lightbox.seed, lightbox.w * 2, lightbox.h * 2)}
                alt={lightbox.title}
                style={{
                  maxWidth:"84vw", maxHeight:"84vh",
                  objectFit:"contain", display:"block", borderRadius:10,
                }}
              />
              <div style={{ marginTop:12, textAlign:"center" }}>
                <span style={{ fontSize:15, fontFamily:G.sans, fontWeight:500, color:"rgba(255,255,255,0.8)" }}>
                  {lightbox.title}
                </span>
              </div>
            </div>

            <button className="lb-arrow" style={{ right:18 }}
              onClick={e => { e.stopPropagation(); navigate(1); }}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
