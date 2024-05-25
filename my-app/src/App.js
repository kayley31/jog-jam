import './App.css';
import About from './components/About';
import Header from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
        <Header />
        <div className="Body">
          <About />
        </div>
    </div>
  );
}

export default App;
