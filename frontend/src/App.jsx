import { useEffect, useState } from "react";
import { problemService } from "./services/problemService";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import "./App.css";

function App() {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({});
  const [streak, setStreak] = useState({});
  const [activity, setActivity] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: "", platform: "", difficulty: "Medium", topic: "",
    dateSolved: new Date().toISOString().split("T")[0],
    notes: "", problemUrl: "", important: false, revision: false
  });

  useEffect(() => { refreshData(); }, []);

  const refreshData = async () => {
    try {
      const resP = await problemService.getAll();
      setProblems(resP.data || []);

      const resS = await problemService.getStats();
      setStats(resS.data || {});

      const resSt = await problemService.getStreak();
      setStreak(resSt.data || {});

      const resA = await problemService.getActivity();
      setActivity(resA.data || {});
    } catch (e) { console.error("Load Error", e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await problemService.update(currentId, formData);
      } else {
        // Yahan data ja raha hai
        await problemService.create(formData);
      }

      // Reset form fields
      setFormData({
        title: "", platform: "", difficulty: "Medium", topic: "",
        dateSolved: new Date().toISOString().split("T")[0],
        notes: "", problemUrl: "", important: false, revision: false
      });
      setIsEditing(false);
      setCurrentId(null);

      // Wait for data to save, then refresh table
      await refreshData();
      alert("Done! Table updated.");
    } catch (err) {
      alert("Add failed. Console check karo.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Pakka delete karna hai?")) {
      try {
        await problemService.delete(id);
        await refreshData(); // Refresh list after delete
      } catch (err) {
        alert("Delete nahi ho raha!");
      }
    }
  };

  const pieData = [
    { name: 'Easy', value: stats.Easy || 0, color: '#22c55e' },
    { name: 'Medium', value: stats.Medium || 0, color: '#f59e0b' },
    { name: 'Hard', value: stats.Hard || 0, color: '#ef4444' },
  ];

  return (
    <div className="container">
      <header><h1>CodeTracker<span>.io</span></h1></header>

      <div className="dashboard-row">
        <div className="card stats-card">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData.some(d => d.value > 0) ? pieData.filter(d => d.value > 0) : [{name:'NA', value:1, color:'#334155'}]} innerRadius={65} outerRadius={85} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center"><h2>{stats.total || 0}</h2><p>Solved</p></div>
          </div>
          <div className="legend">
            <div className="leg-item"><span className="dot easy"></span> Easy: {stats.Easy || 0}</div>
            <div className="leg-item"><span className="dot medium"></span> Medium: {stats.Medium || 0}</div>
            <div className="leg-item"><span className="dot hard"></span> Hard: {stats.Hard || 0}</div>
          </div>
        </div>

        <div className="card activity-card">
          <div className="streak-grid">
            <div className="streak-box">🔥 Streak: {streak.currentStreak || 0}</div>
            <div className="streak-box">🏆 Best: {streak.longestStreak || 0}</div>
          </div>
          <div className="heatmap-container">
            {[...Array(100)].map((_, i) => {
              const d = new Date(); d.setDate(d.getDate() - (99 - i));
              const dateStr = d.toISOString().split('T')[0];
              const count = activity[dateStr] || 0;
              return <div key={dateStr} className={`heat-box level-${Math.min(count, 4)}`} title={`${dateStr}: ${count}`}></div>
            })}
          </div>
        </div>
      </div>

      <section className="card form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input placeholder="Topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
            <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
            <input type="date" value={formData.dateSolved} onChange={e => setFormData({...formData, dateSolved: e.target.value})} />
            <input placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
          <button type="submit" className="submit-btn">{isEditing ? "Update" : "Add Problem"}</button>
        </form>
      </section>

      <section className="card table-card">
        <table>
          <thead><tr><th>Date</th><th>Problem</th><th>Notes</th><th>Action</th></tr></thead>
          <tbody>
            {problems.map(p => (
              <tr key={p.id}>
                <td>{p.dateSolved}</td>
                <td><a href={p.problemUrl} target="_blank" className="p-link">{p.title}</a></td>
                <td>{p.notes || "-"}</td>
                <td>
                  <button onClick={() => { setIsEditing(true); setCurrentId(p.id); setFormData(p); }} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="del-btn" style={{marginLeft:'10px'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
export default App;