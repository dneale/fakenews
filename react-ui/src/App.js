import React, { Component } from 'react';
import faker from 'faker';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
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
      if (!wordObj.tags || !wordObj.tags.includes('n')) {
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
      }
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Convergence with a Computer </h1>
        {!this.state.prevAnswer &&
          <p> Enter a word, or <a onClick={this.pickRandom}> choose a random one</a></p>
        }
        {this.state.prevAnswer &&
          <div>
            {this.state.prevQuestion &&
            <div>
              <p> the two words were <b>{this.state.prevQuestion.you}</b> and <b>{this.state.prevQuestion.computer}</b></p>
            </div>
            }
            <p><b>You said </b>{this.state.prevAnswer.you} </p>
            <p><b>The computer said: </b>{this.state.prevAnswer.computer} </p>
          </div>
        }
        <form>
          <input type="text" name="word" value={this.state.currentAnswer.you} onChange={this.updateWord} />
          <input disabled={!this.state.currentAnswer.computer || !this.state.currentAnswer.you} type="submit" onClick={this.submitWord} />
          <p style={{color:'red'}}>{this.state.error}</p>
        </form>
        {this.state.convergence &&
          <h1 style={{color:'green'}}> CONVERGENCE!</h1>
        }
      </div>
    );
  }
}

export default App;
