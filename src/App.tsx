import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';
import MobileCallBar from './components/MobileCallBar';
import LeadTracking from './components/LeadTracking';
import Analytics from './components/Analytics';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Ambient Animated Backgrounds */}
      <div className="ambient-background">
        <div className="ambient-blob"></div>
      </div>
      <div className="noise-bg"></div>

      {/* Sticky header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main>
        <PageTransition />
      </main>
      <Footer />
      <Chatbot />
      <MobileCallBar />
      <LeadTracking />
      <Analytics />
    </div>
  );
}

export default App;
