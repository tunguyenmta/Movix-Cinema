import { useState, useEffect } from "react";
import "./CreditCard.scss";
import "../../../../node_modules/react-credit-cards-2/dist/lib/styles.scss";
import Cards from "react-credit-cards-2";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const CreditCard = ({ data }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.Email != undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { movieInfo } = useSelector((state) => state.cinemaState);
  const [listBank, setListBank] = useState([]);
  const [bankID, setBankID] = useState(1);
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const handleInputChange = (evt) => {
    let { name, value } = evt.target;
    let limit;
    if (name == "number") {
      limit = 16;
    } else if (name == "cvc") {
      limit = 3;
    } else if (name == "expiry") {
      limit = 4;
    }
    if (limit != undefined) {
      value = value.slice(0, limit);
    }

    setState((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreditnumber = (num) => {
    let result = "";
    let temp = num.split("");
    temp.forEach((n, i) => {
      if ((i + 1) % 4 == 0 && (i + 1) / 4 <= 3) {
        result += `${n}-`;
      } else if (i < temp.length - 1) {
        result += n;
      }
    });
    return result;
  };
  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSubmit = () => {
    state["name"] = state["name"]
      .split(" ")
      .map((n) => {
        let temp = n.split("").map((c, i) => {
          if (i == 0) {
            return c.toUpperCase();
          } else return c.toLowerCase();
        });

        return temp.join("");
      })
      .join(" ");
    let CinemaName = data.ticketInfo.cinema.name;
    let listSeat = "";
    data.seatInfo.seat.forEach((n, i) => {
      if (Array.isArray(Object.values(n)[0])) {
        return Object.values(n)[0].forEach((e, i2) => {
          if (i == data.seatInfo.seat.length - 1 && i2 == 1) {
            listSeat += `${e}`;
          } else {
            listSeat += `${e}, `;
          }
        });
      } else {
        if (i == data.seatInfo.seat.length - 1) {
          listSeat += `${Object.values(n)[0]}`;
        } else {
          listSeat += `${Object.values(n)[0]}, `;
        }
      }
    });
    let showTime =
      data.ticketInfo.session.sessionBusinessDate.split("T")[0] +
      "T" +
      data.ticketInfo.session.showTime +
      "Z";

    let listCombo = "";
    let temp = Object.keys(data.seatInfo.combo).filter((c) => {
      return data.seatInfo.combo[c] > 0;
    });
    temp.forEach((n, i2) => {
      if (i2 != temp.length - 1) {
        listCombo += `${n} (${data.seatInfo.combo[n]}), `;
      } else {
        listCombo += `${n} (${data.seatInfo.combo[n]})`;
      }
    });
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/Ticket",
      {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          BankId: bankID,
          CardNumber: state.number,
          CardName: state.name,
          ExpireDate: state.expiry,
          CVV: state.cvc,
          Price: data.seatInfo.totalPrice,
          ShowCode: data.ticketInfo.session.id,
          Email: user.Email,
          CinemaName: CinemaName,
          TheaterName: data.ticketInfo.session.screenName,
          FilmName: movieInfo.name,
          ImageLandscape: movieInfo.imageLandscape,
          ImagePortrait: movieInfo.imagePortrait,
          Combo: listCombo,
          SeatCode: listSeat,
          ShowTime: showTime,
        }),
      }
    ).then((res) => {
      if (res.status === 200) {
        toast.success("Success!", {
          position: toast.POSITION.TOP_CENTER,
        });
        sleep(1000).then(() => {
          navigate("/user");
        });
      } else {
        toast.error("Error", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };

  const fetchBank = async () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/Bank/Bank"
    )
      .then((res) => res.json())
      .then((data) => {
        setListBank(data);
      });
  };
  useEffect(() => {
    fetchBank();
  }, []);

  return (
    <div className="credit-card">
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <ToastContainer limit={1}></ToastContainer>
      <div className="form-container">
        <form>
          <select value={bankID} onChange={(e) => setBankID(e.target.value)}>
            {listBank?.map((e) => {
              return (
                <option key={e.Id} value={e.Id}>
                  {e.Name}
                </option>
              );
            })}
          </select>
          <input
            type="number"
            name="number"
            placeholder="Card Number"
            value={state.number}
            maxLength={19}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <input
            type="text"
            name="name"
            placeholder="Card Name"
            value={state.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <input
            type="number"
            name="expiry"
            maxLength={4}
            placeholder="Expiry"
            value={state.expiry}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <input
            placeholder="CVC"
            type="number"
            name="cvc"
            maxLength={3}
            value={state.cvc}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </form>
        <div className="purchase-button">
          <button className="btn-purchase" onClick={handleSubmit}>
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
