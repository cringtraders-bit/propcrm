import { useState, useEffect } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ebdnlmfyngbfpsbwlowu.supabase.co";
const SUPABASE_KEY = "sb_publishable_iFavw30FJuV1jcIGKTz9oQ_tXbiWajt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COLORS = {
  bg: "#0f0e0c", surface: "#1a1815", card: "#221f1b", border: "#2e2a24",
  gold: "#c9a84c", goldLight: "#e8c97a", cream: "#f5f0e8", muted: "#7a7060",
  text: "#e8e0d0", green: "#4caf7d", red: "#e05252", blue: "#5b9bd5", orange: "#e07a30",
};

const STAGES = ["New Lead", "Site Visit", "Negotiation", "Closed Won", "Closed Lost"];
const STAGE_COLORS = {
  "New Lead": "#5b9bd5", "Site Visit": "#e07a30",
  "Negotiation": "#c9a84c", "Closed Won": "#4caf7d", "Closed Lost": "#e05252",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0f0e0c; color: #e8e0d0; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1815; }
  ::-webkit-scrollbar-thumb { background: #2e2a24; border-radius: 3px; }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  input, textarea, select { outline: none; font-family: 'DM Sans', sans-serif; }
`;

function Avatar({ initials, size = 36, color = COLORS.gold }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${color}22,${color}44)`, border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: size * 0.35, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, color }) {
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>;
}

function Loader() {
  return <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>Loading...</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480 }} onClick={e => e.stopPropagation()} className="fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: COLORS.cream }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14, marginBottom: 14, display: "block" };

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small }) {
  const bg = variant === "primary" ? `linear-gradient(135deg,${COLORS.gold},${COLORS.goldLight})` : "transparent";
  return (
    <button onClick={onClick} style={{ background: bg, color: variant === "primary" ? "#1a1300" : COLORS.muted, border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none", borderRadius: 8, padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 12 : 14, fontWeight: 600, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "Buyer", city: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return;
    const avatar = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    await supabase.from("contacts").insert([{ ...form, avatar }]);
    setForm({ name: "", phone: "", email: "", type: "Buyer", city: "" });
    setModal(false);
    load();
  };

  const del = async id => {
    await supabase.from("contacts").delete().eq("id", id);
    setContacts(contacts.filter(c => c.id !== id));
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: COLORS.cream }}>Contacts</h2>
          <p style={{ color: COLORS.muted, fontSize: 13 }}>{contacts.length} contacts</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Add Contact</Btn>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search contacts..."
        style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", color: COLORS.text, fontSize: 14, marginBottom: 20 }} />
      {loading ? <Loader /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar initials={c.avatar} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: COLORS.cream }}>{c.name}</span>
                  <Badge label={c.type} color={c.type === "Buyer" ? COLORS.blue : COLORS.orange} />
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{c.phone} · {c.email} · {c.city}</div>
              </div>
              <button onClick={() => del(c.id)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title="New Contact" onClose={() => setModal(false)}>
          <Field label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Arjun Sharma" />
          <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="email@gmail.com" />
          <Sel label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={["Buyer", "Seller", "Investor", "Tenant"]} />
          <Field label="City" value={form.city} onChange={v => setForm({ ...form, city: v })} placeholder="Chennai" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={add}>Add Contact</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", contact: "", value: "", stage: "New Lead", property: "Residential" });
  const [drag, setDrag] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return;
    await supabase.from("leads").insert([form]);
    setForm({ title: "", contact: "", value: "", stage: "New Lead", property: "Residential" });
    setModal(false);
    load();
  };

  const del = async id => {
    await supabase.from("leads").delete().eq("id", id);
    setLeads(leads.filter(l => l.id !== id));
  };

  const moveStage = async (id, newStage) => {
    await supabase.from("leads").update({ stage: newStage }).eq("id", id);
    setLeads(leads.map(l => l.id === id ? { ...l, stage: newStage } : l));
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: COLORS.cream }}>Leads & Deals</h2>
          <p style={{ color: COLORS.muted, fontSize: 13 }}>{leads.filter(l => l.stage !== "Closed Lost").length} active deals</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Add Lead</Btn>
      </div>
      {loading ? <Loader /> : (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 12 }}>
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} style={{ minWidth: 240, flex: "0 0 240px", background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "14px 12px" }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => { if (drag) { moveStage(drag, stage); setDrag(null); } }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: STAGE_COLORS[stage] }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.cream }}>{stage}</span>
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.muted, background: COLORS.surface, borderRadius: 20, padding: "2px 8px" }}>{stageLeads.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stageLeads.map(lead => (
                    <div key={lead.id} draggable onDragStart={() => setDrag(lead.id)}
                      style={{ background: COLORS.surface, borderRadius: 10, padding: 12, border: `1px solid ${COLORS.border}`, cursor: "grab" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.cream, marginBottom: 6 }}>{lead.title}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 8 }}>👤 {lead.contact}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: COLORS.gold, fontWeight: 600 }}>₹{lead.value}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <select value={lead.stage} onChange={e => moveStage(lead.id, e.target.value)}
                            style={{ fontSize: 10, background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.muted, borderRadius: 6, padding: "2px 4px" }}>
                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button onClick={() => del(lead.id)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer" }}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title="New Lead" onClose={() => setModal(false)}>
          <Field label="Property Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="3BHK - Anna Nagar" />
          <Field label="Contact Name" value={form.contact} onChange={v => setForm({ ...form, contact: v })} placeholder="Client name" />
          <Field label="Value (₹)" value={form.value} onChange={v => setForm({ ...form, value: v })} placeholder="85,00,000" />
          <Sel label="Stage" value={form.stage} onChange={v => setForm({ ...form, stage: v })} options={STAGES} />
          <Sel label="Property Type" value={form.property} onChange={v => setForm({ ...form, property: v })} options={["Residential", "Villa", "Commercial", "Plot", "Apartment"]} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={add}>Add Lead</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", due: "", priority: "Medium", contact: "" });
  const [filter, setFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return;
    await supabase.from("tasks").insert([{ ...form, done: false }]);
    setForm({ title: "", due: "", priority: "Medium", contact: "" });
    setModal(false);
    load();
  };

  const toggle = async (id, done) => {
    await supabase.from("tasks").update({ done: !done }).eq("id", id);
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !done } : t));
  };

  const del = async id => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColor = { High: COLORS.red, Medium: COLORS.orange, Low: COLORS.green };
  const filtered = tasks.filter(t => filter === "All" ? true : filter === "Done" ? t.done : !t.done);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: COLORS.cream }}>Tasks & Follow-ups</h2>
          <p style={{ color: COLORS.muted, fontSize: 13 }}>{tasks.filter(t => !t.done).length} pending</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ Add Task</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Pending", "Done"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === f ? COLORS.gold : COLORS.border}`, background: filter === f ? `${COLORS.gold}22` : "transparent", color: filter === f ? COLORS.gold : COLORS.muted, cursor: "pointer", fontSize: 13 }}>
            {f}
          </button>
        ))}
      </div>
      {loading ? <Loader /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, opacity: t.done ? 0.6 : 1 }}>
              <div onClick={() => toggle(t.id, t.done)} style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${t.done ? COLORS.green : COLORS.border}`, background: t.done ? COLORS.green : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {t.done && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: COLORS.cream, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
                  <Badge label={t.priority} color={priorityColor[t.priority]} />
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>👤 {t.contact} · 📅 {t.due}</div>
              </div>
              <button onClick={() => del(t.id)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title="New Task" onClose={() => setModal(false)}>
          <Field label="Task Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Site visit with client" />
          <Field label="Contact" value={form.contact} onChange={v => setForm({ ...form, contact: v })} placeholder="Client name" />
          <Field label="Due Date" type="date" value={form.due} onChange={v => setForm({ ...form, due: v })} />
          <Sel label="Priority" value={form.priority} onChange={v => setForm({ ...form, priority: v })} options={["High", "Medium", "Low"]} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={add}>Add Task</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ contact: "", note: "", type: "Call" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.note) return;
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    await supabase.from("notes").insert([{ ...form, date }]);
    setForm({ contact: "", note: "", type: "Call" });
    setModal(false);
    load();
  };

  const del = async id => {
    await supabase.from("notes").delete().eq("id", id);
    setNotes(notes.filter(n => n.id !== id));
  };

  const typeCo
