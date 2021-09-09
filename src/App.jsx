import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Result from './pages/Result';
import Search from './pages/Search';
//import { Container, Navbar } from 'react-bootstrap';
import blacklogo from './black_logo.png';
import { Navbar, Image } from 'react-bulma-components';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  maintext: "#2c2c2c",
  background: "#fffff",
  accent: "#44d9e6"
};


const App = () => {
  
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Navbar transparent={true}>
          <Navbar.Brand>
            <Navbar.Item>
              <Link to="/">
                <img src={blacklogo} alt="summarise my hackathon logo" height="100"></img>
              </Link>
            </Navbar.Item>
          </Navbar.Brand>
          
        </Navbar>
        <Route exact path='/' component={Search} />
        <Route exact path='/result/:videoId' component={Result} />
      </ThemeProvider>
    </Router>
  );
}

export default App;
