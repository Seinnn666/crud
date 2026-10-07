import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Define your backend URL here
  const API_URL = "http://localhost:5000/students";

  useEffect(() => {
    getStudent();
  }, []);

  const getStudent = () => {
    axios.get(API_URL).then((response) => {
      // Ensure the response is actually an array before setting it
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    }).catch((err) => console.error("Error fetching students:", err));
  };

  const addStudent = () => {
    if (!name || !course || !age) return;
    axios.post(API_URL, { name, course, age }).then(() => {
      getStudent();
      setName("");
      setCourse("");
      setAge("");
    }).catch((err) => console.error("Error adding student:", err));
  };

  const editStudent = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const updateStudent = () => {
    axios.put(`${API_URL}/${editingId}`, { name, course, age }).then(() => {
      getStudent();
      setEditingId(null);
      setName("");
      setCourse("");
      setAge("");
    }).catch((err) => console.error("Error updating student:", err));
  };

  const deleteStudent = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      getStudent();
    }).catch((err) => console.error("Error deleting student:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "white" }}>
      <h1>Student Management System</h1>
      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <br /><br />
      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(event) => setCourse(event.target.value)}
      />
      <br /><br />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />
      <br /><br />
      {editingId ? (
        <button onClick={updateStudent}>Update Student</button>
      ) : (
        <button onClick={addStudent}>Add Student</button>
      )}
      {editingId && (
        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setCourse("");
            setAge("");
          }}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      )}
      <h2>Students List</h2>
      {/* Added ?. to safely map only if students is a valid array */}
      {students?.map((student) => (
        <div key={student._id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <button onClick={() => editStudent(student)}>Edit</button>
          <button onClick={() => deleteStudent(student._id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;