
import { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const socket = io('http://localhost:6001');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const register = async () => {
    try {
      const res = await axios.post('http://localhost:6001/register', {
        username,
        email,
        password,
        usertype,
      });

      const user = res.data;
      localStorage.setItem('userId', user._id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('usertype', user.usertype);

      if (user.usertype === 'freelancer') navigate('/freelancer');
      else if (user.usertype === 'client') navigate('/client');
      else if (user.usertype === 'admin') navigate('/admin');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:6001/login', {
        email,
        password,
      });

      const user = res.data;
      localStorage.setItem('userId', user._id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('usertype', user.usertype);

      if (user.usertype === 'freelancer') navigate('/freelancer');
      else if (user.usertype === 'client') navigate('/client');
      else if (user.usertype === 'admin') navigate('/admin');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
        register,
        login,
        logout,
        socket,
      }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
