import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Ambient Animated Backgrounds */}
        <div className="ambient-background">
          <div className="ambient-blob"></div>
        </div>
        <div className="noise-bg"></div>

        <Header />
        <main>
          <PageTransition />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;