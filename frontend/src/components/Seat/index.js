import { PiArmchairFill, PiArmchair } from "react-icons/pi";
import { TbArmchair2Off } from "react-icons/tb";

import "./index.css";

const Seat = (props) => {
  const { seatDetails, updateSelected, seatQty, tempQty } = props;
  const { seatId, status, selected } = seatDetails;
  const seatClass = status === "Available" ? "seat" : "seat-booked";
  const selectedSeatClass = selected ? "seat-selected" : "";
  const CurrentChair = selected ? PiArmchairFill : PiArmchair;

  const selectSeat = () => {
    if (tempQty > 0 || selected) {
      updateSelected(seatId);
    }
    if (seatQty === 0) {
      alert("Select seat quantity");
      return;
    }
  };
  return (
    <li>
      {status === "Available" ? (
        <CurrentChair
          className={`${seatClass} ${selectedSeatClass}`}
          size={22}
          onClick={selectSeat}
        />
      ) : (
        <TbArmchair2Off color="black" size={22} />
      )}
    </li>
  );
};

export default Seat;
