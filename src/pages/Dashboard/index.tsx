import React, { useState, FormEvent, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from 'react-router-dom';
import api from "../../services/api";

import { Title, Form, Repositories, Error } from "./styles"
import logoImg from '../../assets/logo.svg';


interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@GitHubExplorer:repositories');
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];

  });



  useEffect(() => {
    localStorage.setItem('@GitHubExplorer:repositories', JSON.stringify(repositories))
  }, [repositories]);


  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o repostorio');
      return
    }

    try {
      const responste = await api.get<Repository>(`repos/${newRepo}`)
      const repository = responste.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Ocorreu um erro');
    }

  }



  return (
    <>
      <img src={logoImg} alt="Github" />
      <Title>Explore repositorios no Github</Title>

      <Form hasHerror={Boolean(inputError)} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite aqui" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}


      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}

      </Repositories>

    </>
  );
}

export default Dashboard;
