import { useEffect, useState } from "react";
import { problemService } from "./services/problemService";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {

  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({});
  const [streak, setStreak] = useState({});
  const [activity, setActivity] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    difficulty: "Medium",
    topic: "",
    dateSolved: new Date().toISOString().split("T")[0],
    notes: "",
    problemUrl: "",
    important: false,
    revision: false,
  });

  useEffect(() => {
    loadProblems();
    loadStats();
    loadStreak();
    loadActivity();
  }, []);

  // LOAD ALL PROBLEMS
  const loadProblems = async () => {
    try {
      const res = await problemService.getAll();
      setProblems(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // LOAD STATS
  const loadStats = async () => {
    try {

      const res = await problemService.getAll();
      const data = res.data || [];

      const easy = data.filter(p => p.difficulty?.toLowerCase() === "easy").length;
      const medium = data.filter(p => p.difficulty?.toLowerCase() === "medium").length;
      const hard = data.filter(p => p.difficulty?.toLowerCase() === "hard").length;

      // PLATFORM STATS
      const platformStats = {};

      data.forEach(p => {
        const platform = p.platform || "Other";
        platformStats[platform] = (platformStats[platform] || 0) + 1;
      });

      setStats({
        total: data.length,
        easy,
        medium,
        hard,
        platformStats
      });

    } catch (e) {
      console.error(e);
    }
  };

  // LOAD STREAK
  const loadStreak = async () => {
    try {
      const res = await problemService.getStreak();
      setStreak(res.data || {});
    } catch (e) {
      console.error(e);
    }
  };

  // LOAD ACTIVITY
  const loadActivity = async () => {
    try {
      const res = await problemService.getActivity();
      setActivity(res.data || {});
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (problem) => {
    setIsEditing(true);
    setCurrentId(problem.id);
    setFormData(problem);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (isEditing) {
        await problemService.update(currentId, formData);
        setIsEditing(false);
        setCurrentId(null);
      } else {
        await problemService.create(formData);
      }

      setFormData({
        title: "",
        platform: "",
        difficulty: "Medium",
        topic: "",
        dateSolved: new Date().toISOString().split("T")[0],
        notes: "",
        problemUrl: "",
        important: false,
        revision: false,
      });

      loadProblems();
      loadStats();
      loadStreak();
      loadActivity();

    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try {
        await problemService.delete(id);

        loadProblems();
        loadStats();
        loadStreak();
        loadActivity();

      } catch (err) {
        console.error(err);
      }
    }
  };

  // DIFFICULTY PIE DATA
  const pieData = [
    { name: "Easy", value: stats.easy || 0, color: "#22c55e" },
    { name: "Medium", value: stats.medium || 0, color: "#f59e0b" },
    { name: "Hard", value: stats.hard || 0, color: "#ef4444" },
  ];

  // PLATFORM DATA
  const platformData = Object.entries(stats.platformStats || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="container">

      <header>
        <h1>CodeTracker<span>.io</span></h1>
        <p>Your personal LeetCode & Competitive Programming log</p>
      </header>

      {/* STATS */}
      <section className="stats-section">

        <div className="stat-card">

          <div style={{ width: "100px", height: "100px", margin: "auto" }}>
            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  innerRadius={35}
                  outerRadius={45}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

              </PieChart>

            </ResponsiveContainer>
          </div>

          <h3>Total</h3>
          <p>{stats.total || 0}</p>

        </div>

        <div className="stat-card">
          <h3>Easy</h3>
          <p>{stats.easy || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Medium</h3>
          <p>{stats.medium || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Hard</h3>
          <p>{stats.hard || 0}</p>
        </div>

      </section>

      {/* STREAK */}
      <section className="streak-section">

        <div className="streak-card">
          <h3>Current Streak</h3>
          <p>{streak.currentStreak || 0} days</p>
        </div>

        <div className="streak-card">
          <h3>Longest Streak</h3>
          <p>{streak.longestStreak || 0} days</p>
        </div>

      </section>

      {/* ACTIVITY */}
{/*       <section className="activity-section"> */}

{/*         <h3>Activity</h3> */}

{/*        <div className="heatmap"> */}
{/*          {Array.from({ length: 30 }).map((_, i) => { */}

{/*            const date = new Date(); */}
{/*            date.setDate(date.getDate() - i); */}

{/*            const key = */}
{/*              date.getFullYear() + */}
{/*              "-" + */}
{/*              String(date.getMonth() + 1).padStart(2, "0") + */}
{/*              "-" + */}
{/*              String(date.getDate()).padStart(2, "0"); */}

{/*            const count = activity[key] || 0; */}

{/*            return ( */}
{/*              <div */}
{/*                key={key} */}
{/*                className={`heat-box level-${Math.min(count, 4)}`} */}
{/*                title={`${key} : ${count}`} */}
{/*              ></div> */}
{/*            ); */}
{/*          })} */}
{/*        </div> */}

{/*       </section> */}

      {/* PLATFORM DISTRIBUTION */}
    <section className="platform-section">

    <h3>Platform Distribution</h3>

    <div style={{ width: "420px", height: "300px", margin: "auto" }}>

    <ResponsiveContainer>

    <PieChart>

    <Pie
      data={platformData}
      dataKey="value"
      outerRadius={110}
      label={({ name, value }) => `${name} ${value}`}
    >

    {platformData.map((entry, index) => (

    <Cell
    key={index}
    fill={[
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#14b8a6"
    ][index % 5]}
    />

    ))}

    </Pie>

    </PieChart>

    </ResponsiveContainer>

    </div>

    </section>

      {/* FORM */}
      <section className="input-section">

        <form onSubmit={handleSubmit} className="tracker-form">

          <h3>{isEditing ? "Update Problem" : "Log New Problem"}</h3>

          <div className="input-group">

            <input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <input
              placeholder="Platform"
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            />

            <input
              placeholder="Topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
            />

            <input
              placeholder="Problem URL"
              value={formData.problemUrl}
              onChange={(e) =>
                setFormData({ ...formData, problemUrl: e.target.value })
              }
            />

            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <input
              type="date"
              value={formData.dateSolved}
              onChange={(e) =>
                setFormData({ ...formData, dateSolved: e.target.value })
              }
            />

          </div>

          <textarea
            placeholder="Notes..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <div className="checkbox-group">

            <label>
              <input
                type="checkbox"
                checked={formData.important}
                onChange={(e) =>
                  setFormData({ ...formData, important: e.target.checked })
                }
              />
              Important
            </label>

            <label>
              <input
                type="checkbox"
                checked={formData.revision}
                onChange={(e) =>
                  setFormData({ ...formData, revision: e.target.checked })
                }
              />
              Revision
            </label>

          </div>

          <button type="submit" className="save-btn">
            {isEditing ? "Update Entry" : "Log Problem"}
          </button>

        </form>

      </section>

      {/* TABLE */}

      <section className="table-section">

      <table>

      <thead>

      <tr>
      <th>Date</th>
      <th>Problem</th>
      <th>Platform</th>
      <th>Topic</th>
      <th>Level</th>
      <th>Important</th>
      <th>Revision</th>
      <th>Action</th>
      </tr>

      </thead>

      <tbody>

      {problems.map((p) => (

      <tr key={p.id}>

      <td>{p.dateSolved}</td>

      <td>

      <a
      href={p.problemUrl}
      target="_blank"
      rel="noreferrer"
      className="prob-title"
      >
      {p.title}
      </a>

      <div className="prob-notes">
      {p.notes}
      </div>

      </td>

      <td>{p.platform}</td>

      <td>
      <span className="topic-tag">
      {p.topic}
      </span>
      </td>

      <td>
      <span className={`diff-tag ${p.difficulty}`}>
      {p.difficulty}
      </span>
      </td>

      <td>
      {p.important ? "⭐" : "-"}
      </td>

      <td>
      {p.revision ? "🔁" : "-"}
      </td>

      <td className="actions-cell">

      <button
      onClick={() => handleEditClick(p)}
      className="edit-btn"
      >
      Edit
      </button>

      <button
      onClick={() => handleDelete(p.id)}
      className="del-btn"
      >
      Delete
      </button>

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