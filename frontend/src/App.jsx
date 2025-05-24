import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Subjects from './pages/Subjects'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Subjects />} />

        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
