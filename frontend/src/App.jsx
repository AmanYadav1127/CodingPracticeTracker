import { useEffect, useState } from 'react';
import { problemService } from './services/problemService';
import './App.css';

function App() {
  const [problems, setProblems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', platform: '', difficulty: 'Medium',
    topic: '', dateSolved: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => { loadProblems(); }, []);

  const loadProblems = async () => {
    try {
      const res = await problemService.getAll();
      setProblems(res.data);
    } catch (err) { console.error("Fetch failed"); }
  };

  // NEW: Load data into form for editing
  const handleEditClick = (problem) => {
    setIsEditing(true);
    setCurrentId(problem.id);
    setFormData({
      title: problem.title,
      platform: problem.platform,
      difficulty: problem.difficulty,
      topic: problem.topic,
      dateSolved: problem.dateSolved,
      notes: problem.notes
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
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
      // Reset form
      setFormData({ title: '', platform: '', difficulty: 'Medium', topic: '', dateSolved: new Date().toISOString().split('T')[0], notes: '' });
      loadProblems();
    } catch (err) { alert("Action failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await problemService.delete(id);
      loadProblems();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>CodeTracker<span>.io</span></h1>
        <p>Your personal LeetCode & Competitive Programming log</p>
      </header>

      <main>
        <section className="input-section">
          <form onSubmit={handleSubmit} className="tracker-form">
            <h3>{isEditing ? "Update Problem" : "Log New Problem"}</h3>
            <div className="input-group">
              <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <input placeholder="Platform" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} />
              <input placeholder="Topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
              <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
              <input type="date" value={formData.dateSolved} onChange={e => setFormData({...formData, dateSolved: e.target.value})} />
            </div>
            <textarea placeholder="Notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />

            <div className="button-group">
               <button type="submit" className="save-btn">{isEditing ? "Update Entry" : "Log Problem"}</button>
               {isEditing && <button type="button" className="cancel-btn" onClick={() => {setIsEditing(false); setFormData({title:'', platform:'', difficulty:'Medium', topic:'', dateSolved: new Date().toISOString().split('T')[0], notes:''})}}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="table-section">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Problem</th><th>Platform</th><th>Topic</th><th>Level</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map(p => (
                <tr key={p.id}>
                  <td>{p.dateSolved}</td>
                  <td>
                    <div className="prob-title">{p.title}</div>
                    <div className="prob-notes">{p.notes}</div>
                  </td>
                  <td>{p.platform}</td>
                  <td><span className="topic-tag">{p.topic}</span></td>
                  <td><span className={`diff-tag ${p.difficulty}`}>{p.difficulty}</span></td>
                  <td className="actions-cell">
                    <button onClick={() => handleEditClick(p)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="del-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;