export const isNumber = (value: any) => {
  if (!value) return false;

  const parsedString = value.replace(/\s/g, "");

  if (parsedString.length === 0) return false;

  return !!Number(parsedString);
}
