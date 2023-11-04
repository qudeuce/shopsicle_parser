const regexPattern = "[\\$\\£\\€](\\d+(?:\\.\\d{1,2})?)"; // Note the double escaping of the backslashes
const regex = new RegExp(regexPattern);

export const getPrice = (text: string) => {
  // run the regex on text and get the first match
  const match = text.match(regex);
  // if there is a match, return the first group (the price)
  if (match) {
    return match[1];
  }
};
