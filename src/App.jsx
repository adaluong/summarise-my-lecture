import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Result from './pages/Result';
import Search from './pages/Search';
import { Container, Navbar } from 'react-bootstrap';
import whitelogo from './white_logo.png'; 

const App = () => {
  
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/"><img src={whitelogo} height={70}></img></Navbar.Brand>
        </Container>
      </Navbar>
      <Route exact path='/' component={Search} />
      <Route exact path='/result/:videoId' component={Result} />
    </Router>
  );
}

export default App;
