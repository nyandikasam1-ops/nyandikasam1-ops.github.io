import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MediaAdmin from './components/MediaAdmin';
import MediaLibrary from './components/MediaLibrary';
import {
  Abstract, Author, Background, Conclusion, Discussion, Hero, Methods,
  Recommendations, Results,
} from './components/Sections';

export default function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/admin') return <MediaAdmin />;

  return (
    <>
      <a className="skip-link" href="#abstract">Skip to research content</a>
      <Navbar />
      <main>
        <Hero />
        <Abstract />
        <Background />
        <Methods />
        <Results />
        <MediaLibrary />
        <Discussion />
        <Recommendations />
        <Conclusion />
        <Author />
      </main>
      <Footer />
    </>
  );
}
