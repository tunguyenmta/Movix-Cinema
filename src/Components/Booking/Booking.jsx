import React, { useState, useEffect } from "react";
import "./Booking.scss";
import DetailsBanner from "./DetailBanner/DetailBanner";
import TicketCombo from "./TicketCombo/TicketCombo";
import { FaWindowClose } from "react-icons/fa";
import useFetchTMDB from "../../Hooks/useFetchTMDB";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CreditCard from "../Common/CreditCard/CreditCard";

function Booking() {
  const { id } = useParams();
  const { data, loading } = useFetchTMDB(`/movie/${id}`);
  const { url, seatInfo } = useSelector((state) => state.cinemaState);
  const [sessionID, setSessionID] = useState();
  const [showOverlay, setShowOverlay] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  const [showCredit, setShowCredit] = useState(false);
  const handleSession = (id) => {
    setSessionID(id);
  };
  const handleShow = () => {
    setShowOverlay(true);
  };
  const getTicketInfo = (info) => {
    setTicketInfo(info);
  };

  return (
    <div className="booking">
      <DetailsBanner
        getTicketInfo={getTicketInfo}
        getSession={handleSession}
      ></DetailsBanner>
      <TicketCombo handleShow={handleShow} sessionID={sessionID}></TicketCombo>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-purchase">
            <div className="overlay-header">
              <h4>PURCHASE</h4>
              <button
                className="btn-close"
                onClick={() => {
                  setShowOverlay(false);
                  setShowCredit(false);
                }}
              >
                <FaWindowClose></FaWindowClose>
              </button>
            </div>
            {!showCredit ? (
              <div className="purchase-info">
                <div className="left">
                  <img
                    className="posterImg"
                    src={url.backdrop + data.poster_path}
                  />
                </div>
                <div className="right">
                  <div className="booking-info">
                    <p className="booking-item">
                      <span>Cinema: </span>
                      <span>{ticketInfo.cinema.name}</span>
                    </p>
                    <p className="booking-item">
                      <span>Theater: </span>
                      <span>{ticketInfo.session.screenName}</span>
                    </p>
                    <p className="booking-item">
                      <span>Date: </span>
                      <span>{ticketInfo.session.showDate}</span>
                    </p>
                    <p className="booking-item">
                      <span>Time: </span>
                      <span>{ticketInfo.session.showTime}</span>
                    </p>
                    <p className="booking-item list-seat">
                      <span>Seats: </span>
                      <span>
                        {seatInfo.seat.map((e, i) => {
                          if (Array.isArray(Object.values(e)[0])) {
                            if (i < seatInfo.seat.length - 1) {
                              return (
                                <span key={i + 999} className="seat-item">
                                  {" "}
                                  {Object.values(e)[0][0]},{" "}
                                  {Object.values(e)[0][1]},
                                </span>
                              );
                            } else {
                              return (
                                <span key={i + 999} className="seat-item">
                                  {" "}
                                  {Object.values(e)[0][0]},{" "}
                                  {Object.values(e)[0][1]}
                                </span>
                              );
                            }
                          } else {
                            if (i < seatInfo.seat.length - 1) {
                              return (
                                <span key={i + 999} className="seat-item">
                                  {" "}
                                  {Object.values(e)[0]},{" "}
                                </span>
                              );
                            } else {
                              return (
                                <span key={i + 999} className="seat-item">
                                  {" "}
                                  {Object.values(e)[0]}
                                </span>
                              );
                            }
                          }
                        })}
                      </span>
                    </p>
                    <p className="booking-price">
                      <span>Total: </span>
                      <span>{seatInfo.totalPrice}</span>
                    </p>
                    <div className="submit-section">
                      <button
                        className="btn-submit"
                        onClick={() => setShowCredit(true)}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CreditCard data={{ ticketInfo, seatInfo }}></CreditCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
