export type RequiredFull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
