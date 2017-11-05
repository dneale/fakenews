import React, {Component} from 'react';
import {Header, Container, Grid} from 'semantic-ui-react';
import styled from 'styled-components';

const TopBar = styled.div`
    height: 20em;
    background-color:
`

class Convergence extends Component {

    constructor(props) {
        super(props);
        this.state = {
            word: '',
            wordSubmitted: false,
        }
    }

    render() {
        return (
            <div>
                <TopBar>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header size='huge'>Convergence</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </TopBar>

                <Container>
                    <Grid>
                        <Grid.Row>

                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}

export default Convergence;