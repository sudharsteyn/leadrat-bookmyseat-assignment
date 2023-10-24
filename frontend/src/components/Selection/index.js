import "./index.css";

const Selection = (props) => {
  const { items, defaultItem, onChangeFunction } = props;
  return (
    <select value={defaultItem} onChange={onChangeFunction}>
      {items.map((eachItem, i) => (
        <option key={i} value={eachItem.value}>
          {eachItem.displayText}
        </option>
      ))}
    </select>
  );
};

export default Selection;
