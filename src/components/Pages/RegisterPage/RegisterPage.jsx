import React from 'react';

import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../Forms/RegisterForm/RegisterForm';

function RegisterPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
  }
  return (
    <div className="container">
      <RegisterForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={handleClick}
        >
          I have an account
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;
