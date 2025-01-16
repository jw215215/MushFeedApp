import { createContext } from 'react';

const AuthContext = createContext({
  currentUser: {
    id: 'tim_01',
    name: 'Tim Galebach',
    email: 'tim@mush.style'
  }
});

export default AuthContext; 