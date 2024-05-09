import './App.css';
import Dashboard from './Components/Dashboard';
import { BrowserRouter } from "react-router-dom";
import SignUp from './Components/SignUp';
import { ToastContainer } from "react-toastify";
import Container from './Components/App';


function App() {
  return (

    <BrowserRouter>
    <div>
        <Container />
        <ToastContainer
            theme="colored"
            position="bottom-center"
            hideProgressBar
          />
          </div>
    </BrowserRouter>


  );
}

export default App;
