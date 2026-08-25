import { useState, useEffect, useCallback, useRef } from "react";

const G = {
  white:  "#eeeeee",
  off:    "#dddddd",
  border: "#cccccc",
  muted:  "#bbbbbb",
  accent: "#aaaaaa",
  ink:    "#1a1a1a",
  sans:   "'Poppins', system-ui, sans-serif",
  body:   "'DM Sans', system-ui, sans-serif",
};

// ─────────────────────────────────────────────
//  YOUR PHOTOS
//  1. Drop image files into the public/photos/ folder
//  2. Fill in the filename below (e.g. "my-photo.jpg")
//  3. Set portrait: true for tall/vertical photos
//  4. Set highlight: true to show it on the front page
//  5. Set cat to whichever album it belongs to:
// ─────────────────────────────────────────────
const PHOTOS = [
  { id:1,  src:"/photos/DSC07594.jpg", cat:"Events",   title:"LilyPichu @ TGEX",  portrait:false, highlight:true  },
  { id:2,  src:"/photos/DSC08157.jpg", cat:"Events",   title:"VA Panel @ TGEX",   portrait:false, highlight:true },
  { id:3,  src:"/photos/DSC08421.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:4,  src:"/photos/DSC09313.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:5,  src:"/photos/DSC09334.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:6,  src:"/photos/DSC09421.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:7,  src:"/photos/DSC09484.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:8,  src:"/photos/DSC09518.jpg", cat:"Events",   title:"",                  portrait:false, highlight:true },
  { id:9,  src:"/photos/DSC03967.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:10, src:"/photos/DSC03989.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:11, src:"/photos/DSC04033.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:12, src:"/photos/DSC04034.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:13, src:"/photos/DSC04039.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:14, src:"/photos/DSC04044.jpg", cat:"Concerts", title:"",                  portrait:false, highlight:true },
  { id:15, src:"/photos/DSC06993.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:16, src:"/photos/DSC07005.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:17, src:"/photos/DSC07047.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:18, src:"/photos/DSC07054.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:19, src:"/photos/DSC07092.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:20, src:"/photos/DSC07095.jpg", cat:"Portraits", title:"",                 portrait:true,  highlight:true },
  { id:21, src:"/photos/IMG_1260.jpg", cat:"Assorted",  title:"",                  portrait:false, highlight:true },
  { id:22, src:"/photos/IMG_1395.jpg", cat:"Assorted",  title:"",                  portrait:false, highlight:true },
];

// ─────────────────────────────────────────────
//  YOUR ALBUMS
//  Add or remove album names here.
//  The name in DEFAULT_NAMES is the starting label
//  (you can rename them live on the site too).
// ─────────────────────────────────────────────
const ALBUM_KEYS   = ["Events", "Singles", "Concert", "Assorted"];
const DEFAULT_NAMES = { Events:"Events", Concerts:"Concerts", Portraits:"Portraits", General:"General" };

// ─────────────────────────────────────────────
//  YOUR CONTACT INFO
// ─────────────────────────────────────────────
const CONTACT = [
  ["Email",     "parmarvishva2015@gmail.com"],
  ["Instagram", "@vip_vish_"],
  ["Location",  "San Diego, CA"],
];

// ── internals ────────────────────────────────

const loadNames = () => {
  try { const s = localStorage.getItem("vp_album_names"); return s ? {...DEFAULT_NAMES,...JSON.parse(s)} : DEFAULT_NAMES; }
  catch { return DEFAULT_NAMES; }
};

// Placeholder shown when an image hasn't been added yet
function ImgPlaceholder({ portrait }) {
  return (
    <div style={{
      width:"100%", height:"100%", minHeight: portrait ? 280 : 180,
      background:G.off, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:8,
      color:G.muted, fontSize:12, fontFamily:G.body,
    }}>
      <span style={{ fontSize:28 }}>📷</span>
      <span>Drop photo in<br/>public/photos/</span>
    </div>
  );
}

function PhotoCard({ photo, onClick, loaded, onLoad }) {
  const [errored, setErrored] = useState(false);
  const tall = photo.portrait;
  return (
    <div
      className="card"
      style={{ gridRow:tall?"span 2":"span 1", aspectRatio:tall?"2/3":"3/2" }}
      onClick={onClick}
    >
      {!loaded && !errored && <div style={{ position:"absolute", inset:0, background:G.off, borderRadius:10 }} />}
      {errored
        ? <ImgPlaceholder portrait={tall} />
        : (
          <img
            src={photo.src}
            alt={photo.title}
            loading="lazy"
            onLoad={onLoad}
            onError={() => setErrored(true)}
            style={{ opacity:loaded?1:0, transition:"opacity 0.35s" }}
          />
        )
      }
      {!errored && (
        <div className="card-cap">
          <span style={{ fontFamily:G.sans, fontSize:14, fontWeight:500, color:"#fff" }}>
            {photo.title}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [page,       setPage]       = useState("highlights");
  const [albumNames, setAlbumNames] = useState(loadNames);
  const [editKey,    setEditKey]    = useState(null);
  const [draftName,  setDraftName]  = useState("");
  const [lightbox,   setLightbox]   = useState(null);
  const [loaded,     setLoaded]     = useState({});
  const [contact,    setContact]    = useState(false);
  const inputRef = useRef(null);

  const isAlbumPage  = page.startsWith("album:");
  const currentKey   = isAlbumPage ? page.replace("album:","") : null;
  const displayPhotos = page === "highlights"
    ? PHOTOS.filter(p => p.highlight)
    : isAlbumPage ? PHOTOS.filter(p => p.cat === currentKey) : [];

  const navigate = useCallback((dir) => {
    if (!lightbox) return;
    const idx = displayPhotos.findIndex(p => p.id === lightbox.id);
    setLightbox(displayPhotos[(idx + dir + displayPhotos.length) % displayPhotos.length]);
  }, [lightbox, displayPhotos]);

  useEffect(() => {
    if (!lightbox) return;
    const h = e => {
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

  useEffect(() => {
    if (!contact) return;
    const h = e => { if (!e.target.closest(".cp") && !e.target.closest(".ct")) setContact(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [contact]);

  useEffect(() => { if (editKey && inputRef.current) inputRef.current.focus(); }, [editKey]);

  const startEdit = key => { setEditKey(key); setDraftName(albumNames[key]); };
  const saveEdit  = () => {
    if (!editKey) return;
    const name = draftName.trim() || albumNames[editKey];
    const next = { ...albumNames, [editKey]: name };
    setAlbumNames(next);
    try { localStorage.setItem("vp_album_names", JSON.stringify(next)); } catch {}
    setEditKey(null);
  };

  const lbIdx = lightbox ? displayPhotos.findIndex(p => p.id === lightbox.id) : -1;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${G.white}; }

        .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:720px){ .grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:440px){ .grid { grid-template-columns:1fr; } }

        .albums-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(max-width:500px){ .albums-grid { grid-template-columns:1fr; } }

        .card {
          cursor:pointer; position:relative; overflow:hidden;
          border-radius:10px; background:${G.off};
        }
        .card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.48s cubic-bezier(.25,.46,.45,.94); }
        .card:hover img { transform:scale(1.05); }
        .card-cap {
          position:absolute; inset:0; border-radius:10px;
          background:linear-gradient(to top,rgba(0,0,0,0.52) 0%,transparent 50%);
          opacity:0; transition:opacity 0.24s ease;
          display:flex; align-items:flex-end; padding:14px;
        }
        .card:hover .card-cap { opacity:1; }

        .album-card {
          cursor:pointer; position:relative; overflow:hidden;
          border-radius:12px; background:${G.off}; aspect-ratio:4/3;
        }
        .album-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.45s ease; }
        .album-card:hover img { transform:scale(1.04); }
        .album-cover {
          position:absolute; inset:0; border-radius:12px;
          background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.1) 55%,transparent 75%);
          display:flex; align-items:flex-end; padding:18px;
        }

        .nav-link {
          background:none; border:none; cursor:pointer;
          font-family:${G.body}; font-size:13px; font-weight:500;
          color:${G.muted}; padding:0; transition:color 0.16s;
        }
        .nav-link:hover { color:${G.ink}; }
        .nav-link.on { color:${G.ink}; font-weight:600; }

        .ct {
          background:none; border:1.5px solid ${G.border}; border-radius:999px;
          cursor:pointer; font-family:${G.body}; font-size:13px; font-weight:500;
          color:${G.muted}; padding:6px 16px; transition:all 0.16s;
        }
        .ct:hover, .ct.open { border-color:${G.ink}; color:${G.ink}; }

        .cp {
          position:absolute; top:calc(100% + 10px); right:0;
          background:${G.white}; border:1px solid ${G.border}; border-radius:14px;
          padding:22px 24px; min-width:240px;
          box-shadow:0 8px 32px rgba(0,0,0,0.1);
          animation:pop 0.18s cubic-bezier(.34,1.56,.64,1); z-index:100;
        }
        @keyframes pop {
          from { opacity:0; transform:translateY(-6px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .editable-title {
          font-family:${G.sans}; font-size:clamp(32px,6vw,56px);
          font-weight:700; color:${G.ink}; letter-spacing:-0.02em;
          border:none; background:none; outline:none;
          border-bottom:2px dashed ${G.border}; width:100%;
          cursor:text; display:block; padding:2px 0;
        }
        .editable-title:focus { border-bottom-color:${G.accent}; }

        .lb-arrow {
          position:absolute; top:50%; transform:translateY(-50%);
          background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.18);
          color:#fff; cursor:pointer; border-radius:50%;
          width:44px; height:44px; font-size:20px;
          display:flex; align-items:center; justify-content:center;
          transition:background 0.18s;
        }
        .lb-arrow:hover { background:rgba(255,255,255,0.22); }

        .back-btn {
          background:none; border:none; cursor:pointer;
          font-family:${G.body}; font-size:13px; color:${G.muted};
          display:flex; align-items:center; gap:5px; padding:0; transition:color 0.16s;
        }
        .back-btn:hover { color:${G.ink}; }

        @media(max-width:600px){
          header { padding:0 16px !important; }
          .pad   { padding:0 10px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:G.white, fontFamily:G.body, color:G.ink }}>

        {/* Header */}
        <header style={{
          position:"sticky", top:0, zIndex:50,
          background:"rgba(238,238,238,0.92)", backdropFilter:"blur(10px)",
          borderBottom:`1px solid ${G.border}`,
          padding:"0 28px", height:54,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <span style={{ fontFamily:G.sans, fontSize:15, fontWeight:700, letterSpacing:"-0.01em", cursor:"pointer" }}
            onClick={()=>setPage("highlights")}>
            Vishva Parmar
          </span>
          <nav style={{ display:"flex", alignItems:"center", gap:28 }}>
            <button className={`nav-link ${page==="highlights"?"on":""}`} onClick={()=>setPage("highlights")}>Highlights</button>
            <button className={`nav-link ${page==="albums"||isAlbumPage?"on":""}`} onClick={()=>setPage("albums")}>Albums</button>
            <div style={{ position:"relative" }}>
              <button className={`ct${contact?" open":""}`} onClick={()=>setContact(c=>!c)}>Contact</button>
              {contact && (
                <div className="cp">
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:G.muted, marginBottom:16 }}>Get in touch</p>
                  {CONTACT.map(([label,val])=>(
                    <div key={label} style={{ marginBottom:14 }}>
                      <div style={{ fontSize:11, color:G.muted, marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:14, fontWeight:500, color:G.ink }}>{val}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Highlights */}
        {page === "highlights" && (
          <div className="pad" style={{ padding:"20px 12px 64px" }}>
            <div style={{ padding:"8px 4px 20px" }}>
              <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:G.muted }}>Highlights</p>
            </div>
            <div className="grid">
              {displayPhotos.map(photo => (
                <PhotoCard
                  key={photo.id} photo={photo}
                  loaded={!!loaded[photo.id]}
                  onLoad={()=>setLoaded(l=>({...l,[photo.id]:true}))}
                  onClick={()=>setLightbox(photo)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Albums list */}
        {page === "albums" && (
          <div className="pad" style={{ padding:"20px 12px 64px" }}>
            <div style={{ padding:"8px 4px 20px" }}>
              <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:G.muted }}>Albums</p>
            </div>
            <div className="albums-grid">
              {ALBUM_KEYS.map(key => {
                const cover = PHOTOS.find(p => p.cat === key);
                const count = PHOTOS.filter(p => p.cat === key).length;
                return (
                  <div key={key} className="album-card" onClick={()=>setPage(`album:${key}`)}>
                    <img src={cover?.src} alt={albumNames[key]}
                      onError={e=>{ e.target.style.display="none"; }} />
                    <div className="album-cover">
                      <div>
                        <div style={{ fontFamily:G.sans, fontSize:20, fontWeight:700, color:"#fff", lineHeight:1.2 }}>
                          {albumNames[key]}
                        </div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:4 }}>
                          {count} photos
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Album detail */}
        {isAlbumPage && (
          <div className="pad" style={{ padding:"28px 12px 64px" }}>
            <div style={{ padding:"0 4px 24px" }}>
              <button className="back-btn" onClick={()=>setPage("albums")} style={{ marginBottom:20 }}>
                ← Albums
              </button>
              {editKey === currentKey ? (
                <>
                  <input
                    ref={inputRef}
                    className="editable-title"
                    value={draftName}
                    onChange={e=>setDraftName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={e=>{ if(e.key==="Enter") saveEdit(); if(e.key==="Escape") setEditKey(null); }}
                    maxLength={40}
                  />
                  <p style={{ fontSize:11, color:G.muted, marginTop:6 }}>↵ Enter to save · Esc to cancel</p>
                </>
              ) : (
                <div style={{ display:"inline-flex", alignItems:"center", gap:10, cursor:"text" }}
                  onClick={()=>startEdit(currentKey)} title="Click to rename">
                  <h1 style={{ fontFamily:G.sans, fontSize:"clamp(32px,6vw,56px)", fontWeight:700, color:G.ink, letterSpacing:"-0.02em" }}>
                    {albumNames[currentKey]}
                  </h1>
                  <span style={{ fontSize:12, color:G.muted, userSelect:"none", marginTop:4 }}>✏️</span>
                </div>
              )}
              <p style={{ fontSize:13, color:G.muted, marginTop:6 }}>{displayPhotos.length} photos</p>
            </div>
            <div className="grid">
              {displayPhotos.map(photo => (
                <PhotoCard
                  key={photo.id} photo={photo}
                  loaded={!!loaded[photo.id]}
                  onLoad={()=>setLoaded(l=>({...l,[photo.id]:true}))}
                  onClick={()=>setLightbox(photo)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div role="dialog" aria-modal="true"
            style={{
              position:"fixed", inset:0, zIndex:200,
              background:"rgba(8,8,8,0.96)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
            onClick={()=>setLightbox(null)}
          >
            <button onClick={()=>setLightbox(null)} style={{
              position:"absolute", top:18, right:22, background:"none", border:"none",
              color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12,
              letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:G.body,
            }}>esc ✕</button>

            <span style={{
              position:"absolute", top:22, left:"50%", transform:"translateX(-50%)",
              fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:G.body,
            }}>{lbIdx+1} / {displayPhotos.length}</span>

            <button className="lb-arrow" style={{ left:18 }}
              onClick={e=>{ e.stopPropagation(); navigate(-1); }}>‹</button>

            <div onClick={e=>e.stopPropagation()} style={{ maxWidth:"84vw", maxHeight:"88vh" }}>
              <img
                key={lightbox.src}
                src={lightbox.src}
                alt={lightbox.title}
                style={{ maxWidth:"84vw", maxHeight:"82vh", objectFit:"contain", display:"block", borderRadius:10 }}
              />
              <div style={{ marginTop:12, textAlign:"center" }}>
                <span style={{ fontSize:15, fontFamily:G.sans, fontWeight:500, color:"rgba(255,255,255,0.8)" }}>
                  {lightbox.title}
                </span>
              </div>
            </div>

            <button className="lb-arrow" style={{ right:18 }}
              onClick={e=>{ e.stopPropagation(); navigate(1); }}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
