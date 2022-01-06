import { useRef, useEffect, useState } from "react";
import AutoNumeric from "autonumeric";

export default ({ maxValue, decimalPlaces }) => {
  const numericInput = useRef(null);
  const [isVisible, setVisible ] = useState(maxValue.gt(0));

  useEffect(() => {
    if (isVisible) {
      new AutoNumeric(numericInput.current, null, {
        decimalPlaces: decimalPlaces,
        maximumValue: maxValue.toString(),
        selectOnFocus: false
      });
    }
  }, []);

  const setMax = () => {
    //@ts-ignore
    AutoNumeric.set(numericInput.current, maxValue.toString());
  };

  if (isVisible) {
    return (
      <>
        <input ref={numericInput} defaultValue="0" /> <a onClick={setMax} href="#">Max</a>
      </>
    )
  }

  return null;
}