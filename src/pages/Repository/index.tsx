import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../services/api";


import { Header, RepositoryInfo, Issues } from "./styles";

import logoImg from '../../assets/logo.svg';



interface RepositoryParams {
  repository: string
}

interface RepositoryInterface {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
}

interface IssuesInterface {
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {

  const [repository, setrepository] = useState<RepositoryInterface | null>(null);
  const [issues, setIssues] = useState<IssuesInterface[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setrepository(response.data);

    });
    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);

    });

  }, [params.repository]);





  return (
    <>
      <Header>
        <img src={logoImg} alt="Github" />
        <Link to="/"><FiChevronLeft size={20} />Voltar</Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt="" />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>

      )}



      <Issues>
        {issues.map(issues => (
          <a key={issues.id} href={issues.html_url} target="_blank">
            <div>
              <strong>{issues.title}</strong>
              <p>{issues.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
}

export default Repository;
