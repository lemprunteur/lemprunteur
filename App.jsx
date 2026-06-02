import { useState, useEffect, useRef } from "react";

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const AnimatedNumber = ({ target, suffix = "", active }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const dur = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return <span>{val.toLocaleString("fr-FR")}{suffix}</span>;
};

const GUIDES = [
  { emoji: "📋", cat: "LOI LEMOINE", title: "Tout comprendre sur la loi Lemoine en 2026", desc: "Depuis 2022, changez d'assurance quand vous voulez. On vous explique tout.", time: "5 min", color: "#f0f7ff" },
  { emoji: "💡", cat: "GUIDE PRATIQUE", title: "Comment changer d'assurance emprunteur en 3 étapes", desc: "Le processus complet, sans jargon, pour économiser rapidement.", time: "7 min", color: "#fff7f0" },
  { emoji: "📊", cat: "COMPARATIF", title: "APRIL, Alan, Cardif : quelle est la meilleure en 2026 ?", desc: "Notre comparatif détaillé des meilleures assurances du marché.", time: "10 min", color: "#f0fff4" },
  { emoji: "🏦", cat: "BANQUE VS DÉLÉGATION", title: "Assurance bancaire vs délégation : combien perdez-vous ?", desc: "Les banques prennent une marge de 70%. Voici comment récupérer votre argent.", time: "6 min", color: "#fdf0ff" },
];

const TIPS = [
  { num: "01", title: "Simulez vos économies", desc: "Entrez votre montant de prêt et obtenez une estimation précise en 30 secondes." },
  { num: "02", title: "Comparez les offres", desc: "Nous analysons toutes les assurances compatibles avec votre profil et votre banque." },
  { num: "03", title: "Changez en toute sérénité", desc: "Votre nouvel assureur prend en charge toutes les démarches administratives." },
];

const FAQS = [
  { q: "C'est quoi la loi Lemoine exactement ?", a: "Depuis le 1er juin 2022, vous pouvez changer d'assurance emprunteur à n'importe quel moment de votre crédit, sans frais ni pénalités. Avant cette loi, vous deviez attendre la date anniversaire de votre contrat." },
  { q: "Combien puis-je économiser en changeant ?", a: "En moyenne, nos utilisateurs économisent entre 5 000€ et 15 000€ sur la durée totale de leur crédit. Le montant dépend de votre profil, de l'assurance actuelle et du montant emprunté." },
  { q: "Ma banque peut-elle s'y opposer ?", a: "Non. Du moment que les garanties du nouveau contrat sont équivalentes, votre banque est légalement obligée d'accepter le changement. En cas de refus abusif, des sanctions peuvent s'appliquer." },
  { q: "Est-ce que c'est compliqué administrativement ?", a: "Non ! Votre nouvel assureur s'occupe de tout : vérification de l'équivalence des garanties, envoi des documents à votre banque, résiliation de l'ancien contrat. Vous n'avez presque rien à faire." },
];

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [amount, setAmount] = useState(220000);
  const [years, setYears] = useState(20);
  const [openFaq, setOpenFaq] = useState(null);
  const [statsRef, statsInView] = useInView();
  const saving = Math.round(amount * 0.053 * (years / 20));
  const monthly = Math.round(saving / (years * 12));

  useEffect(() => {
    const fn = () => setScroll(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: "#fff", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .anim { opacity:0; animation: fadeUp 0.6s ease forwards; }
        .a1{animation-delay:.05s} .a2{animation-delay:.2s} .a3{animation-delay:.35s} .a4{animation-delay:.5s}

        .nav-pill { color:#444; font-weight:500; font-size:15px; cursor:pointer; padding:8px 14px; border-radius:6px; transition:all .2s; }
        .nav-pill:hover { background:#f5f5f5; color:#111; }

        .btn-main { background:#111; color:#fff; border:none; padding:15px 32px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer; transition:all .25s; font-family:inherit; display:inline-flex; align-items:center; gap:8px; }
        .btn-main:hover { background:#222; transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,0,0,.15); }

        .btn-ghost { background:transparent; color:#111; border:1.5px solid #ddd; padding:14px 28px; border-radius:8px; font-size:15px; font-weight:600; cursor:pointer; transition:all .2s; font-family:inherit; }
        .btn-ghost:hover { border-color:#111; background:#fafafa; }

        .guide-card { border:1px solid #efefef; border-radius:14px; padding:28px; cursor:pointer; transition:all .25s; text-decoration:none; display:block; }
        .guide-card:hover { border-color:#111; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.08); }

        .step-num { font-family:'Bricolage Grotesque',sans-serif; font-size:72px; font-weight:800; color:#f0f0f0; line-height:1; margin-bottom:-8px; }

        input[type=range] { -webkit-appearance:none; width:100%; height:3px; background:#e0e0e0; border-radius:2px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#111; cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,.25); }

        .faq-btn { width:100%; background:none; border:none; padding:22px 0; display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-family:inherit; font-size:16px; font-weight:600; color:#111; text-align:left; }
        .faq-icon { width:28px; height:28px; border-radius:50%; border:1.5px solid #ddd; display:flex; align-items:center; justify-content:center; font-size:18px; color:#444; flex-shrink:0; transition:all .25s; }

        .tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 10px; border-radius:4px; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#ddd; border-radius:2px; }
      `}</style>

      {/* ── NAV ── */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:300,
        background: scroll > 40 ? "rgba(255,255,255,.96)" : "white",
        backdropFilter:"blur(8px)",
        borderBottom:"1px solid #f0f0f0",
        padding:"0 48px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:"#111", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontFamily:"'Bricolage Grotesque'", fontWeight:800, fontSize:16 }}>L</span>
          </div>
          <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:17, letterSpacing:"-0.3px" }}>L'Emprunteur</span>
        </div>
        <nav style={{ display:"flex", gap:4, alignItems:"center" }}>
          {["Comparer","Guides","Simulateur","FAQ"].map(l => <span key={l} className="nav-pill">{l}</span>)}
        </nav>
        <button className="btn-main" style={{ padding:"10px 22px", fontSize:14 }}>Comparer →</button>
      </header>

      {/* ── HERO : CENTRÉ ── */}
      <section style={{ padding:"110px 48px 0", textAlign:"center" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div className="anim a1">
            <span className="tag" style={{ background:"#f0f7ff", color:"#1a6ef7" }}>
              Loi Lemoine 2022 — Changez à tout moment
            </span>
          </div>

          <h1 className="anim a2" style={{
            fontFamily:"'Bricolage Grotesque',sans-serif",
            fontSize:58, fontWeight:800, lineHeight:1.1,
            letterSpacing:"-2px", margin:"20px 0 22px", color:"#111",
          }}>
            Votre banque vous fait payer trop cher.
          </h1>

          <p className="anim a3" style={{ fontSize:18, color:"#555", lineHeight:1.75, marginBottom:32, maxWidth:580, margin:"0 auto 32px" }}>
            Depuis la loi Lemoine, changez d'assurance emprunteur quand vous voulez. Nos utilisateurs économisent en moyenne <strong style={{ color:"#111" }}>8 500€</strong>.
          </p>

          {/* Social proof */}
          <div className="anim a4" style={{ display:"flex", alignItems:"center", gap:14, justifyContent:"center", marginBottom:52 }}>
            <div style={{ display:"flex" }}>
              {["ML","TB","SM","JD","CL"].map((i,idx) => (
                <div key={i} style={{
                  width:34, height:34, borderRadius:"50%", border:"2px solid white",
                  background:["#e8f4fd","#fdf3e8","#edfdf3","#f5edfd","#fde8ed"][idx],
                  marginLeft: idx > 0 ? -10 : 0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:700, color:"#555",
                }}>{i}</div>
              ))}
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ display:"flex", gap:2, marginBottom:2 }}>
                {[...Array(5)].map((_,i) => <span key={i} style={{ color:"#f5a623", fontSize:12 }}>★</span>)}
              </div>
              <div style={{ fontSize:13, color:"#666" }}>
                <strong style={{ color:"#111" }}>52 000+</strong> emprunteurs accompagnés
              </div>
            </div>
          </div>
        </div>

        {/* ── SIMULATEUR CENTRÉ ── */}
        <div className="anim a4" style={{ maxWidth:780, margin:"0 auto", background:"#fafafa", border:"1px solid #ebebeb", borderRadius:20, padding:"40px 48px 36px", marginBottom:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#888", letterSpacing:1.5, textTransform:"uppercase", marginBottom:32, textAlign:"left" }}>
            Simulateur d'économies
          </div>

          {/* Sliders côte à côte */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:32 }}>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:14, color:"#555", fontWeight:500 }}>Montant du prêt</span>
                <span style={{ fontSize:15, fontWeight:800 }}>{amount.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min="50000" max="700000" step="5000" value={amount} onChange={e => setAmount(+e.target.value)} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                <span style={{ fontSize:11, color:"#bbb" }}>50 000 €</span>
                <span style={{ fontSize:11, color:"#bbb" }}>700 000 €</span>
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:14, color:"#555", fontWeight:500 }}>Durée du prêt</span>
                <span style={{ fontSize:15, fontWeight:800 }}>{years} ans</span>
              </div>
              <input type="range" min="5" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                <span style={{ fontSize:11, color:"#bbb" }}>5 ans</span>
                <span style={{ fontSize:11, color:"#bbb" }}>30 ans</span>
              </div>
            </div>
          </div>

          {/* Résultat + CTA */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"center" }}>
            <div style={{ background:"#111", borderRadius:12, padding:"20px 28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Économie totale</div>
                <div style={{ fontSize:38, fontWeight:800, color:"#fff", fontFamily:"'Bricolage Grotesque',sans-serif", letterSpacing:"-1px" }}>
                  {saving.toLocaleString("fr-FR")} €
                </div>
              </div>
              <div style={{ borderLeft:"1px solid rgba(255,255,255,.1)", paddingLeft:20 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Par mois</div>
                <div style={{ fontSize:38, fontWeight:800, color:"rgba(255,255,255,.7)", fontFamily:"'Bricolage Grotesque',sans-serif", letterSpacing:"-1px" }}>
                  {monthly} €
                </div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button className="btn-main" style={{ whiteSpace:"nowrap" }}>Voir les offres →</button>
              <button className="btn-ghost" style={{ whiteSpace:"nowrap", padding:"12px 24px" }}>Guide complet</button>
            </div>
          </div>

          <p style={{ textAlign:"center", fontSize:12, color:"#bbb", marginTop:16 }}>
            ✓ Gratuit &nbsp;·&nbsp; ✓ Sans engagement &nbsp;·&nbsp; ✓ Résultat immédiat
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", padding:"56px 48px", marginTop:60 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[
            { target:52000, suf:"+", label:"Emprunteurs accompagnés" },
            { target:15000, suf:"€", label:"Économie max constatée" },
            { target:98, suf:"%", label:"Clients satisfaits" },
            { target:3, suf:" jours", label:"Pour changer d'assurance" },
          ].map(({ target, suf, label }, i) => (
            <div key={i} style={{ textAlign:"center", padding:"16px 20px", borderRight: i < 3 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ fontSize:42, fontWeight:800, fontFamily:"'Bricolage Grotesque'", letterSpacing:"-1px", color:"#111" }}>
                <AnimatedNumber target={target} suffix={suf} active={statsInView} />
              </div>
              <div style={{ fontSize:14, color:"#888", marginTop:6 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GUIDES ── */}
      <section style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
            <div>
              <span className="tag" style={{ background:"#f5f5f5", color:"#888" }}>Nos guides</span>
              <h2 style={{ fontFamily:"'Bricolage Grotesque'", fontSize:40, fontWeight:800, letterSpacing:"-1px", marginTop:12 }}>
                Tout comprendre, rien à payer
              </h2>
            </div>
            <button className="btn-ghost" style={{ whiteSpace:"nowrap" }}>Voir tous les guides →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
            {GUIDES.map((g, i) => (
              <a key={i} className="guide-card" style={{ background:g.color }}>
                <div style={{ fontSize:32, marginBottom:16 }}>{g.emoji}</div>
                <span className="tag" style={{ background:"rgba(0,0,0,.06)", color:"#444" }}>{g.cat}</span>
                <h3 style={{ fontWeight:700, fontSize:20, lineHeight:1.3, margin:"12px 0 10px", color:"#111" }}>{g.title}</h3>
                <p style={{ color:"#666", fontSize:15, lineHeight:1.6, marginBottom:20 }}>{g.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#999" }}>⏱ {g.time} de lecture</span>
                  <span style={{ fontSize:14, fontWeight:700, color:"#111" }}>Lire →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section style={{ padding:"100px 48px", background:"#fafafa", borderTop:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <span className="tag" style={{ background:"#f5f5f5", color:"#888" }}>Processus</span>
            <h2 style={{ fontFamily:"'Bricolage Grotesque'", fontSize:40, fontWeight:800, letterSpacing:"-1px", marginTop:16 }}>
              Changer d'assurance en 3 étapes
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:48 }}>
            {TIPS.map((t, i) => (
              <div key={i}>
                <div className="step-num">{t.num}</div>
                <h3 style={{ fontWeight:800, fontSize:22, marginBottom:12, color:"#111" }}>{t.title}</h3>
                <p style={{ color:"#666", lineHeight:1.7, fontSize:16 }}>{t.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:56 }}>
            <button className="btn-main">Commencer maintenant →</button>
          </div>
        </div>
      </section>

      {/* ── BANDEAU ── */}
      <section style={{ background:"#111", padding:"56px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 }}>
          {[
            { icon:"🔒", title:"100% indépendant", desc:"Aucune banque derrière nous. Nos comparatifs sont objectifs et sans conflit d'intérêt." },
            { icon:"💸", title:"Gratuit et sans engagement", desc:"Aucun frais caché. Nous sommes rémunérés par les assureurs uniquement si vous souscrivez." },
            { icon:"⚡", title:"Résultat en 2 minutes", desc:"Notre comparateur analyse toutes les offres compatibles avec votre profil instantanément." },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
              <span style={{ fontSize:28, flexShrink:0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:17, color:"#fff", marginBottom:8 }}>{item.title}</div>
                <div style={{ color:"rgba(255,255,255,.5)", fontSize:15, lineHeight:1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"100px 48px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span className="tag" style={{ background:"#f5f5f5", color:"#888" }}>FAQ</span>
            <h2 style={{ fontFamily:"'Bricolage Grotesque'", fontSize:40, fontWeight:800, letterSpacing:"-1px", marginTop:16 }}>
              Vos questions
            </h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <div className="faq-icon" style={{ borderColor: openFaq === i ? "#111" : "#ddd", background: openFaq === i ? "#111" : "transparent" }}>
                  <span style={{ color: openFaq === i ? "white" : "#444", transform: openFaq === i ? "rotate(45deg)" : "none", display:"block", transition:"transform .2s" }}>+</span>
                </div>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom:24, color:"#666", lineHeight:1.75, fontSize:16, animation:"fadeIn .25s ease" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:"100px 48px", background:"#fafafa", borderTop:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
          <span className="tag" style={{ background:"#f5f5f5", color:"#888" }}>Prêt à économiser ?</span>
          <h2 style={{ fontFamily:"'Bricolage Grotesque'", fontSize:48, fontWeight:800, letterSpacing:"-1.5px", margin:"20px 0 20px", color:"#111", lineHeight:1.08 }}>
            Arrêtez de payer trop cher dès aujourd'hui.
          </h2>
          <p style={{ color:"#666", fontSize:18, lineHeight:1.75, marginBottom:44 }}>
            En 2 minutes, comparez les meilleures assurances emprunteur et découvrez combien vous pouvez économiser.
          </p>
          <button className="btn-main" style={{ padding:"18px 48px", fontSize:17 }}>
            Comparer gratuitement →
          </button>
          <div style={{ display:"flex", gap:28, justifyContent:"center", marginTop:28 }}>
            {["Gratuit","Sans engagement","52 000 utilisateurs"].map(t => (
              <span key={t} style={{ fontSize:14, color:"#aaa" }}>✓ {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid #f0f0f0", padding:"40px 48px", background:"white" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, background:"#111", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontFamily:"'Bricolage Grotesque'", fontWeight:800, fontSize:14 }}>L</span>
            </div>
            <span style={{ fontFamily:"'Bricolage Grotesque'", fontWeight:800, fontSize:15 }}>L'Emprunteur</span>
          </div>
          <span style={{ fontSize:13, color:"#bbb" }}>© 2026 L'Emprunteur — Site d'information et de comparaison</span>
          <div style={{ display:"flex", gap:24 }}>
            {["Mentions légales","CGU","Contact"].map(l => (
              <span key={l} style={{ fontSize:13, color:"#aaa", cursor:"pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
