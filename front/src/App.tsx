import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
   </Router>
  )
}

export default App
