import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth } from "../config/call"
import { toast } from "react-toastify";
import { requestForToken, messaging, requestToken } from "../config/firebase"
import axios from "axios"

const SignUp = () => {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const token = localStorage.getItem("token");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fcmtoken, setFcmToken] = useState();

  const handleClose = () => {
    setShowForm(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Example: Password must be at least 6 characters long
  };


  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {


    e.preventDefault();
     if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Please enter Password ");
      return;
    } else {
      setPasswordError("");
    }


    console.log("qweqwew", e);

  try {

    

    await auth
      .login({
        "email": email,
        "password": password,
        "fcm_token": "Asdas"
      })
      .then(async({ data }) => {

        console.log("Asaaaa", data);

        localStorage.setItem("token", data.token);
        await axios.get(
          `http://20.55.71.246:3000/api/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            }
          }).then(({data})=>{
         
          console.log("Asdasdss",data);
          // setUser(data.data?.user)
      
        if (data.data?.user.access_eikonify ) {
             setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
        }else{
          setMessage("You don't have access to Eikonify")
        }
      })
      })
    } catch (error) {

    console.log("Asda",error);
    }
    // console.log("RESPONSE", response);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (


    <div className='conm' >
      <div className='con1'>
      <div className="loginPopup" style={showForm ? { display: 'flex' } : { display: 'none' }}>
        <div className="loginPopupContent"  ref={formRef}>
          <div className="loginPopupHeader">
            <button className="closeButton" onClick={handleClose } >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  style={{ borderRadius:"50%",background: "#ffd338"}} viewBox="0 0 24 24">
                <path d="M12 10.586L8.707 7.293a1 1 0 0 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 1 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 0 0-1.414-1.414L12 10.586z"/>
              </svg>
            </button>
            <img src="assets/images/eikonify-logo2.png" />
            <span>Sign in to your account to access Eikonify</span>
          </div>
          <div className="loginPopupBody">
          <div className="inputField">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ color: "#000" }} />
                {emailError && <span className="error">{emailError}</span>}
              </div>
              <div className="inputField">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: "#000" }} />
                {passwordError && <span className="error">{passwordError}</span>}
              </div>
            <div className="inputField">
              <button onClick={handleSubmit} disabled={message.length == 0 ? false : true }> {message.length == 0 ? "Sign In":message}</button>
            </div>
          </div>
        </div>
      </div>
        <div className="bgElementContainer">
          <img className="backgroundElement" src="assets/images/Background_10.png" />
        </div>
        <div className="wrapper home-header">
          <img src="assets/images/eikonify-symbol.png" />
          <h1>Eikonify</h1>
        </div>
        <div className="wrapper heroSection">
          <h1>AI-Powered Image Generation for Your Creative Needs</h1>
          <span
          >Showcase how Eikonify simplifies the process of creating stunning
            visuals with minimal effort, leveraging cutting-edge AI
            technology.</span
          >

          <a href="#" onClick={toggleForm} > Sign In</a>
        </div>

      </div>

      <div className="carousal">
        <div>
          <img src="assets/images/1.jpg" />
          <img src="assets/images/2.jpg" />
          <img src="assets/images/3.jpg" />
          <img src="assets/images/4.jpg" />
          <img src="assets/images/5.jpg" />
          <img src="assets/images/6.jpg" />
          <img src="assets/images/7.jpg" />
          <img src="assets/images/8.jpg" />
          <img src="assets/images/9.jpg" />
          <img src="assets/images/10.jpg" />
        </div>
        <div>
          <img src="assets/images/1.jpg" />
          <img src="assets/images/2.jpg" />
          <img src="assets/images/3.jpg" />
          <img src="assets/images/4.jpg" />
          <img src="assets/images/5.jpg" />
          <img src="assets/images/6.jpg" />
          <img src="assets/images/7.jpg" />
          <img src="assets/images/8.jpg" />
          <img src="assets/images/9.jpg" />
          <img src="assets/images/10.jpg" />
        </div>
      </div>
      <div className="carousal carousal02">
        <div>
          <img src="assets/images/11.jpg" />
          <img src="assets/images/12.jpg" />
          <img src="assets/images/13.jpg" />
          <img src="assets/images/14.jpg" />
          <img src="assets/images/15.jpg" />
          <img src="assets/images/16.jpg" />
          <img src="assets/images/17.jpg" />
          <img src="assets/images/18.jpg" />
          <img src="assets/images/19.jpg" />
          <img src="assets/images/20.jpg" />
        </div>
        <div>
          <img src="assets/images/11.jpg" />
          <img src="assets/images/12.jpg" />
          <img src="assets/images/13.jpg" />
          <img src="assets/images/14.jpg" />
          <img src="assets/images/15.jpg" />
          <img src="assets/images/16.jpg" />
          <img src="assets/images/17.jpg" />
          <img src="assets/images/18.jpg" />
          <img src="assets/images/19.jpg" />
          <img src="assets/images/20.jpg" />
        </div>
      </div>
      <div className="carousal">
        <div>
          <img src="assets/images/21.jpg" />
          <img src="assets/images/22.jpg" />
          <img src="assets/images/23.jpg" />
          <img src="assets/images/24.jpg" />
          <img src="assets/images/25.jpg" />
          <img src="assets/images/26.jpg" />
          <img src="assets/images/27.jpg" />
          <img src="assets/images/28.jpg" />
          <img src="assets/images/29.jpg" />
          <img src="assets/images/30.jpg" />
        </div>
        <div>
          <img src="assets/images/21.jpg" />
          <img src="assets/images/22.jpg" />
          <img src="assets/images/23.jpg" />
          <img src="assets/images/24.jpg" />
          <img src="assets/images/25.jpg" />
          <img src="assets/images/26.jpg" />
          <img src="assets/images/27.jpg" />
          <img src="assets/images/28.jpg" />
          <img src="assets/images/29.jpg" />
          <img src="assets/images/30.jpg" />
        </div>
      </div>

      <div className='con2'>
        <div className="footer">© Copyrights 2024, All Rights Reserved</div>
      </div>


    </div>

  )
}

export default SignUp
