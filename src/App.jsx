import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Result from './pages/Result';
import Search from './pages/Search';
//import { Container, Navbar } from 'react-bootstrap';
import blacklogo from './black_logo_small.png';
import { Navbar, Image } from 'react-bulma-components';

const theme = {
  maintext: "#2c2c2c",
  background: "#fffff",
  
};


const App = () => {
  
  return (
    <Router>
      <Navbar transparent={true}>
        <Navbar.Brand>
          <Navbar.Item>
            <Link to="/">
              <Image src={blacklogo} alt="summarise my hackathon logo" size="5"></Image>
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
