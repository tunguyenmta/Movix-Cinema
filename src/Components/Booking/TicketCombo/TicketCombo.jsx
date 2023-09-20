import { useEffect, useState } from "react";
import ContentWrapper from "../../Common/ContentWrapper/ContentWrapper";
import "./TicketCombo.scss";
import moviebg from "../../../assets/movie-pass.png";
import { FcPlus, FcMinus, FcNext } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { getSeatInfo } from "../../../Store/cinemaSlice";
function TicketCombo({ sessionID, handleShow }) {
  const dispatch = useDispatch();
  const [bookingInfo, setBookingInfo] = useState();
  const [ticket, setTicket] = useState({});
  const [combo, setCombo] = useState({});
  const [showNext, setShowNext] = useState(false);
  const [seatplan, setSeatplan] = useState();
  const [chosenSeat, setChosenSeat] = useState([]);
  const [limitCoupleSeat, setLimitCoupleSeat] = useState();
  const [limitStandardSeat, setLimitStandardSeat] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatInfo, setSeatInfo] = useState({});
  const [lsBookedSeat, setLsBookedSeat] = useState([]);
  const fetchData = async () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/booking/detail"
    )
      .then((res) => res.json())
      .then((data) => {
        data.ticket.forEach((t) => {
          setTicket((prev) => {
            return { ...prev, [t.name]: 0 };
          });
        });
        data.consession[0].concessionItems.forEach((c) => {
          setCombo((prev) => {
            return {
              ...prev,
              [c.description]: 0,
            };
          });
        });
        setSeatplan(data.seatPlan.seatLayoutData.areas);
        setLimitStandardSeat(
          data.seatPlan.seatLayoutData.areas[0].numberOfSeats
        );
        setLimitCoupleSeat(
          data.seatPlan.seatLayoutData.areas[1].numberOfSeats / 2
        );
        setBookingInfo(data);
      });
  };
  const fetchSeatBooked = async () => {
    fetch(
      `https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/TicketByShowCode/${sessionID}`
    )
      .then((res) => res.json())
      .then((data) => {
        let temp = [];
        data.forEach((n) => {
          temp.push(...n.SeatCode.replaceAll(" ", "").split(","));
        });
        setLsBookedSeat(temp);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchSeatBooked();
    setShowNext(false);
  }, [sessionID]);
  const adding = (type, e, index) => {
    if (type == "GHE DOI") {
      if (ticket["GHE DOI"] < limitCoupleSeat) {
        setTicket((prev) => {
          return {
            ...prev,
            [type]: ticket[type] + 1,
          };
        });
        setTotalPrice((prev) => {
          return prev + bookingInfo?.ticket[index].displayPrice;
        });
      } else {
      }
    } else {
      if (
        ticket["Nguoi Lon"] + ticket["Ve 2D Thanh Vien"] <
        limitStandardSeat
      ) {
        setTicket((prev) => {
          return {
            ...prev,
            [type]: ticket[type] + 1,
          };
        });
        setTotalPrice((prev) => {
          return prev + bookingInfo?.ticket[index].displayPrice;
        });
      } else {
      }
    }
  };
  const minus = (type, e, index) => {
    e.stopPropagation();
    if (ticket[type] == 0) {
      return;
    } else {
      setTicket((prev) => {
        return {
          ...prev,
          [type]: ticket[type] - 1,
        };
      });
      setTotalPrice((prev) => {
        return prev - bookingInfo?.ticket[index].displayPrice;
      });
    }
  };

  const addingCombo = (type, e, index) => {
    e.stopPropagation();
    setCombo((prev) => {
      return {
        ...prev,
        [type]: combo[type] + 1,
      };
    });
    setTotalPrice((prev) => {
      return (
        prev + bookingInfo?.consession[0].concessionItems[index].displayPrice
      );
    });
  };
  const minusCombo = (type, e, index) => {
    e.stopPropagation();
    if (combo[type] == 0) {
      return;
    } else {
      setCombo((prev) => {
        return {
          ...prev,
          [type]: combo[type] - 1,
        };
      });
      setTotalPrice((prev) => {
        return (
          prev - bookingInfo?.consession[0].concessionItems[index].displayPrice
        );
      });
    }
  };

  const handleSeat = (type, code, couple) => {
    if (!couple) {
      if (
        chosenSeat.filter((e) => {
          return Object.keys(e)[0] == "standard";
        }).length <
        ticket["Nguoi Lon"] + ticket["Ve 2D Thanh Vien"]
      ) {
        if (
          chosenSeat
            .filter((e) => {
              return Object.keys(e)[0] == "standard";
            })
            .find((a) => {
              return Object.values(a)[0] == code;
            })
        ) {
          setChosenSeat((prev) => {
            return chosenSeat.filter((c) => {
              return Object.values(c)[0] != code;
            });
          });
        } else {
          setChosenSeat((prev) => {
            return [...prev, { [type]: code }];
          });
        }
      } else {
        if (
          chosenSeat
            .filter((e) => {
              return Object.keys(e)[0] == "standard";
            })
            .find((a) => {
              return Object.values(a)[0] == code;
            })
        ) {
          setChosenSeat((prev) => {
            return chosenSeat.filter((c) => {
              return Object.values(c)[0] != code;
            });
          });
        } else {
          let temp = chosenSeat.find((e) => {
            return Object.keys(e)[0] == "standard";
          });
          setChosenSeat((prev) => {
            return [
              ...chosenSeat.filter((c) => {
                return Object.values(c)[0] != Object.values(temp)[0];
              }),
              { [type]: code },
            ];
          });
        }
        return;
      }
    } else {
      if (
        chosenSeat.filter((e) => {
          return Object.keys(e)[0] == "couple";
        }).length < ticket["GHE DOI"]
      ) {
        if (
          chosenSeat
            .filter((e) => {
              return Object.keys(e)[0] == "couple";
            })
            .find((k) => {
              return Object.values(k)[0].includes(code);
            })
        ) {
          setChosenSeat((prev) => {
            return [
              ...prev.filter((c) => {
                return !Object.values(c)[0].includes(code);
              }),
            ];
          });
        } else {
          setChosenSeat((prev) => {
            return [...prev, { [type]: [code, couple] }];
          });
        }
      } else {
        if (
          chosenSeat
            .filter((e) => {
              return Object.keys(e)[0] == "couple";
            })
            .find((k) => {
              return Object.values(k)[0].includes(code);
            })
        ) {
          setChosenSeat((prev) => {
            return [
              ...prev.filter((c) => {
                return !Object.values(c)[0].includes(code);
              }),
            ];
          });
        } else {
          let temp = chosenSeat.find((e) => {
            return Object.keys(e)[0] == "couple";
          });
          setChosenSeat((prev) => {
            return [
              ...chosenSeat.filter((e) => {
                return !Object.values(e)[0].includes(Object.values(temp)[0][0]);
              }),
              { [type]: [code, couple] },
            ];
          });
        }
      }
    }
  };
  return (
    <div className="ticket-panel">
      {!showNext ? (
        sessionID != null ? (
          <ContentWrapper>
            <div className="ticket-list">
              <p className="text">Ticket</p>
              <div className="ticket-wrapper">
                {ticket != null &&
                  Object.keys(ticket).map((t, index) => {
                    return (
                      <div
                        key={index}
                        className="ticket-card"
                        onClick={(event) => adding(t, event, index)}
                      >
                        <img src={moviebg}></img>
                        <div className="ticket-info">
                          <span className="ticket-name">{t}</span>
                          <div className="ticket-add">
                            <button className="btn-minus">
                              <FcMinus
                                onClick={(event) => minus(t, event, index)}
                              ></FcMinus>
                            </button>
                            <span className="ticket-number">{ticket[t]}</span>
                            <button className="btn-plus">
                              <FcPlus
                                onClick={(event) => adding(t, event, index)}
                              ></FcPlus>
                            </button>
                          </div>
                          <p>
                            <span>Price: </span>
                            <span>
                              {bookingInfo?.ticket[index].displayPrice}
                            </span>
                            <span> VND</span>
                          </p>
                          <p>
                            <span>Total: </span>
                            <span>
                              {ticket[t] *
                                bookingInfo?.ticket[index].displayPrice}
                            </span>
                            <span> VND</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="combo-list">
              <p className="text">Combo</p>
              <div className="combo-wrapper">
                {ticket != null &&
                  Object.keys(combo).map((c, index) => {
                    return (
                      <div
                        key={index}
                        className="combo-card"
                        onClick={(event) => addingCombo(c, event, index)}
                      >
                        <img
                          src={
                            bookingInfo.consession[0].concessionItems[index]
                              .imageUrl
                          }
                        ></img>
                        <div className="combo-info">
                          <span className="combo-name">{c}</span>
                          <div className="combo-add">
                            <button className="btn-minus">
                              <FcMinus
                                onClick={(event) => minusCombo(c, event)}
                              ></FcMinus>
                            </button>
                            <span className="combo-number">{combo[c]}</span>
                            <button className="btn-plus">
                              <FcPlus
                                onClick={(event) =>
                                  addingCombo(c, event, index)
                                }
                              ></FcPlus>
                            </button>
                          </div>
                          <p>
                            <span>Price: </span>
                            <span>
                              {
                                bookingInfo?.consession[0].concessionItems[
                                  index
                                ].displayPrice
                              }
                            </span>
                            <span> VND</span>
                          </p>
                          <p>
                            <span>Total: </span>
                            <span>
                              {combo[c] *
                                bookingInfo?.consession[0].concessionItems[
                                  index
                                ].displayPrice}
                            </span>
                            <span> VND</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            {ticket &&
              Object.values(ticket).some((e) => {
                return e > 0;
              }) && (
                <div className="ticket-next">
                  <button
                    className="btn-next"
                    onClick={() => setShowNext(true)}
                  >
                    <FcNext></FcNext>
                  </button>
                </div>
              )}
          </ContentWrapper>
        ) : (
          <div></div>
        )
      ) : (
        <ContentWrapper>
          <div className="seat-layout">
            <div className="seat-warn">
              <p>
                Seats Remaining:{" "}
                {Object.values(ticket).reduce((acc, t) => {
                  return acc + t;
                }, 0) - chosenSeat.length}
              </p>
            </div>

            <div className="seatplan-wrapper">
              <div className="screen-img">
                <p>SCREEN</p>
                <span></span>
              </div>
              {seatplan &&
                seatplan.map((e) => {
                  let isShow = "hidden";
                  return Array(e.rowCount)
                    .fill(0)
                    .map((n, i) => {
                      if (e.rows[i].physicalName != null) {
                        isShow = "visible";
                      }
                      return (
                        <div key={i + 1010} className="seat-row">
                          <span className="row-alphabet">
                            {e.rows[i].physicalName}
                          </span>
                          {Array(e.columnCount)
                            .fill(0)
                            .map((m, i2) => {
                              let temp = e.rows[i].seats.filter((s) => {
                                return (
                                  s.position.columnIndex == i2 &&
                                  s.position.rowIndex == i
                                );
                              });

                              if (temp.length > 0) {
                                isShow = "visible";
                              } else {
                                isShow = "hidden";
                              }
                              let indexLeft;
                              let isDisable = false;
                              if (e.areaCategoryCode == "0000000004") {
                                if (ticket["GHE DOI"] == 0) {
                                  isDisable = true;
                                }
                                let objLeft = e.rows[i].seats.find((s) => {
                                  return s.position.columnIndex == i2;
                                });
                                if (
                                  objLeft != undefined &&
                                  objLeft.seatsInGroup != null
                                ) {
                                  objLeft.seatsInGroup?.forEach((e, ind) => {
                                    if (e.columnIndex == i2) {
                                      indexLeft = ind;
                                    }
                                  });
                                }
                              } else {
                                if (
                                  ticket["Nguoi Lon"] +
                                    ticket["Ve 2D Thanh Vien"] ==
                                  0
                                ) {
                                  isDisable = true;
                                }
                              }
                              if (
                                lsBookedSeat.includes(
                                  e.rows[i].physicalName + i2
                                )
                              ) {
                                isDisable = true;
                              }
                              return (
                                <button
                                  className={`${
                                    isShow == "hidden" ? "hidden" : "showing"
                                  } seat-item ${
                                    indexLeft != undefined
                                      ? `${
                                          indexLeft == 0
                                            ? "left-seat"
                                            : "right-seat"
                                        }`
                                      : ""
                                  } ${
                                    chosenSeat.filter((g) => {
                                      if (Array.isArray(Object.values(g)[0])) {
                                        return Object.values(g)[0].includes(
                                          e.rows[i].physicalName + i2
                                        );
                                      } else {
                                        return (
                                          Object.values(g)[0] ==
                                          e.rows[i].physicalName + i2
                                        );
                                      }
                                    }).length > 0
                                      ? "seat-chosen"
                                      : ""
                                  } ${
                                    isDisable ? "hover-disable" : "hover-enable"
                                  }`}
                                  disabled={isDisable}
                                  key={i2 + 1212}
                                  onClick={() => {
                                    if (indexLeft != undefined) {
                                      if (indexLeft == 0) {
                                        handleSeat(
                                          "couple",
                                          e.rows[i].physicalName + i2,
                                          e.rows[i].physicalName + (i2 + 1)
                                        );
                                      } else {
                                        handleSeat(
                                          "couple",
                                          e.rows[i].physicalName + (i2 - 1),
                                          e.rows[i].physicalName + i2
                                        );
                                      }
                                    } else {
                                      handleSeat(
                                        "standard",
                                        e.rows[i].physicalName + i2
                                      );
                                    }
                                  }}
                                >
                                  <span>{i2}</span>
                                </button>
                              );
                            })}
                          <span className="row-alphabet">
                            {e.rows[i].physicalName}
                          </span>
                        </div>
                      );
                    });
                })}
            </div>
            <div className="seat-info">
              <p className="info-item">
                <span className="seat-available"></span>
                <span> : Available</span>
              </p>
              <p className="info-item">
                <span className="seat-served"></span>
                <span className="text-served"> : Served</span>
              </p>
              <p className="info-item">
                <span className="seat-selected"></span>
                <span className="text-selected"> : Selected</span>
              </p>
            </div>
            {Object.values(ticket).reduce((acc, t) => {
              return acc + t;
            }, 0) == chosenSeat.length && (
              <div className="purchase-section">
                <button
                  className="btn-purchase"
                  onClick={() => {
                    handleShow();
                    dispatch(
                      getSeatInfo({
                        totalPrice: totalPrice,
                        seat: chosenSeat,
                        combo: combo,
                      })
                    );
                  }}
                >
                  Purchase <FcNext></FcNext>
                </button>
              </div>
            )}
          </div>
        </ContentWrapper>
      )}
    </div>
  );
}

export default TicketCombo;
