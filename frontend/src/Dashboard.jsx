import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { problemService } from "./services/problemService";
import Navbar from "./Navbar";
import "./Dashboard.css";

const PLATFORM_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6", "#ec4899"];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") || "User";
  const [problems, setProblems] = useState([]);
  const [streak, setStreak] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("user")) { navigate("/"); return; }
    Promise.all([problemService.getAll(), problemService.getStreak()])
      .then(([pRes, sRes]) => {
        setProblems(pRes.data || []);
        setStreak(sRes.data || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const easy = problems.filter(p => p.difficulty?.toLowerCase() === "easy").length;
  const medium = problems.filter(p => p.difficulty?.toLowerCase() === "medium").length;
  const hard = problems.filter(p => p.difficulty?.toLowerCase() === "hard").length;

  const pieData = [
    { name: "Easy", value: easy, color: "#22c55e" },
    { name: "Medium", value: medium, color: "#f59e0b" },
    { name: "Hard", value: hard, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const platformMap = {};
  problems.forEach(p => {
    const pl = p.platform || "Other";
    platformMap[pl] = (platformMap[pl] || 0) + 1;
  });
  const platformData = Object.entries(platformMap).map(([name, value]) => ({ name, value }));

  // Last 7 days activity
  const activityMap = {};
  problems.forEach(p => { if (p.dateSolved) activityMap[p.dateSolved] = (activityMap[p.dateSolved] || 0) + 1; });
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return { day: d.toLocaleDateString("en", { weekday: "short" }), count: activityMap[key] || 0 };
  });

  // Heatmap last 70 days
  const heatDays = Array.from({ length: 70 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (69 - i));
    const key = d.toISOString().split("T")[0];
    const count = activityMap[key] || 0;
    return { key, count, level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4 };
  });

  const recentProblems = [...problems].sort((a, b) => new Date(b.dateSolved) - new Date(a.dateSolved)).slice(0, 5);

  if (loading) return <div className="dash-loading"><div className="spinner" /><p>Loading...</p></div>;

  return (
    <div className="dash-page">
      <Navbar />
      <div className="dash-container">

        {/* WELCOME */}
        <div className="dash-welcome">
          <div>
            <h2>Welcome back, <span>{user}</span> 👋</h2>
            <p>Here's your coding progress at a glance</p>
          </div>
          <button className="add-prob-btn" onClick={() => navigate("/problems")}>+ Log Problem</button>
        </div>

        {/* STAT CARDS */}
        <div className="dash-stats">
          {[
            { label: "Total Solved", value: problems.length, color: "#6366f1", icon: "🎯" },
            { label: "Easy", value: easy, color: "#22c55e", icon: "🟢" },
            { label: "Medium", value: medium, color: "#f59e0b", icon: "🟡" },
            { label: "Hard", value: hard, color: "#ef4444", icon: "🔴" },
            { label: "Current Streak", value: `${streak.currentStreak || 0}d`, color: "#f97316", icon: "🔥" },
            { label: "Longest Streak", value: `${streak.longestStreak || 0}d`, color: "#a855f7", icon: "🏆" },
          ].map((s) => (
            <div className="stat-card" key={s.label} style={{ "--accent": s.color }}>
              <span className="stat-icon">{s.icon}</span>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="dash-charts">

          {/* DIFFICULTY PIE */}
          <div className="chart-card">
            <h3>Difficulty Breakdown</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map(d => (
                    <span key={d.name} className="legend-item">
                      <span className="legend-dot" style={{ background: d.color }} />
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </>
            ) : <p className="no-data">No data yet</p>}
          </div>

          {/* PLATFORM PIE */}
          <div className="chart-card">
            <h3>Platform Distribution</h3>
            {platformData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={platformData} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {platformData.map((_, i) => <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {platformData.map((d, i) => (
                    <span key={d.name} className="legend-item">
                      <span className="legend-dot" style={{ background: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }} />
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </>
            ) : <p className="no-data">No data yet</p>}
          </div>

          {/* WEEKLY BAR */}
          <div className="chart-card">
            <h3>Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={last7} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#e2e8f0" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* HEATMAP */}
        <div className="heatmap-card">
          <h3>Activity Heatmap <span>(Last 70 days)</span></h3>
          <div className="heatmap-grid">
            {heatDays.map(d => (
              <div key={d.key} className={`heat-cell level-${d.level}`} title={`${d.key}: ${d.count} problems`} />
            ))}
          </div>
          <div className="heat-legend">
            <span>Less</span>
            {[0,1,2,3,4].map(l => <div key={l} className={`heat-cell level-${l}`} />)}
            <span>More</span>
          </div>
        </div>

        {/* RECENT PROBLEMS */}
        <div className="recent-card">
          <div className="recent-header">
            <h3>Recent Problems</h3>
            <button onClick={() => navigate("/problems")} className="view-all-btn">View All →</button>
          </div>
          {recentProblems.length === 0 ? (
            <p className="no-data">No problems logged yet. <button className="link-btn" onClick={() => navigate("/problems")}>Add one →</button></p>
          ) : (
            <div className="recent-list">
              {recentProblems.map(p => (
                <div key={p.id} className="recent-item">
                  <div className="recent-left">
                    {p.problemUrl
                      ? <a href={p.problemUrl} target="_blank" rel="noreferrer" className="recent-title">{p.title}</a>
                      : <span className="recent-title" style={{ cursor: "default" }}>{p.title}</span>
                    }
                    <span className="recent-meta">{p.platform} · {p.dateSolved}</span>
                  </div>
                  <div className="recent-right">
                    {p.topic && <span className="topic-badge">{p.topic}</span>}
                    <span className={`diff-badge ${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
