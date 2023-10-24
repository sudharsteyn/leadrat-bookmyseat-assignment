import "./index.css";

const ProceedButton = (props) => {
  const { initialState, getSeatsData, seatData, seatType, tempQty } = props;

  const bookSeat = async () => {
    if (seatType === "None") {
      alert("Select seat type");
      return;
    }
    const selectedSeats = [];
    seatData.forEach((eachSeat) => {
      if (eachSeat.selected) {
        selectedSeats.push(eachSeat.seatId);
      }
    });
    if (selectedSeats.length === 0) {
      alert("Please select a seat");
      return;
    } else if (tempQty !== 0) {
      alert(`Add remaining ${tempQty} seat`);
      return;
    }
    const seats = {
      selectedSeats,
    };
    const api = "https://bookmyseat-server.onrender.com/bookseat/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seats),
    };
    const response = await fetch(api, options);
    if (response.ok) {
      alert("Ticket booked successfully");
      initialState();
      getSeatsData();
    }
  };

  return (
    <button type="button" onClick={bookSeat}>
      Proceed
    </button>
  );
};

export default ProceedButton;
