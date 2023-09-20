import { useState, useEffect } from "react";
import "./Login.scss";
import { AiOutlineUser, AiOutlineUnlock, AiOutlineMail } from "react-icons/ai";
import ContentWrapper from "../Common/ContentWrapper/ContentWrapper";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";
function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const nav = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    Email: "",
    Password: "",
  });
  const [registerInfo, setRegisterInfo] = useState({
    Email: "",
    Name: "",
    Password: "",
    Role: 1,
  });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/Login",
      {
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify(loginInfo),
      }
    )
      .then((res) => {
        if (res.status != 200) {
          toast.error("Invalid login information", {
            position: toast.POSITION.TOP_CENTER,
          });
          sleep(500).then(() => {});
        }
        return res.json();
      })
      .then((data) => {
        if (data.Email !== undefined) {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Successfully", {
            position: toast.POSITION.TOP_CENTER,
          });
          sleep(1000).then(() => {
            nav("/");
          });
        } else {
          toast.error("Failed", {
            position: toast.POSITION.TOP_CENTER,
          });
          sleep(1000).then(() => {});
        }
      });
  };
  const handleRegister = async () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/user",
      {
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify(registerInfo),
      }
    ).then((res) => {
      if (res.status == 200) {
        toast.success("Registered successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        sleep(500).then(() => {
          setShowRegister(false);
        });
      } else {
        toast.error("Invalid register information", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };
  return (
    <div className="login">
      <ToastContainer limit={1} autoClose={500}></ToastContainer>
      <ContentWrapper>
        {!showRegister ? (
          <div className="login-form">
            <h4>USER LOGIN</h4>
            <div className="email-form">
              <input
                type="text"
                className="email-input"
                placeholder="Email"
                name="Email"
                value={loginInfo.Email}
                onChange={(e) =>
                  setLoginInfo((prev) => {
                    return { ...prev, [e.target.name]: e.target.value };
                  })
                }
              ></input>
              <span>
                <AiOutlineUser></AiOutlineUser>
              </span>
            </div>
            <div className="password-form">
              <input
                type="password"
                className="password-input"
                placeholder="Password"
                value={loginInfo.Password}
                name="Password"
                onChange={(e) =>
                  setLoginInfo((prev) => {
                    return { ...prev, [e.target.name]: e.target.value };
                  })
                }
              ></input>
              <span>
                <AiOutlineUnlock></AiOutlineUnlock>
              </span>
            </div>
            <div className="submit-button" onClick={handleSubmit}>
              <button className="btn-login">Submit</button>
            </div>
            <p className="register-show" onClick={() => setShowRegister(true)}>
              Not have account yet?
            </p>
          </div>
        ) : (
          <div className="register-form">
            <h4>REGISTER</h4>
            <div className="email-form">
              <input
                type="text"
                className="email-input"
                placeholder="Email"
                name="Email"
                value={registerInfo.Email}
                onChange={(e) =>
                  setRegisterInfo((prev) => {
                    return { ...prev, [e.target.name]: e.target.value };
                  })
                }
              ></input>
              <span>
                <AiOutlineMail></AiOutlineMail>
              </span>
            </div>
            <div className="password-form">
              <input
                type="password"
                className="password-input"
                placeholder="Password"
                value={registerInfo.Password}
                name="Password"
                onChange={(e) =>
                  setRegisterInfo((prev) => {
                    return { ...prev, [e.target.name]: e.target.value };
                  })
                }
              ></input>
              <span>
                <AiOutlineUnlock></AiOutlineUnlock>
              </span>
            </div>
            <div className="name-form">
              <input
                type="text"
                className="name-input"
                placeholder="Name"
                name="Name"
                value={registerInfo.Name}
                onChange={(e) =>
                  setRegisterInfo((prev) => {
                    return { ...prev, [e.target.name]: e.target.value };
                  })
                }
              ></input>
              <span>
                <AiOutlineUser></AiOutlineUser>
              </span>
            </div>
            <div className="submit-button" onClick={handleRegister}>
              <button className="btn-login">Register</button>
            </div>
            <p className="register-show" onClick={() => setShowRegister(false)}>
              Have account already?
            </p>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
}

export default Login;
