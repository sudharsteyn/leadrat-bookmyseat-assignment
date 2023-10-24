import { Component } from "react";
import { Fragment } from "react";
import { PiArmchairFill, PiArmchair } from "react-icons/pi";
import { TbArmchair2Off } from "react-icons/tb";
import { ThreeDots } from "react-loader-spinner";

import {
  typesOfSeats,
  seatQuantity,
  apiStatusConstants,
} from "../../constantData";
import Seat from "../Seat";
import Selection from "../Selection";
import ProceedButton from "../ProceedButton";

import "./index.css";

class BookMySeat extends Component {
  state = {
    seatQty: seatQuantity[0].value,
    seatType: typesOfSeats[0].value,
    tempQty: 0,
    seatData: [],
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getSeatsData();
  }

  //Fetch data from API
  getSeatsData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = "http://localhost:3004/seats/";
    const response = await fetch(api);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.map((seat) => ({
        seatId: seat.seat_id,
        seatNumber: seat.seat_number,
        seatType: seat.seat_type,
        seatRow: seat.seat_row,
        status: seat.status,
        selected: false,
      }));
      this.setState({
        seatData: updatedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  initialState = () => {
    this.setState({
      seatQty: seatQuantity[0].value,
      seatType: typesOfSeats[0].value,
      tempQty: 0,
    });
  };

  clearSeats = async () => {
    if (
      window.confirm(
        "Make sure do you want to clear all the previous bookings?"
      )
    ) {
      const api = "http://localhost:3004/clearseat/";
      const response = await fetch(api, { method: "PUT" });
      if (response.ok) {
        this.getSeatsData();
      }
    } else {
      return;
    }
  };

  updateSelected = (id) => {
    const { seatData, seatType } = this.state;
    const updatedSeatData = seatData.map((eachSeat) => {
      if (eachSeat.seatId === id) {
        if (eachSeat.seatType.toUpperCase() === seatType) {
          if (eachSeat.selected) {
            this.setState((prevState) => ({
              tempQty: parseInt(prevState.tempQty) + 1,
            }));
          } else {
            this.setState((prevState) => ({
              tempQty: parseInt(prevState.tempQty) - 1,
            }));
          }
          return { ...eachSeat, selected: !eachSeat.selected };
        } else {
          alert("Select relevant seat type");
        }
      }
      return eachSeat;
    });
    this.setState({ seatData: updatedSeatData });
  };

  renderSeat = (eachSeat) => {
    const { seatQty, tempQty } = this.state;
    return (
      <Seat
        key={eachSeat.seatId}
        seatDetails={eachSeat}
        updateSelected={this.updateSelected}
        tempQty={tempQty}
        seatQty={seatQty}
      />
    );
  };

  removeAllSelectedSeat = () => {
    const { seatData } = this.state;
    const updatedData = seatData.map((eachSeat) => ({
      ...eachSeat,
      selected: false,
    }));
    this.setState({ seatData: updatedData });
  };

  onChangeSeatType = (e) => {
    const { seatQty } = this.state;
    this.removeAllSelectedSeat();
    this.setState({ seatType: e.target.value, tempQty: seatQty });
  };

  onChangeSeatQty = (e) => {
    this.removeAllSelectedSeat();
    this.setState({ seatQty: e.target.value, tempQty: e.target.value });
  };

  onRetry = () => {
    this.getSeatsData();
  };

  renderSuccessView = () => {
    let chrCode = 65;
    const { seatData, seatType, seatQty, tempQty } = this.state;
    const premiumSeats = seatData.filter(
      (eachSeat) => eachSeat.seatType === "Premium"
    );
    const standardSeats = seatData.filter(
      (eachSeat) => eachSeat.seatType === "Standard"
    );
    return (
      <div className="booking-container">
        <div className="seats-container">
          <div>
            <Selection
              items={typesOfSeats}
              defaultItem={seatType}
              onChangeFunction={this.onChangeSeatType}
            />
            <Selection
              items={seatQuantity}
              defaultItem={seatQty}
              onChangeFunction={this.onChangeSeatQty}
            />
          </div>
          <p className="seat-type">Premium seats - Rs. 200.00</p>
          <hr className="separator" />
          <ul>
            {premiumSeats.map((eachSeat) => {
              if (eachSeat.seatNumber.slice(1) === "1") {
                return (
                  <Fragment key={eachSeat.seatId}>
                    <hr />
                    <h1 className="row-name">
                      {String.fromCharCode(chrCode++)}
                    </h1>
                    <div className="gap-premium"></div>
                    {this.renderSeat(eachSeat)}
                  </Fragment>
                );
              } else if (eachSeat.seatId % 5 === 0) {
                return (
                  <Fragment key={eachSeat.seatId}>
                    {this.renderSeat(eachSeat)}
                    <div className="gap-premium"></div>
                  </Fragment>
                );
              }
              return this.renderSeat(eachSeat);
            })}
          </ul>
          <p className="seat-type">Standard seats - Rs. 150.00</p>
          <hr className="separator" />
          <ul>
            {standardSeats.map((eachSeat) => {
              if (eachSeat.seatNumber.slice(1) === "1") {
                return (
                  <Fragment key={eachSeat.seatId}>
                    <hr />
                    <h1 className="row-name">
                      {String.fromCharCode(chrCode++)}
                    </h1>
                    <div className="gap-standard"></div>
                    {this.renderSeat(eachSeat)}
                  </Fragment>
                );
              } else if (eachSeat.seatId % 5 === 0) {
                return (
                  <Fragment key={eachSeat.seatId}>
                    {this.renderSeat(eachSeat)}
                    <div className="gap-standard"></div>
                  </Fragment>
                );
              }
              return this.renderSeat(eachSeat);
            })}
          </ul>
          <div className="screen-container">
            <img
              src="https://assets-in.bmscdn.com/m6/images/seat-layout/cinema-screen.png"
              alt="cinema-screen"
              className="screen"
            />
            <span>All eyes this way please!</span>
          </div>
        </div>
        <div className="seat-layout-detail">
          <h1>Key to seat layout:</h1>
          <p className="seat-info">
            <PiArmchair style={{ marginRight: 10 }} size={22} color="gray" />{" "}
            Available
          </p>
          <p className="seat-info">
            <TbArmchair2Off
              style={{ marginRight: 10 }}
              color="black"
              size={22}
            />{" "}
            Unavailable
          </p>
          <p className="seat-info">
            <PiArmchairFill
              className="seat-selected"
              style={{ marginRight: 10 }}
              size={22}
            />{" "}
            Your Selection
          </p>
          <div>
            <ProceedButton
              initialState={this.initialState}
              getSeatsData={this.getSeatsData}
              seatData={seatData}
              seatType={seatType}
              tempQty={tempQty}
            />
            <button type="button" onClick={this.clearSeats}>
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <h1>Failed to fetch seats data</h1>
        <button type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    );
  };

  renderLoadingView = () => {
    return (
      <div className="loading-container">
        <ThreeDots
          height="50"
          width="50"
          radius="8"
          color="#f84464"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  };

  renderApiStatus = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="app">
        <h1 className="heading">Book My Seat</h1>
        {this.renderApiStatus()}
      </div>
    );
  }
}

export default BookMySeat;
