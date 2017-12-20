import React, { Component } from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';
import { Route } from 'react-router';
import qs from 'qs';
import DocumentMeta from 'react-document-meta';


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

const getQueryStrings = string => (
  qs.parse(string)
);
const Article = (props) => {
  var strings = getQueryStrings(props.location.search);
  console.log(strings);
  const meta = {
    title: strings.title,
    meta: {
      "og:url": strings.referer,
      "og:type": "article",
      "og:title": strings.title,
      "og:description": strings.desc,
      "og:image": strings.image,
    }
  };
  return (
    <div>
      <div>
        <p>title: {strings.title}</p>
        <p>image: {strings.image}</p>
        <p>referer: {strings.referer}</p>
        <p> description: {strings.desc} </p>
      </div>
      <DocumentMeta {...meta} />
    </div>
  );
};


class App extends Component {
  render() {
    return (
      <div>
        <Header>
          <h1> Create your own news article</h1>
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
              <Route path='/' component={Article} />
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
