import React, { Component } from 'react';
import { FaGitAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Form, SubmitButton, List } from './styles';
import Container from '../../components/container'
import { Link } from 'react-router-dom'

import api from '../services/api'

export default class Main extends Component {
    state = {
        newRepo: '',
        reposistories: [],
        loading: false
    };

    componentDidMount() {
        const repositories = localStorage.getItem('repositories')
        if (repositories) {
            this.setState({ reposistories: JSON.parse(repositories) })
        }
    }
    componentDidUpdate(_, prevState) {
        const { reposistories } = this.state
        if (prevState.reposistories !== reposistories) {
            localStorage.setItem('repositories', JSON.stringify(reposistories))
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value })
    };

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { newRepo, reposistories } = this.state
        const response = await api.get(`/repos/${newRepo}`);
        const data = {
            name: response.data.full_name,
        }
        this.setState({
            reposistories: [...reposistories, data],
            newRepo: '',
            loading: false
        })
    }
    render() {
        const { newRepo, loading, reposistories } = this.state
        return (
            <Container>
                <h1>
                    <FaGitAlt />
                    Repositorios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        placeholder="Adicionar repositoriio"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? <FaSpinner color="#FFF" size={8} /> : <FaPlus color="#FFF" size={8} />}
                    </SubmitButton>
                </Form>
                <List>
                    {reposistories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`} >Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>


        );

    }
}
