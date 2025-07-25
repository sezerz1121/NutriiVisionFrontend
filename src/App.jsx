import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Registers from './Register.jsx';
import Home from './Home.jsx';
import History from './History.jsx';
function App() {

  return (
<GoogleOAuthProvider clientId={`${import.meta.env.VITE_CLIENTID}`}>
<Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/register" element={<Registers/>} />
        <Route path="/home" element={<Home/>} />
        <Route path='/history' element={<History/>}/>
      </Routes>
</Router>
</GoogleOAuthProvider>
  )
}

export default App
