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

// ─────────────────────────────────────────────────────────────────
//  ALBUMS  (style-based, not event-based)
// ─────────────────────────────────────────────────────────────────
const ALBUM_KEYS    = ["Portraits", "Concerts", "Events", "Cosplay"];
const DEFAULT_NAMES = { Portraits:"Portraits", Concerts:"Concerts", Events:"Events", Cosplay:"Cosplay" };

// ─────────────────────────────────────────────────────────────────
//  PHOTOS
//  highlight:true → shown on front page (exactly 14, curated variety)
// ─────────────────────────────────────────────────────────────────
const PHOTOS = [

  // ── COSPLAY ─────────────────────────────────────────────────
  { id:1,  src:"/photos/DSC06993.jpg", cat:"Cosplay",  subcat:"", title:"", portrait:true,  highlight:true  },
  { id:2,  src:"/photos/DSC07054.jpg", cat:"Cosplay",  subcat:"", title:"", portrait:true,  highlight:true  },
  { id:3,  src:"/photos/DSC07095.jpg", cat:"Cosplay",  subcat:"", title:"", portrait:true,  highlight:true  },

  // ── PORTRAITS: Serena ────────────────────────────────────────
  { id:4,  src:"/photos/DSC00186.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:true  },
  { id:5,  src:"/photos/DSC00686.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:false },
  { id:6,  src:"/photos/DSC00758.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:false },
  { id:7,  src:"/photos/DSC00775.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:false },
  { id:8,  src:"/photos/DSC00949.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:false },
  { id:9,  src:"/photos/DSC00976.jpg", cat:"Portraits", subcat:"Serena", title:"", portrait:true,  highlight:false },

  // ── PORTRAITS: ungrouped ─────────────────────────────────────
  { id:10, src:"/photos/DSC01741.jpg", cat:"Portraits", subcat:"", title:"", portrait:true,  highlight:true  },
  { id:11, src:"/photos/DSC01894.jpg", cat:"Portraits", subcat:"", title:"", portrait:true,  highlight:true  },

  // ── CONCERTS: Ascend ─────────────────────────────────────────
  { id:12, src:"/photos/DSC04664.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:13, src:"/photos/DSC06160.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:14, src:"/photos/DSC06290.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:15, src:"/photos/DSC06628.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:true  },
  { id:16, src:"/photos/DSC06675.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:false, highlight:false },
  { id:17, src:"/photos/DSC06678.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:false, highlight:false },
  { id:18, src:"/photos/DSC06884.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:true  },
  { id:19, src:"/photos/DSC06886.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:20, src:"/photos/DSC06894.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:21, src:"/photos/DSC06898.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:22, src:"/photos/DSC06899.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },
  { id:23, src:"/photos/DSC06914.jpg", cat:"Concerts", subcat:"Ascend", title:"", portrait:true,  highlight:false },

  // ── CONCERTS: MarQ ───────────────────────────────────────────
  { id:24, src:"/photos/IMG_2254.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:true,  highlight:false },
  { id:25, src:"/photos/IMG_2283.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:true,  highlight:false },
  { id:26, src:"/photos/IMG_2286.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:true,  highlight:true  },
  { id:27, src:"/photos/IMG_2338.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:false, highlight:false },
  { id:28, src:"/photos/IMG_2429.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:false, highlight:true  },
  { id:29, src:"/photos/IMG_2558.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:false, highlight:false },
  { id:30, src:"/photos/IMG_2620.jpg", cat:"Concerts", subcat:"MarQ", title:"", portrait:false, highlight:false },

  // ── CONCERTS: Bytes and Beats ────────────────────────────────
  { id:31, src:"/photos/IMG_1260.jpg", cat:"Concerts", subcat:"Bytes and Beats", title:"", portrait:true,  highlight:false },
  { id:32, src:"/photos/IMG_1395.jpg", cat:"Concerts", subcat:"Bytes and Beats", title:"", portrait:true,  highlight:false },

  // ── EVENTS: TGEX 2025 (Lily) ─────────────────────────────────
  { id:33, src:"/photos/DSC07594.jpg", cat:"Events", subcat:"TGEX 2025", title:"LilyPichu", portrait:true,  highlight:true  },
  { id:34, src:"/photos/DSC08157.jpg", cat:"Events", subcat:"TGEX 2025", title:"VA Panel",  portrait:false, highlight:true  },
  { id:35, src:"/photos/DSC08421.jpg", cat:"Events", subcat:"TGEX 2025", title:"",          portrait:true,  highlight:false },

  // ── EVENTS: TGEX 2026 (Tuonoto panel) ────────────────────────
  { id:36, src:"/photos/DSC03989.jpg", cat:"Events", subcat:"TGEX 2026", title:"", portrait:false, highlight:false },
  { id:37, src:"/photos/DSC04034.jpg", cat:"Events", subcat:"TGEX 2026", title:"", portrait:false, highlight:false },
  { id:38, src:"/photos/DSC04039.jpg", cat:"Events", subcat:"TGEX 2026", title:"", portrait:false, highlight:true  },
  { id:39, src:"/photos/DSC04044.jpg", cat:"Events", subcat:"TGEX 2026", title:"", portrait:true,  highlight:false },

  // ── EVENTS: KOTX (dance) ─────────────────────────────────────
  { id:40, src:"/photos/DSC09313.jpg", cat:"Events", subcat:"KOTX",      title:"", portrait:true,  highlight:false },
  { id:41, src:"/photos/DSC09334.jpg", cat:"Events", subcat:"KOTX",      title:"", portrait:true,  highlight:true  },
  { id:42, src:"/photos/DSC09485.jpg", cat:"Events", subcat:"KOTX",      title:"", portrait:true,  highlight:false },
];

// Sanity check: exactly 14 highlights
// Cosplay:3  Portraits:3  Concerts:4  Events:4  = 14 ✓

const CONTACT = [
  ["Email",     "parmarvishva2015@gmail.com"],
  ["Instagram", "@vip_vish_"],
  ["Location",  "San Diego, CA"],
];

const loadNames = () => {
  try { const s = localStorage.getItem("vp_album_names"); return s ? {...DEFAULT_NAMES,...JSON.parse(s)} : DEFAULT_NAMES; }
  catch { return DEFAULT_NAMES; }
};

function ImgPlaceholder() {
  return (
    <div style={{ width:"100%", height:"100%", minHeight:180, background:G.off,
      display:"flex", alignItems:"center", justifyContent:"center",
      color:G.muted, fontSize:28 }}>📷</div>
  );
}

function PhotoCard({ photo, onClick, loaded, onLoad }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="card"
      style={{ gridRow:photo.portrait?"span 2":"span 1", aspectRatio:photo.portrait?"2/3":"3/2" }}
      onClick={onClick}>
      {!loaded && !errored && <div style={{ position:"absolute", inset:0, background:G.off, borderRadius:10 }} />}
      {errored ? <ImgPlaceholder /> : (
        <img src={photo.src} alt={photo.title} loading="lazy"
          onLoad={onLoad} onError={()=>setErrored(true)}
          style={{ opacity:loaded?1:0, transition:"opacity 0.35s" }} />
      )}
      {!errored && photo.title && (
        <div className="card-cap">
          <span style={{ fontFamily:G.sans, fontSize:14, fontWeight:500, color:"#fff" }}>{photo.title}</span>
        </div>
      )}
    </div>
  );
}

function AlbumCard({ name, cover, count, onClick }) {
  const [err, setErr] = useState(false);
  return (
    <div className="album-card" onClick={onClick}>
      {!err && cover ? <img src={cover.src} alt={name} onError={()=>setErr(true)} />
        : <div style={{ width:"100%", height:"100%", background:G.off }} />}
      <div className="album-cover">
        <div>
          <div style={{ fontFamily:G.sans, fontSize:18, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{name}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:4 }}>{count} photos</div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [page,       setPage]       = useState({ type:"highlights" });
  const [albumNames, setAlbumNames] = useState(loadNames);
  const [editKey,    setEditKey]    = useState(null);
  const [draftName,  setDraftName]  = useState("");
  const [lightbox,   setLightbox]   = useState(null);
  const [lbPool,     setLbPool]     = useState([]);
  const [loaded,     setLoaded]     = useState({});
  const [contact,    setContact]    = useState(false);
  const inputRef = useRef(null);

  const displayPhotos = (() => {
    if (page.type === "highlights") return PHOTOS.filter(p => p.highlight);
    if (page.type === "album")      return PHOTOS.filter(p => p.cat === page.cat);
    if (page.type === "subalbum")   return PHOTOS.filter(p => p.cat === page.cat && p.subcat === page.subcat);
    return [];
  })();

  const subcats   = page.type === "album"
    ? [...new Set(PHOTOS.filter(p => p.cat === page.cat && p.subcat).map(p => p.subcat))]
    : [];
  const ungrouped = page.type === "album"
    ? PHOTOS.filter(p => p.cat === page.cat && !p.subcat)
    : [];

  const openLb = (photo, pool) => { setLightbox(photo); setLbPool(pool); };

  const navigate = useCallback((dir) => {
    if (!lightbox) return;
    const idx = lbPool.findIndex(p => p.id === lightbox.id);
    setLightbox(lbPool[(idx + dir + lbPool.length) % lbPool.length]);
  }, [lightbox, lbPool]);

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
    const next  = { ...albumNames, [editKey]: name };
    setAlbumNames(next);
    try { localStorage.setItem("vp_album_names", JSON.stringify(next)); } catch {}
    setEditKey(null);
  };

  const lbIdx    = lightbox ? lbPool.findIndex(p => p.id === lightbox.id) : -1;
  const onMark   = p => setLoaded(l => ({ ...l, [p.id]: true }));
  const inAlbums = ["albums","album","subalbum"].includes(page.type);

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
        .card { cursor:pointer; position:relative; overflow:hidden; border-radius:10px; background:${G.off}; }
        .card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.48s cubic-bezier(.25,.46,.45,.94); }
        .card:hover img { transform:scale(1.05); }
        .card-cap { position:absolute; inset:0; border-radius:10px; background:linear-gradient(to top,rgba(0,0,0,0.52) 0%,transparent 50%); opacity:0; transition:opacity 0.24s ease; display:flex; align-items:flex-end; padding:14px; }
        .card:hover .card-cap { opacity:1; }
        .album-card { cursor:pointer; position:relative; overflow:hidden; border-radius:12px; background:${G.off}; aspect-ratio:4/3; }
        .album-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.45s ease; }
        .album-card:hover img { transform:scale(1.04); }
        .album-cover { position:absolute; inset:0; border-radius:12px; background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.1) 55%,transparent 75%); display:flex; align-items:flex-end; padding:18px; }
        .nav-link { background:none; border:none; cursor:pointer; font-family:${G.body}; font-size:13px; font-weight:500; color:${G.muted}; padding:0; transition:color 0.16s; }
        .nav-link:hover { color:${G.ink}; }
        .nav-link.on { color:${G.ink}; font-weight:600; }
        .ct { background:none; border:1.5px solid ${G.border}; border-radius:999px; cursor:pointer; font-family:${G.body}; font-size:13px; font-weight:500; color:${G.muted}; padding:6px 16px; transition:all 0.16s; }
        .ct:hover,.ct.open { border-color:${G.ink}; color:${G.ink}; }
        .cp { position:absolute; top:calc(100% + 10px); right:0; background:${G.white}; border:1px solid ${G.border}; border-radius:14px; padding:22px 24px; min-width:240px; box-shadow:0 8px 32px rgba(0,0,0,0.1); animation:pop 0.18s cubic-bezier(.34,1.56,.64,1); z-index:100; }
        @keyframes pop { from{opacity:0;transform:translateY(-6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .editable-title { font-family:${G.sans}; font-size:clamp(32px,6vw,56px); font-weight:700; color:${G.ink}; letter-spacing:-0.02em; border:none; background:none; outline:none; border-bottom:2px dashed ${G.border}; width:100%; cursor:text; display:block; padding:2px 0; }
        .editable-title:focus { border-bottom-color:${G.accent}; }
        .lb-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.18); color:#fff; cursor:pointer; border-radius:50%; width:44px; height:44px; font-size:20px; display:flex; align-items:center; justify-content:center; transition:background 0.18s; }
        .lb-arrow:hover { background:rgba(255,255,255,0.22); }
        .back-btn { background:none; border:none; cursor:pointer; font-family:${G.body}; font-size:13px; color:${G.muted}; display:flex; align-items:center; gap:5px; padding:0; transition:color 0.16s; }
        .back-btn:hover { color:${G.ink}; }
        .section-label { font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:${G.muted}; margin-bottom:14px; margin-top:28px; }
        @media(max-width:600px){ header{padding:0 16px!important} .pad{padding:0 10px!important} }
      `}</style>

      <div style={{ minHeight:"100vh", background:G.white, fontFamily:G.body, color:G.ink }}>

        {/* Header */}
        <header style={{ position:"sticky", top:0, zIndex:50, background:"rgba(238,238,238,0.92)", backdropFilter:"blur(10px)", borderBottom:`1px solid ${G.border}`, padding:"0 28px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:G.sans, fontSize:15, fontWeight:700, letterSpacing:"-0.01em", cursor:"pointer" }} onClick={()=>setPage({type:"highlights"})}>
            Vishva Parmar
          </span>
          <nav style={{ display:"flex", alignItems:"center", gap:28 }}>
            <button className={`nav-link ${page.type==="highlights"?"on":""}`} onClick={()=>setPage({type:"highlights"})}>Highlights</button>
            <button className={`nav-link ${inAlbums?"on":""}`} onClick={()=>setPage({type:"albums"})}>Albums</button>
            <div style={{ position:"relative" }}>
              <button className={`ct${contact?" open":""}`} onClick={()=>setContact(c=>!c)}>Contact</button>
              {contact && (
                <div className="cp">
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:G.muted, marginBottom:16 }}>Get in touch</p>
                  {CONTACT.map(([l,v])=>(
                    <div key={l} style={{ marginBottom:14 }}>
                      <div style={{ fontSize:11, color:G.muted, marginBottom:2 }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:500, color:G.ink }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Highlights */}
        {page.type === "highlights" && (
          <div className="pad" style={{ padding:"20px 12px 64px" }}>
            <p className="section-label" style={{ marginTop:8, marginLeft:4 }}>Highlights</p>
            <div className="grid">
              {displayPhotos.map(p=>(
                <PhotoCard key={p.id} photo={p} loaded={!!loaded[p.id]} onLoad={()=>onMark(p)} onClick={()=>openLb(p,displayPhotos)} />
              ))}
            </div>
          </div>
        )}

        {/* Albums list */}
        {page.type === "albums" && (
          <div className="pad" style={{ padding:"20px 12px 64px" }}>
            <p className="section-label" style={{ marginTop:8, marginLeft:4 }}>Albums</p>
            <div className="albums-grid">
              {ALBUM_KEYS.map(key=>{
                const cover = PHOTOS.find(p=>p.cat===key);
                const count = PHOTOS.filter(p=>p.cat===key).length;
                return <AlbumCard key={key} name={albumNames[key]} cover={cover} count={count} onClick={()=>setPage({type:"album",cat:key})} />;
              })}
            </div>
          </div>
        )}

        {/* Album detail */}
        {page.type === "album" && (
          <div className="pad" style={{ padding:"28px 12px 64px" }}>
            <div style={{ padding:"0 4px 16px" }}>
              <button className="back-btn" onClick={()=>setPage({type:"albums"})} style={{ marginBottom:20 }}>← Albums</button>
              {editKey === page.cat ? (
                <>
                  <input ref={inputRef} className="editable-title" value={draftName}
                    onChange={e=>setDraftName(e.target.value)} onBlur={saveEdit}
                    onKeyDown={e=>{ if(e.key==="Enter") saveEdit(); if(e.key==="Escape") setEditKey(null); }} maxLength={40} />
                  <p style={{ fontSize:11, color:G.muted, marginTop:6 }}>↵ Enter to save · Esc to cancel</p>
                </>
              ) : (
                <div style={{ display:"inline-flex", alignItems:"center", gap:10, cursor:"text" }} onClick={()=>startEdit(page.cat)}>
                  <h1 style={{ fontFamily:G.sans, fontSize:"clamp(32px,6vw,56px)", fontWeight:700, color:G.ink, letterSpacing:"-0.02em" }}>{albumNames[page.cat]}</h1>
                  <span style={{ fontSize:12, color:G.muted, userSelect:"none", marginTop:4 }}>✏️</span>
                </div>
              )}
              <p style={{ fontSize:13, color:G.muted, marginTop:6 }}>{PHOTOS.filter(p=>p.cat===page.cat).length} photos</p>
            </div>
            {subcats.length > 0 && (
              <>
                <p className="section-label">Series</p>
                <div className="albums-grid">
                  {subcats.map(sc=>{
                    const scPhotos = PHOTOS.filter(p=>p.cat===page.cat && p.subcat===sc);
                    return <AlbumCard key={sc} name={sc} cover={scPhotos[0]} count={scPhotos.length} onClick={()=>setPage({type:"subalbum",cat:page.cat,subcat:sc})} />;
                  })}
                </div>
              </>
            )}
            {ungrouped.length > 0 && (
              <>
                {subcats.length > 0 && <p className="section-label">Other</p>}
                <div className="grid">
                  {ungrouped.map(p=><PhotoCard key={p.id} photo={p} loaded={!!loaded[p.id]} onLoad={()=>onMark(p)} onClick={()=>openLb(p,ungrouped)} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* Sub-album */}
        {page.type === "subalbum" && (
          <div className="pad" style={{ padding:"28px 12px 64px" }}>
            <div style={{ padding:"0 4px 20px" }}>
              <button className="back-btn" onClick={()=>setPage({type:"album",cat:page.cat})} style={{ marginBottom:20 }}>← {albumNames[page.cat]}</button>
              <h1 style={{ fontFamily:G.sans, fontSize:"clamp(32px,6vw,56px)", fontWeight:700, color:G.ink, letterSpacing:"-0.02em" }}>{page.subcat}</h1>
              <p style={{ fontSize:13, color:G.muted, marginTop:6 }}>{displayPhotos.length} photos</p>
            </div>
            <div className="grid">
              {displayPhotos.map(p=><PhotoCard key={p.id} photo={p} loaded={!!loaded[p.id]} onLoad={()=>onMark(p)} onClick={()=>openLb(p,displayPhotos)} />)}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div role="dialog" aria-modal="true"
            style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(8,8,8,0.96)", display:"flex", alignItems:"center", justifyContent:"center" }}
            onClick={()=>setLightbox(null)}>
            <button onClick={()=>setLightbox(null)} style={{ position:"absolute", top:18, right:22, background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:G.body }}>esc ✕</button>
            <span style={{ position:"absolute", top:22, left:"50%", transform:"translateX(-50%)", fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:G.body }}>{lbIdx+1} / {lbPool.length}</span>
            <button className="lb-arrow" style={{ left:18 }} onClick={e=>{ e.stopPropagation(); navigate(-1); }}>‹</button>
            <div onClick={e=>e.stopPropagation()} style={{ maxWidth:"84vw", maxHeight:"88vh" }}>
              <img key={lightbox.src} src={lightbox.src} alt={lightbox.title}
                style={{ maxWidth:"84vw", maxHeight:"82vh", objectFit:"contain", display:"block", borderRadius:10 }} />
              {lightbox.title && (
                <div style={{ marginTop:12, textAlign:"center" }}>
                  <span style={{ fontSize:15, fontFamily:G.sans, fontWeight:500, color:"rgba(255,255,255,0.8)" }}>{lightbox.title}</span>
                </div>
              )}
            </div>
            <button className="lb-arrow" style={{ right:18 }} onClick={e=>{ e.stopPropagation(); navigate(1); }}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
