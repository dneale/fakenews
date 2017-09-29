import React, { Component } from 'react';
import faker from 'faker';
import { Header, Input, Form, Grid, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import logo from './logo.svg';
import './App.css';

const GameHeader = styled.div`
  padding: 2em 0;
  color: white;
  background-color: #222;
  text-align:center;
  border-bottom: solid 1em papayawhip;
  margin-bottom: 1em;
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
    const random = faker.random.word();
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
    this.updateGame(this.state.currentAnswer.you);
  };

  updateGame(word) {

    const currentAnswer = {
      computer: this.state.currentAnswer.computer,
      you: word,
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

    if (currentAnswer.computer.toLowerCase() === currentAnswer.you.toLowerCase()) {
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
      <p> You will be playing against a computer who will also submit a word. Then you associate again off those words. This is repeated until you both say the same word and CONVERGENCE is achieved. </p>
      <p> To begin, first enter a word, or <a onClick={this.pickRandom}> choose a random one</a></p>
    </p>
  );

  wordForm = () => (
    <Form size="big" autoComplete="off">
      <Form.Field>
        <Input action={
          <Button disabled={!this.state.currentAnswer.computer || !this.state.currentAnswer.you} type="submit"
                               onClick={this.submitWord}>
          Submit word
        </Button>} type="text" name="word" value={this.state.currentAnswer.you} onChange={this.updateWord}/>
      </Form.Field>

      <p style={{color: 'red'}}>{this.state.error}</p>
    </Form>
  );

  endGameState = () => (
    <div>
      <h1 style={{color: 'green'}}> CONVERGENCE!</h1>
      <button onClick={this.resetState}> Reset game</button>
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
      <p> Now think of a word that relates to both <b>{this.state.prevAnswer.you}</b> and <b>{this.state.prevAnswer.computer}</b></p>
    </p>
  );


  render() {
    return (
      <div>
        <GameHeader>
          <h1> Convergence with a Computer </h1>
          <p> Made by Doug</p>
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

              {this.wordForm()}
              {this.state.convergence &&
                this.endGameState()
              }
              counter: {this.state.counter}
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
