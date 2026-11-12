import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpLeft,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Flame,
  Fuel,
  Gauge,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelRight,
  Radio,
  ShieldCheck,
  Thermometer,
  X,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type VehicleStatus = "safe" | "attention";

type Vehicle = {
  id: string;
  name: string;
  code: string;
  status: VehicleStatus;
  statusLabel: string;
  temperature: number;
  pressure: number;
  fuel: number;
  suppression: string;
  lastSeen: string;
  location: string;
  note: string;
};

const vehicles: Vehicle[] = [
  {
    id: "orion-7",
    name: "أوريون 07",
    code: "OR-07",
    status: "safe",
    statusLabel: "آمنة ومستقرة",
    temperature: 24.8,
    pressure: 101.2,
    fuel: 82,
    suppression: "جاهز",
    lastSeen: "منذ 18 ثانية",
    location: "المدار المنخفض",
    note: "جميع القراءات ضمن النطاق التشغيلي الموصى به.",
  },
  {
    id: "sahab-2",
    name: "سحاب 02",
    code: "SH-02",
    status: "attention",
    statusLabel: "تحتاج إلى انتباه",
    temperature: 31.6,
    pressure: 99.8,
    fuel: 64,
    suppression: "متابعة",
    lastSeen: "منذ 31 ثانية",
    location: "قطاع ألفا",
    note: "ارتفاع حراري محدود في وحدة التجارب؛ تتم المتابعة.",
  },
  {
    id: "nadir-4",
    name: "نادر 04",
    code: "ND-04",
    status: "safe",
    statusLabel: "آمنة ومستقرة",
    temperature: 22.1,
    pressure: 100.6,
    fuel: 47,
    suppression: "جاهز",
    lastSeen: "منذ دقيقة",
    location: "ممر الإمداد",
    note: "الرحلة مستقرة، مع انخفاض طبيعي في الوقود.",
  },
  {
    id: "falak-9",
    name: "فلك 09",
    code: "FK-09",
    status: "safe",
    statusLabel: "آمنة ومستقرة",
    temperature: 25.4,
    pressure: 100.9,
    fuel: 76,
    suppression: "جاهز",
    lastSeen: "منذ دقيقتين",
    location: "المدار المتوسط",
    note: "لا توجد إشارات تستدعي التدخل في الوقت الحالي.",
  },
];

const chartData: Record<string, Record<string, { time: string; temp: number; baseline: number }[]>> = {
  "orion-7": {
    "24h": [
      { time: "00:00", temp: 23.8, baseline: 24 },
      { time: "04:00", temp: 24.2, baseline: 24 },
      { time: "08:00", temp: 24.9, baseline: 24 },
      { time: "12:00", temp: 25.1, baseline: 24 },
      { time: "16:00", temp: 24.6, baseline: 24 },
      { time: "20:00", temp: 24.8, baseline: 24 },
    ],
    "7d": [
      { time: "السبت", temp: 23.4, baseline: 24 },
      { time: "الأحد", temp: 24.2, baseline: 24 },
      { time: "الإثنين", temp: 24.6, baseline: 24 },
      { time: "الثلاثاء", temp: 25.1, baseline: 24 },
      { time: "الأربعاء", temp: 24.8, baseline: 24 },
      { time: "الخميس", temp: 24.8, baseline: 24 },
      { time: "الجمعة", temp: 24.8, baseline: 24 },
    ],
  },
  "sahab-2": {
    "24h": [
      { time: "00:00", temp: 27.8, baseline: 25 },
      { time: "04:00", temp: 28.4, baseline: 25 },
      { time: "08:00", temp: 29.1, baseline: 25 },
      { time: "12:00", temp: 31.8, baseline: 25 },
      { time: "16:00", temp: 31.2, baseline: 25 },
      { time: "20:00", temp: 31.6, baseline: 25 },
    ],
    "7d": [
      { time: "السبت", temp: 26.2, baseline: 25 },
      { time: "الأحد", temp: 27.4, baseline: 25 },
      { time: "الإثنين", temp: 28.1, baseline: 25 },
      { time: "الثلاثاء", temp: 29.2, baseline: 25 },
      { time: "الأربعاء", temp: 30.6, baseline: 25 },
      { time: "الخميس", temp: 31.8, baseline: 25 },
      { time: "الجمعة", temp: 31.6, baseline: 25 },
    ],
  },
  "nadir-4": {
    "24h": [
      { time: "00:00", temp: 21.8, baseline: 23 },
      { time: "04:00", temp: 22.1, baseline: 23 },
      { time: "08:00", temp: 21.9, baseline: 23 },
      { time: "12:00", temp: 22.4, baseline: 23 },
      { time: "16:00", temp: 22.2, baseline: 23 },
      { time: "20:00", temp: 22.1, baseline: 23 },
    ],
    "7d": [
      { time: "السبت", temp: 22.7, baseline: 23 },
      { time: "الأحد", temp: 22.3, baseline: 23 },
      { time: "الإثنين", temp: 22.6, baseline: 23 },
      { time: "الثلاثاء", temp: 22.0, baseline: 23 },
      { time: "الأربعاء", temp: 21.8, baseline: 23 },
      { time: "الخميس", temp: 22.4, baseline: 23 },
      { time: "الجمعة", temp: 22.1, baseline: 23 },
    ],
  },
  "falak-9": {
    "24h": [
      { time: "00:00", temp: 24.1, baseline: 24 },
      { time: "04:00", temp: 24.4, baseline: 24 },
      { time: "08:00", temp: 25.0, baseline: 24 },
      { time: "12:00", temp: 25.7, baseline: 24 },
      { time: "16:00", temp: 25.1, baseline: 24 },
      { time: "20:00", temp: 25.4, baseline: 24 },
    ],
    "7d": [
      { time: "السبت", temp: 24.0, baseline: 24 },
      { time: "الأحد", temp: 24.6, baseline: 24 },
      { time: "الإثنين", temp: 24.8, baseline: 24 },
      { time: "الثلاثاء", temp: 25.3, baseline: 24 },
      { time: "الأربعاء", temp: 25.5, baseline: 24 },
      { time: "الخميس", temp: 25.0, baseline: 24 },
      { time: "الجمعة", temp: 25.4, baseline: 24 },
    ],
  },
};

const alerts = [
  {
    id: 1,
    type: "ملاحظة حرارية",
    title: "ارتفاع محدود في وحدة التجارب",
    vehicle: "سحاب 02",
    time: "منذ 6 دقائق",
    level: "attention",
    description: "الحرارة 31.6°م — أقل من حد التدخل، لكن يوصى بالمتابعة.",
  },
  {
    id: 2,
    type: "فحص روتيني",
    title: "اكتمل فحص نظام الإطفاء",
    vehicle: "أوريون 07",
    time: "منذ 42 دقيقة",
    level: "normal",
    description: "تمت المصادقة على جاهزية الصمامات وحساسات اللهب.",
  },
  {
    id: 3,
    type: "تغير ضغط",
    title: "تصحيح تلقائي للضغط الداخلي",
    vehicle: "نادر 04",
    time: "منذ ساعة و12 دقيقة",
    level: "normal",
    description: "عاد الضغط إلى المجال الاسمي بعد دورة توازن قصيرة.",
  },
];

const rangeLabels: Record<"24h" | "7d", string> = { "24h": "آخر 24 ساعة", "7d": "آخر 7 أيام" };

function StatusPill({ status, compact = false }: { status: VehicleStatus; compact?: boolean }) {
  return (
    <span className={`status-pill ${status} ${compact ? "compact" : ""}`}>
      <span className="status-dot" />
      {status === "safe" ? "آمنة" : "تحتاج إلى انتباه"}
    </span>
  );
}

function MetricCard({
  label,
  value,
  unit,
  helper,
  icon,
  tone = "orange",
  progress,
}: {
  label: string;
  value: string;
  unit: string;
  helper: string;
  icon: React.ReactNode;
  tone?: "orange" | "blue" | "green" | "yellow";
  progress?: number;
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span className={`metric-icon ${tone}`}>{icon}</span>
        <span className="metric-label">{label}</span>
        <button className="icon-button subtle" aria-label={`معلومات عن ${label}`}>
          <CircleHelp size={15} />
        </button>
      </div>
      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>
      <div className="metric-helper">{helper}</div>
      {progress !== undefined && (
        <div className="progress-track" aria-label={`${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </article>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState("orion-7");
  const [range, setRange] = useState<"24h" | "7d">("24h");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "attention">("all");

  const selected = useMemo(() => vehicles.find((vehicle) => vehicle.id === selectedId) ?? vehicles[0], [selectedId]);
  const graph = chartData[selected.id]?.[range] ?? [];
  const visibleAlerts = filter === "attention" ? alerts.filter((alert) => alert.level === "attention") : alerts;

  return (
    <div className="app-frame" dir="rtl">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Flame size={22} strokeWidth={2.6} /></div>
          <div>
            <div className="brand-name">Orbital Fire</div>
            <div className="brand-subtitle">مركز سلامة الرحلات</div>
          </div>
        </div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة"><X size={20} /></button>
        <nav className="main-nav" aria-label="التنقل الرئيسي">
          <div className="nav-section-label">المراقبة</div>
          <button className="nav-item active"><LayoutDashboard size={18} /><span>نظرة عامة</span><span className="nav-count">1</span></button>
          <button className="nav-item"><Activity size={18} /><span>القراءات الحية</span></button>
          <button className="nav-item"><Bell size={18} /><span>سجل التنبيهات</span><span className="nav-count warning">1</span></button>
          <div className="nav-section-label second">الموارد</div>
          <button className="nav-item"><Radio size={18} /><span>المركبات النشطة</span></button>
          <button className="nav-item"><ShieldCheck size={18} /><span>بروتوكولات السلامة</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="operator-card">
            <div className="operator-avatar">م</div>
            <div>
              <strong>مركز العمليات</strong>
              <span>وردية المساء · متصل</span>
            </div>
            <MoreHorizontal size={17} className="operator-more" />
          </div>
          <div className="sidebar-footnote"><span className="live-dot" /> آخر مزامنة قبل 18 ثانية</div>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة" />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-start">
            <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="فتح القائمة"><Menu size={20} /></button>
            <div className="breadcrumb"><span>المراقبة</span><span className="breadcrumb-separator">/</span><strong>نظرة عامة</strong></div>
          </div>
          <div className="topbar-actions">
            <span className="system-status"><span className="live-dot" /> النظام يعمل بشكل طبيعي</span>
            <button className="icon-button notification-button" onClick={() => setAlertOpen((value) => !value)} aria-label="عرض التنبيهات">
              <Bell size={18} /><span className="notification-dot" />
            </button>
            {alertOpen && <div className="notification-popover"><strong>تنبيه واحد يحتاج إلى مراجعة</strong><span>ارتفاع محدود في حرارة سحاب 02</span><button onClick={() => { setSelectedId("sahab-2"); setAlertOpen(false); }}>عرض التفاصيل <ArrowDownLeft size={14} /></button></div>}
            <div className="date-chip"><Clock3 size={15} /><span>12 نوفمبر 2026</span></div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> تقرير السلامة اليومي</div>
              <h1>صباح الخير، يا فريق المدار.</h1>
              <p className="hero-copy">هذه هي الصورة الحالية لسلامة مركباتك. كل القراءات محدثة وتحت المراقبة.</p>
            </div>
            <div className="hero-meta">
              <div className="meta-caption">آخر تحديث شامل</div>
              <strong>12:48:06 <span>UTC</span></strong>
              <div className="meta-live"><span className="live-dot" /> البيانات تصل لحظيًا</div>
            </div>
          </section>

          <section className="control-strip">
            <div className="field-group">
              <label htmlFor="vehicle-select">المركبة المحددة</label>
              <div className="select-wrap"><select id="vehicle-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · {vehicle.code}</option>)}</select><ChevronDown size={16} /></div>
            </div>
            <div className="field-group range-field">
              <label>الفترة</label>
              <div className="segmented-control">{(Object.keys(rangeLabels) as ("24h" | "7d")[]).map((key) => <button key={key} className={range === key ? "selected" : ""} onClick={() => setRange(key)}>{rangeLabels[key]}</button>)}</div>
            </div>
            <div className="control-spacer" />
            <div className="snapshot-note"><span className="snapshot-icon"><PanelRight size={15} /></span><span>لقطة تشغيلية رقم <strong>OF-2411</strong></span></div>
          </section>

          <section className="overview-grid">
            <article className={`status-card ${selected.status}`}>
              <div className="status-card-head"><span>الحالة العامة</span><button className="icon-button subtle" aria-label="المزيد"><MoreHorizontal size={17} /></button></div>
              <div className="status-main"><div className="status-emblem"><ShieldCheck size={30} /></div><div><h2>{selected.status === "safe" ? "كل شيء تحت السيطرة" : "نحتاج إلى نظرة أقرب"}</h2><StatusPill status={selected.status} /></div></div>
              <p>{selected.note}</p>
              <div className="status-card-foot"><span><span className="pulse-mark" /> {selected.lastSeen}</span><span>{selected.location}</span></div>
            </article>
            <MetricCard label="ضغط المقصورة" value={selected.pressure.toFixed(1)} unit=" kPa" helper="المجال الاسمي: 98 – 103" icon={<Gauge size={19} />} tone="blue" />
            <MetricCard label="درجة الحرارة" value={selected.temperature.toFixed(1)} unit="°م" helper={selected.status === "safe" ? "استقرار جيد خلال الساعات الماضية" : "أعلى من المتوسط بـ 6.6°م"} icon={<Thermometer size={19} />} tone="orange" />
            <MetricCard label="مستوى الوقود" value={String(selected.fuel)} unit="%" helper="الوقت المتوقع: 18 ساعة و 40 دقيقة" icon={<Fuel size={19} />} tone="yellow" progress={selected.fuel} />
            <MetricCard label="نظام الإطفاء" value={selected.suppression === "جاهز" ? "جاهز" : "متابعة"} unit="" helper="آخر فحص آلي: منذ 42 دقيقة" icon={<Zap size={19} />} tone="green" />
          </section>

          <section className="two-column-grid">
            <article className="panel chart-panel">
              <div className="panel-heading"><div><div className="panel-kicker">تحليل مباشر</div><h2>سلوك الحرارة</h2></div><div className="chart-summary"><strong>{selected.temperature.toFixed(1)}°م</strong><span className={selected.status === "safe" ? "positive" : "attention-text"}>{selected.status === "safe" ? "↓ 0.4%" : "↑ 2.8%"} <small>مقابل الفترة السابقة</small></span></div></div>
              <div className="chart-legend"><span><i className="legend-line temperature-line" /> درجة حرارة المركبة</span><span><i className="legend-line baseline-line" /> المجال الاسمي</span></div>
              <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={graph} margin={{ top: 16, right: 4, left: -15, bottom: 0 }}><CartesianGrid strokeDasharray="4 6" stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#9197a4", fontSize: 11, fontFamily: "inherit" }} dy={10} /><YAxis domain={[18, 36]} tickLine={false} axisLine={false} tick={{ fill: "#9197a4", fontSize: 11, fontFamily: "inherit" }} tickFormatter={(value) => `${value}°`} /><Tooltip contentStyle={{ direction: "rtl", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", boxShadow: "0 10px 30px rgba(21, 24, 31, .18)", fontFamily: "inherit", fontSize: 12 }} formatter={(value: number, name: string) => [name === "temp" ? `${value}°م` : `${value}°م`, name === "temp" ? "القراءة" : "الحد الاسمي"]} labelStyle={{ color: "var(--muted)", marginBottom: 4 }} /><Line type="monotone" dataKey="baseline" stroke="#9aa2ac" strokeDasharray="5 5" strokeWidth={1.5} dot={false} /><Line type="monotone" dataKey="temp" stroke="#e5682e" strokeWidth={3} dot={{ fill: "var(--surface)", stroke: "#e5682e", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#e5682e", stroke: "var(--surface)", strokeWidth: 3 }} /></LineChart></ResponsiveContainer></div>
              <div className="chart-footnote"><span className="soft-warning"><AlertTriangle size={14} /> الحد الاسترشادي: 34°م</span><span>يتم تسجيل القراءة كل 20 ثانية</span></div>
            </article>

            <article className="panel alerts-panel">
              <div className="panel-heading"><div><div className="panel-kicker">التنبيهات والملاحظات</div><h2>ما يستحق انتباهك</h2></div><button className="text-button" onClick={() => setFilter(filter === "all" ? "attention" : "all")}>{filter === "all" ? "عرض المهم فقط" : "عرض الكل"}<ArrowUpLeft size={14} /></button></div>
              <div className="alert-list">{visibleAlerts.map((alert) => <div className={`alert-item ${alert.level}`} key={alert.id}><div className="alert-icon">{alert.level === "attention" ? <AlertTriangle size={17} /> : <Check size={17} />}</div><div className="alert-content"><div className="alert-meta"><span>{alert.type}</span><time>{alert.time}</time></div><strong>{alert.title}</strong><span className="alert-vehicle">{alert.vehicle} · {alert.description}</span></div><button className="icon-button subtle" aria-label="خيارات التنبيه"><MoreHorizontal size={16} /></button></div>)}</div>
              <div className="alerts-footer"><span><span className="live-dot" /> يتم التحديث تلقائيًا</span><button className="all-alerts-button">فتح سجل التنبيهات <ArrowDownLeft size={14} /></button></div>
            </article>
          </section>

          <section className="panel fleet-panel">
            <div className="panel-heading fleet-heading"><div><div className="panel-kicker">التغطية الحالية</div><h2>المركبات النشطة <span className="heading-count">{vehicles.length}</span></h2></div><button className="text-button">إدارة المركبات <ArrowUpLeft size={14} /></button></div>
            <div className="fleet-list">{vehicles.map((vehicle) => <button className={`fleet-card ${vehicle.id === selected.id ? "selected" : ""}`} onClick={() => setSelectedId(vehicle.id)} key={vehicle.id}><div className="fleet-card-top"><span className={`vehicle-symbol ${vehicle.status}`}><Radio size={16} /></span><StatusPill status={vehicle.status} compact /></div><div className="fleet-name">{vehicle.name}<span>{vehicle.code}</span></div><div className="fleet-location">{vehicle.location}</div><div className="fleet-reading"><span><Thermometer size={14} /> {vehicle.temperature.toFixed(1)}°م</span><span><Fuel size={14} /> {vehicle.fuel}%</span></div><div className="fleet-bar"><span style={{ width: `${vehicle.fuel}%` }} /></div></button>)}</div>
          </section>

          <footer className="page-footer"><span>Orbital Fire <span className="footer-separator">·</span> نسخة المراقبة 2.4</span><span>المعلومات المعروضة تجريبية لأغراض العرض والتصميم</span></footer>
        </div>
      </main>
    </div>
  );
}
