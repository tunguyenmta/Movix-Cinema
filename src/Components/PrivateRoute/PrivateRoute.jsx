import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function PrivateRoute(props) {
  const nav = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (!user) {
      nav("/login");
    }
  }, []);
  return (
    <>
      {props.children}
      <Outlet></Outlet>
    </>
  );
}
