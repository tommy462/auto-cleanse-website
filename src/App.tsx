import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';
import MayMadnessBanner from './components/MayMadnessBanner';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Ambient Animated Backgrounds */}
      <div className="ambient-background">
        <div className="ambient-blob"></div>
      </div>
      <div className="noise-bg"></div>

      {/* Sticky shell — header + promo banner stick together as one unit */}
      <div className="sticky top-0 z-50">
        <Header />
        <MayMadnessBanner />
      </div>
      <main>
        <PageTransition />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;