import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';
import logogrey from '../images/logogrey.png'
import { Link } from 'react-router-dom';


function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
          <Navbar.Brand as={Link} to="/"><img className="logo" src={logogrey} alt= "jogjam logo"/></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            </Nav>
          <Nav>
            <Nav.Item className="nav-item">
              <Nav.Link as={Link} to="/find">Find Playlists</Nav.Link>
            </Nav.Item>
            <Nav.Item className="nav-item">
              <Nav.Link as={Link} to="/create">Create Playlists</Nav.Link>
            </Nav.Item>
            <Nav.Item className="nav-item">
              <Nav.Link as={Link} to="/my">My Playlists</Nav.Link>
            </Nav.Item>
            <Nav.Item className="nav-item">
              <Nav.Link as={Link} to="/about">About</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;