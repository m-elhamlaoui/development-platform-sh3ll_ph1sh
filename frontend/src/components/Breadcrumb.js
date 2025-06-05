import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 1rem 0;
`;

const BreadcrumbList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  color: ${props => props.active ? '#00ff88' : '#b3b3b3'};
  font-size: 0.9rem;

  &:not(:last-child)::after {
    content: '/';
    margin-left: 0.5rem;
    color: #666;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00ff88;
  }
`;

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    switch (path) {
      case 'subjects':
        return 'Subjects';
      case 'files':
        return 'Files';
      case 'favorites':
        return 'Favorites';
      case 'profile':
        return 'Profile';
      default:
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink to="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <BreadcrumbItem key={to} active={isLast}>
              {isLast ? (
                getBreadcrumbName(value)
              ) : (
                <BreadcrumbLink to={to}>{getBreadcrumbName(value)}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb; 