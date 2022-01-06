
export default ({ value, decimalPlaces = 6 }) => {
  const formatted = value.toFormat(decimalPlaces);

  return (
    <span className="tabular-nums">{formatted}</span>
  )
}