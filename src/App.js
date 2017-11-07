import React, { Component } from 'react';
import faker from 'faker';
import { Input, Form, Grid, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import './App.css';

const GameHeader = styled.div`
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
      top: -12px;  
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



const defaultState = {
  prevQuestion: null,
  prevAnswer: null,
  currentAnswer: {
    computer: faker.random.word(),
    you: "",
  },
  usedWords: [],
  loading: "",
  error: "",
  convergence: false,
  counter: 0,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  resetState = () => {
    this.setState(defaultState);
  }

  pickRandom = () => {
    const random = faker.random.word().split(' ')[0].toLowerCase();
    this.setState({
      currentAnswer: {
        ...this.state.currentAnswer,
        you: random,
      }
    });
    this.updateGame(random);
  }

  submitWord = (event) => {
    event.preventDefault();
    this.nameInput.focus();
    this.updateGame(this.state.currentAnswer.you.trim());
  };

  updateGame(word) {

    const currentAnswer = {
      computer: this.state.currentAnswer.computer,
      you: word,
    }
    if (currentAnswer.you === '') {
      this.setState({
        error: "You can't enter a blank word",
      });
      return;
    }
    if (this.state.usedWords.includes(currentAnswer.you.toLowerCase())) {
      this.setState({
        error: "That word has been used already",
      });
      return;
    }
    if (currentAnswer.you.includes(' ')) {
      this.setState({
        error: "single words only",
      });
      return;
    }
    try {
      global.ga('send', {
        hitType: 'event',
        eventCategory: 'Game',
        eventAction: 'submit',
        eventLabel: 'attempt'
      });
    } catch (e) {
      console.log('event failed to send');
    }

    

    if (currentAnswer.computer.toLowerCase() === currentAnswer.you.toLowerCase()) {
      try {
        global.ga('send', {
          hitType: 'event',
          eventCategory: 'Game',
          eventAction: 'submit',
          eventLabel: 'convergence',
          eventValue: this.state.counter,
        });
      } catch (e) {
        console.log('event failed to send');
      }
      this.setState({
        convergence: true,
      });
    }

    this.setState({
      prevAnswer: currentAnswer,
      prevQuestion: this.state.prevAnswer,
      currentAnswer: {
        computer: "",
        you: "",
      },
      usedWords: [
        ...this.state.usedWords,
        currentAnswer.you.toLowerCase(),
        currentAnswer.computer.toLowerCase(),
      ],
      error: "",
      counter: this.state.counter + 1,
    });

    fetch(`https://api.datamuse.com/words?ml=${currentAnswer.computer}+${currentAnswer.you}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then(json => {
        const topWord = this.getWord(json);
        this.setState({
          currentAnswer: {
            ...this.state.currentAnswer,
            computer: topWord,
          },
        })
      });
  };

  getWord = (wordList) => {
    let unusedWords = wordList.filter((wordObj) => {
      const word = wordObj.word;
      if (this.state.usedWords.includes(word.toLowerCase())) {
        return false;
      }
      if (!wordObj.tags || !wordObj.tags.includes('n') || wordObj.tags.includes('prop') || word.includes(' ')) {
        return false;
      }
      return true;
    });
    return unusedWords[0].word;
  };

  updateWord = (event) => {
    this.setState({
      currentAnswer: {
        ...this.state.currentAnswer,
        you: event.target.value,
        error: false,
      }
    });
  };

  startScreen = () => (
    <p>
      <p> Convergence (aka Mind Meld) is a word association game. You are given two words and you respond by submitting a word that relates to both of them. For example...</p>
      <p style={{textAlign:'center'}}> <b>King</b> and <b>Son</b> becomes <b>Prince</b> </p>
      <p style={{textAlign:'center'}}> <b>Amphitheatre</b> and <b>Rome</b> becomes <b>Colosseum</b> </p>
      <p> You will be playing against a computer who will also submit a word. Then you associate again off those words. This is repeated until you both say the same word and <span role="img" aria-label="yay">🎉</span>  CONVERGENCE is achieved. </p>
      <p> To begin, first enter a word, or <a onClick={this.pickRandom}> choose a random one</a></p>
    </p>
  );

  wordForm = () => (
    <Form size="big" autoComplete="off">
      <Form.Field>
        <Input 
        ref={(input) => { this.nameInput = input; }}
        action={
          <Button disabled={!this.state.currentAnswer.computer || !this.state.currentAnswer.you} type="submit"
                               onClick={this.submitWord}>
          Submit word
        </Button>} type="text" name="word" value={this.state.currentAnswer.you} onChange={this.updateWord}/>
      </Form.Field>

      <p style={{color: 'red'}}>{this.state.error}</p>
    </Form>
  );

  endGameState = () => (
    <div className="endgame">
      <h1 style={{color: 'green'}}><span role="img" aria-label="yay">🎉</span>&nbsp;CONVERGENCE!</h1>
      <p> It took you {this.state.counter} attempts </p>                    
      <Button className="reset" onClick={this.resetState}> Reset game</Button>      
    </div>
  );

  answers = () => (
    <p style={{textAlign:'center'}}>
      {this.state.prevQuestion &&
      <p> The two words were <b>{this.state.prevQuestion.you}</b> and <b>{this.state.prevQuestion.computer}</b></p>
      }
      {!this.state.prevQuestion &&
      <p> You and the computer were both asked for words </p>
      }
      <p>You said <h2>{this.state.prevAnswer.you}</h2></p>
      <p>The computer said<h2>{this.state.prevAnswer.computer}</h2></p>
      {!this.state.convergence &&
        <p> Now think of a word that relates to both <b>{this.state.prevAnswer.you}</b> and <b>{this.state.prevAnswer.computer}</b></p>
      }
    </p>
  );


  render() {
    return (
      <div>
        <GameHeader>
          <h1> Convergence with a Computer&nbsp;<span role="img" aria-label="robot face">🤖</span></h1>
          <p> 
            <hr />
            <span>
            By <a href="http://dougneale.com">Doug</a>              
            </span>          
          </p>
        </GameHeader>
        <Grid padded className={this.props.className}>
          <Grid.Row centered>
            <Grid.Column mobile={16} tablet={10} computer={10} largeScreen={6}>
              {!this.state.prevAnswer &&
              <this.startScreen/>
              }
              {this.state.prevAnswer &&
                <this.answers />
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>

              {!this.state.convergence && 
                this.wordForm()
              }
              {this.state.convergence &&
                this.endGameState()
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default styled(App)`
  font-size: 18px;
  .reset {
    padding: 1em;
  }
  .endgame {
    text-align: center;
  }
`;
