//src\styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

export const LinkButton = styled(Link)`
  margin-top: 10px;
  text-align: center;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
export const Header = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
background-color: #f8f9fa;
padding: 10px 20px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
position: fixed;
top: 0;
left: 0;
`;

export const NavIcon = styled.div`
display: flex;
flex-direction: column;
align-items: center;
cursor: pointer;

svg {
  font-size: 24px;
  color: #007bff;
}

span {
  font-size: 12px;
  color: #007bff;
}

&:hover {
  svg,
  span {
    color: #0056b3;
  }
}
`;