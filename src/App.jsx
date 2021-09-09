import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Result from './pages/Result';
import Search from './pages/Search';
//import { Container, Navbar } from 'react-bootstrap';
import whitelogo from './white_logo.png';
import { Navbar, Image } from 'react-bulma-components';


const App = () => {
  
  return (
    <Router>
      <Navbar transparent={true}>
        <Navbar.Brand>
          <Navbar.Item>
            <Link to="/">
              <Image src={whitelogo} alt="summarise my hackathon logo" size="5"></Image>
            </Link>
          </Navbar.Item>
        </Navbar.Brand>
        
      </Navbar>
      <Route exact path='/' component={Search} />
      <Route exact path='/result/:videoId' component={Result} />
    </Router>
  );
}

export default App;
