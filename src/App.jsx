import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Registers from './Register.jsx';
import Home from './Home.jsx';
function App() {

  return (
<GoogleOAuthProvider clientId="312965199442-04avaq6m97j3pfsa5okv1np0vp4lqul7.apps.googleusercontent.com">
<Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/register" element={<Registers/>} />
        <Route path="/home" element={<Home/>} />
        
      </Routes>
</Router>
</GoogleOAuthProvider>
  )
}

export default App
