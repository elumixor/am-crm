export function Required<T>({
  children,
  item,
  notAvailableText = "Not available",
}: {
  notAvailableText?: string;
  item?: T | null;
  children: (requires: T) => React.ReactNode;
}) {
  const notAvailable = <p style={{ color: "#555" }}>{notAvailableText}</p>;
  return !item ? notAvailable : children(item);
}
