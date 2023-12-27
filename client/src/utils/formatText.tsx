// takes a string input and returns a copy with the first letter of each word capitalized
// "hello my name is abi" -> "Hello My Name Is Abi"

export default function formatTextCapitalization(text: string) {
  const stringArray = text.split(" ");
  const formattedArray = stringArray.map(
    (text) => text[0].toUpperCase() + text.slice(1).toLowerCase()
  );
  return formattedArray.join(" ");
}
