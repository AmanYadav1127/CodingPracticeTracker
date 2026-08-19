import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { problemService } from "./services/problemService";
import Navbar from "./Navbar";
import "./Problems.css";

const EMPTY_FORM = {
  title: "", platform: "LeetCode", difficulty: "Medium",
  topic: "", dateSolved: new Date().toISOString().split("T")[0],
  notes: "", problemUrl: "", important: false, revision: false,
};

const PLATFORMS = ["LeetCode", "Codeforces", "GFG", "HackerRank", "Other"];

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) { navigate("/"); return; }
    load();
  }, []);

  const load = async () => {
    try {
      const res = await problemService.getAll();
      setProblems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await problemService.update(currentId, formData);
      } else {
        await problemService.create(formData);
      }
      setFormData(EMPTY_FORM);
      setIsEditing(false);
      setCurrentId(null);
      setShowForm(false);
      await load();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to save. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p) => {
    setFormData(p);
    setIsEditing(true);
    setCurrentId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await problemService.delete(id);
      load();
    } catch (err) { console.error(err); }
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const filtered = problems.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.topic?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === "All" || p.difficulty === filterDiff;
    const matchPlatform = filterPlatform === "All" || p.platform === filterPlatform;
    return matchSearch && matchDiff && matchPlatform;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.dateSolved) - new Date(a.dateSolved));

  return (
    <div className="prob-page">
      <Navbar />
      <div className="prob-container">

        {/* HEADER */}
        <div className="prob-header">
          <div>
            <h2>Problems</h2>
            <p>{problems.length} problems logged</p>
          </div>
          <button className="add-btn" onClick={() => { if (isEditing) { handleCancel(); } else { setShowForm(v => !v); } }}>
            {showForm && !isEditing ? "✕ Cancel" : "+ Log Problem"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="form-card">
            <h3>{isEditing ? "✏️ Edit Problem" : "➕ Log New Problem"}</h3>
            <form onSubmit={handleSubmit} className="prob-form">
              <div className="form-grid">
                <div className="form-field span-2">
                  <label>Problem Title *</label>
                  <input placeholder="e.g. Two Sum" value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label>Platform</label>
                  <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Difficulty</label>
                  <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Topic / Tag</label>
                  <input placeholder="e.g. Arrays, DP" value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Date Solved</label>
                  <input type="date" value={formData.dateSolved}
                    onChange={e => setFormData({ ...formData, dateSolved: e.target.value })} />
                </div>
                <div className="form-field span-2">
                  <label>Problem URL</label>
                  <input placeholder="https://leetcode.com/problems/..." value={formData.problemUrl}
                    onChange={e => setFormData({ ...formData, problemUrl: e.target.value })} />
                </div>
                <div className="form-field span-2">
                  <label>Notes</label>
                  <textarea placeholder="Approach, key observations..." value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </div>
              <div className="form-bottom">
                <div className="check-group">
                  <label className="check-label">
                    <input type="checkbox" checked={formData.important}
                      onChange={e => setFormData({ ...formData, important: e.target.checked })} />
                    <span>⭐ Important</span>
                  </label>
                  <label className="check-label">
                    <input type="checkbox" checked={formData.revision}
                      onChange={e => setFormData({ ...formData, revision: e.target.checked })} />
                    <span>🔁 Needs Revision</span>
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? "Saving..." : isEditing ? "Update Problem" : "Log Problem"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* FILTERS */}
        <div className="filters-bar">
          <input className="search-input" placeholder="🔍  Search by title or topic..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-group">
            {["All", "Easy", "Medium", "Hard"].map(d => (
              <button key={d} className={`filter-btn ${filterDiff === d ? "active-" + d.toLowerCase() : ""}`}
                onClick={() => setFilterDiff(d)}>{d}</button>
            ))}
          </div>
          <select className="platform-filter" value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}>
            <option value="All">All Platforms</option>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* TABLE */}
        <div className="table-card">
          {loading ? (
            <div className="table-loading"><div className="spinner" /></div>
          ) : sorted.length === 0 ? (
            <div className="table-empty">
              <p>🎯 No problems found.</p>
              <button className="add-btn" onClick={() => setShowForm(true)}>Log your first problem</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem</th>
                    <th>Platform</th>
                    <th>Topic</th>
                    <th>Difficulty</th>
                    <th>Date</th>
                    <th>Flags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => (
                    <tr key={p.id}>
                      <td className="row-num">{i + 1}</td>
                      <td className="prob-cell">
                        {p.problemUrl
                          ? <a href={p.problemUrl} target="_blank" rel="noreferrer" className="prob-link">{p.title}</a>
                          : <span className="prob-link" style={{ cursor: "default" }}>{p.title}</span>
                        }
                        {p.notes && <div className="prob-note">{p.notes}</div>}
                      </td>
                      <td>
                        <span className={`platform-tag ${p.platform?.toLowerCase().replace(/\s/g, "")}`}>
                          {p.platform}
                        </span>
                      </td>
                      <td>{p.topic && <span className="topic-tag">{p.topic}</span>}</td>
                      <td>
                        <span className={`diff-tag ${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                      </td>
                      <td className="date-cell">{p.dateSolved}</td>
                      <td className="flags-cell">
                        {p.important && <span title="Important">⭐</span>}
                        {p.revision && <span title="Needs Revision">🔁</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
