import './App.css';
import About from './components/About';
import Header from './components/Navbar';
import Footer from './components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
        <Header />
        <div className="Body">
          <About />
        </div>
        <Footer />
    </div>
  );
}

export default App;
