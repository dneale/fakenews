import React, { Component } from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';


import './App.css';

const Header = styled.div`
  padding: 2em 0 0 0;
  text-align:center;
  h1 {
    font-size: 3em;
    font-family: 'Francois One', sans-serif;  
  }
  p {
    position: relative;   
    text-align: center;
    span {
      background-color: white;
      z-index: 99;
      position: relative;
      top: -16px;  
      padding: 0 1em; 
      margin-right: 1em;   
    }
    hr {
      border: solid 2px #CCC;
      max-width: 700px;
      margin-top: 0;
      margin-bottom: 0;
      padding: 0;
      
    }
  }
  margin: 1em;
  margin-bottom: 0;
`;


class App extends Component {
  render() {
    return (
      <div>
        <Header>
          <h1> Default Template</h1>
          <p> 
            <hr />
            <span>
            By <a href="http://dougneale.com">Doug</a>              
            </span>          
          </p>
        </Header>
        <Grid padded className={this.props.className}>
          <Grid.Row centered>
            <Grid.Column mobile={16} tablet={10} computer={10} largeScreen={6}>
              Content can go here
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default styled(App)`
  font-size: 18px;
`;
