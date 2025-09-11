export type RequiredFull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export function capitalized(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
