import './App.css';
import About from './components/About';
import ColorSchemesExample from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
        <ColorSchemesExample />
        <div className="Body">
          <About />
        </div>
    </div>
  );
}

export default App;
