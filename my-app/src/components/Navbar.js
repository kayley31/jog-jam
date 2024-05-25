import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';
import logogrey from '../images/logogrey.png'

function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="#home"><img className="logo" src={logogrey} /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            <Nav.Link className="navlink" href="#find">Find Playlists</Nav.Link>
            <Nav.Link className="navlink" href="#create">Create Playlists</Nav.Link>
            <Nav.Link className="navlink" href="#my">My Playlists</Nav.Link>
            <Nav.Link className="navlink" href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;