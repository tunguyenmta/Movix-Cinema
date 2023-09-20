import { useState, useEffect } from "react";
import "./UserProfile.scss";
import ContentWrapper from "../Common/ContentWrapper/ContentWrapper";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsTicketPerforated } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserEdit, FaUnlock, FaUserShield, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";
function UserProfile() {
  const [listTicket, setListTicket] = useState([]);
  const [panelShow, setPanelShow] = useState({
    showTicket: true,
    showChangeName: false,
    showChangePassword: false,
  });
  const [updateName, setUpdateName] = useState({
    Name: "",
    Password: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    Password: "",
    PasswordNew: "",
  });
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.Email != undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nav = useNavigate();
  const fetchTicket = async () => {
    await fetch(
      `https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/TicketByEmail/${user.Email}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setListTicket(data);
      });
  };

  const handleChangeName = () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/user",
      {
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          Email: user.Email,
          Name: updateName.Name,
          Password: updateName.Password,
        }),
      }
    ).then((res) => {
      if (res.status == 200) {
        fetch(
          "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/Login",
          {
            headers: {
              "content-type": "application/json",
              accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              Email: user.Email,
              Password: updateName.Password,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            toast.success("Change name successfully", {
              position: toast.POSITION.TOP_CENTER,
            });
            sleep(1000).then(() => {
              localStorage.setItem("user", JSON.stringify(data));
              nav(0);
            });
          });
      } else {
        toast.error("Failed", {
          position: toast.POSITION.TOP_CENTER,
        });
        sleep(1000).then(() => {});
      }
    });
  };

  const handleChangePassword = () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/ChangePassword",
      {
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          Email: user.Email,
          Password: updatePassword.Password,
          PasswordNew: updatePassword.PasswordNew,
        }),
      }
    ).then((res) => {
      if (res.status == 200) {
        fetch(
          "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/user/Login",
          {
            headers: {
              "content-type": "application/json",
              accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              Email: user.Email,
              Password: updatePassword.PasswordNew,
            }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            toast.success("Change password successfully", {
              position: toast.POSITION.TOP_CENTER,
            });
            sleep(1000).then(() => {
              localStorage.setItem("user", JSON.stringify(data));
              nav(0);
            });
          });
      } else {
        toast.error("Failed", {
          position: toast.POSITION.TOP_CENTER,
        });
        sleep(1000).then(() => {});
      }
    });
  };
  useEffect(() => {
    fetchTicket();
  }, []);
  return (
    <div className="user-profile">
      <ContentWrapper>
        <ToastContainer limit={1} autoClose={1000}></ToastContainer>
        <div className="left">
          <div className="user-info">
            <span className="user-img">
              <FaUser></FaUser>
            </span>
            <span className="user-name">{user.Name}</span>
          </div>
          <div className="option-list">
            <ul>
              <li
                onClick={() =>
                  setPanelShow({
                    showTicket: true,
                    showChangeName: false,
                    showChangePassword: false,
                  })
                }
              >
                <span>
                  <BsTicketPerforated></BsTicketPerforated>
                </span>
                Ticket Manage
              </li>
              <li
                onClick={() =>
                  setPanelShow({
                    showTicket: false,
                    showChangeName: true,
                    showChangePassword: false,
                  })
                }
              >
                <span>
                  <LiaUserEditSolid></LiaUserEditSolid>
                </span>
                Change Name
              </li>
              <li
                onClick={() =>
                  setPanelShow({
                    showTicket: false,
                    showChangeName: false,
                    showChangePassword: true,
                  })
                }
              >
                <span>
                  <MdOutlinePublishedWithChanges></MdOutlinePublishedWithChanges>
                </span>
                Change Password
              </li>
              <li
                onClick={() => {
                  localStorage.removeItem("user");
                  nav("/");
                }}
              >
                <span>
                  <AiOutlineLogout></AiOutlineLogout>
                </span>
                Log Out
              </li>
            </ul>
          </div>
        </div>
        <div className="right">
          {panelShow.showTicket && (
            <div className="ticket-panel">
              {listTicket?.length > 0 ? (
                <div className="list-ticket">
                  <h3>{listTicket?.length > 1 ? "Tickets" : "Ticket"}</h3>
                  <div className="ticket-wrapper">
                    {listTicket?.map((e) => {
                      return (
                        <div className="ticket-card" key={e.Id}>
                          <div className="ticket-left">
                            <img src={e.ImageLandscape}></img>
                          </div>
                          <div className="ticket-right">
                            <h3>{e.FilmName}</h3>
                            <p>
                              Cinema: {e.CinemaName} | Theater: {e.TheaterName}
                            </p>
                            <p>
                              Date:{" "}
                              {e.ShowTime.split("T")[0]
                                .split("-")
                                .reverse()
                                .join("-")}{" "}
                              | Session:{" "}
                              {e.ShowTime.split("T")[1].split(":")[0]}:
                              {e.ShowTime.split("T")[1].split(":")[1]}{" "}
                            </p>
                            <p>Seat: {e.SeatCode}</p>
                            <p>Combo: {e.Combo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <span>No Ticket</span>
                </div>
              )}
            </div>
          )}
          {panelShow.showChangeName && (
            <div className="name-panel">
              <div className="form-change">
                <h4>Change Your Account Name</h4>
                <div className="name-form">
                  <input
                    className="name-input"
                    type="text"
                    name="Name"
                    onChange={(e) =>
                      setUpdateName((prev) => {
                        return { ...prev, [e.target.name]: e.target.value };
                      })
                    }
                    placeholder="Name"
                  ></input>
                  <span>
                    <FaUserEdit></FaUserEdit>
                  </span>
                </div>
                <div className="password-form">
                  <input
                    className="password-input"
                    type="password"
                    name="Password"
                    onChange={(e) =>
                      setUpdateName((prev) => {
                        return { ...prev, [e.target.name]: e.target.value };
                      })
                    }
                    placeholder="Password"
                  ></input>
                  <span>
                    <FaUnlock></FaUnlock>
                  </span>
                </div>

                <div className="submit-section">
                  <button className="btn-submit" onClick={handleChangeName}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          {panelShow.showChangePassword && (
            <div className="password-panel">
              <div className="form-change">
                <h4>Change Password</h4>
                <div className="past-form">
                  <input
                    className="past-input"
                    type="password"
                    name="Password"
                    value={updatePassword.Password}
                    onChange={(e) =>
                      setUpdatePassword((prev) => {
                        return { ...prev, [e.target.name]: e.target.value };
                      })
                    }
                    placeholder="Password"
                  ></input>
                  <span>
                    <FaUserShield></FaUserShield>
                  </span>
                </div>
                <div className="password-form">
                  <input
                    className="newpass-input"
                    type="password"
                    name="PasswordNew"
                    value={updatePassword.PasswordNew}
                    onChange={(e) =>
                      setUpdatePassword((prev) => {
                        return { ...prev, [e.target.name]: e.target.value };
                      })
                    }
                    placeholder="New Password"
                  ></input>
                  <span>
                    <FaEdit></FaEdit>
                  </span>
                </div>

                <div className="submit-section">
                  <button onClick={handleChangePassword} className="btn-submit">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}

export default UserProfile;
