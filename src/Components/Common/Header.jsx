import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
function Header() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.Email != undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };
  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };
  const searchQueryHandler = (e) => {
    if (e.keyCode === 13 && query.length > 0) {
      nav(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))?.Email != undefined) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(null);
    }
  }, [
    JSON.parse(localStorage.getItem("user"))?.Email,
    JSON.parse(localStorage.getItem("user"))?.Name,
  ]);
  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => nav(`/`)}>
          <img src={logo} alt=""></img>
        </div>
        <ul className="menu-items">
          {user != null ? (
            <>
              <li className="menu-item user-icon" onClick={() => nav("/user")}>
                <span
                  onClick={() => {
                    nav("/user");
                    setMobileMenu(false);
                  }}
                >
                  <AiOutlineUser></AiOutlineUser>
                </span>
                <span
                  className="user-name"
                  onClick={() => {
                    nav("/user");
                    setMobileMenu(false);
                  }}
                >
                  {user.Name}
                </span>
              </li>
              <li
                className="menu-item"
                onClick={() => {
                  localStorage.removeItem("user");
                  nav("/");
                }}
              >
                <span>Log out</span>
              </li>
              <li></li>
            </>
          ) : (
            <li
              className="menu-item"
              onClick={() => {
                setMobileMenu(false);
                nav("/login");
              }}
            >
              Login
            </li>
          )}
          <li className="menu-item">
            <HiOutlineSearch onClick={openSearch}></HiOutlineSearch>
          </li>
        </ul>
        <div className="mobilemenu-item">
          <HiOutlineSearch onClick={openSearch}></HiOutlineSearch>
          {mobileMenu ? (
            <VscChromeClose
              onClick={() => setMobileMenu(false)}
            ></VscChromeClose>
          ) : (
            <SlMenu onClick={openMobileMenu}></SlMenu>
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchbar">
          <ContentWrapper>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search for movie or cinema"
                onKeyUp={searchQueryHandler}
                onChange={(e) => setQuery(e.target.value)}
              ></input>
              <VscChromeClose
                onClick={() => setShowSearch(false)}
              ></VscChromeClose>
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
}

export default Header;
