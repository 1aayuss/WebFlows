export function parse(
  text: string,
  values: any,
  startDelimeter = "{",
  endDelimeter = "}"
) {
  try {
    let startIndex = 0;
    let endIndex = 1;
    let finalString = "";

    while (endIndex < text.length) {
      if (text[startIndex] === startDelimeter) {
        let endPoint = startIndex + 2;

        while (endPoint < text.length && text[endPoint] !== endDelimeter) {
          endPoint++;
        }

        if (endPoint >= text.length) {
          break;
        }

        let stringHoldingValue = text.slice(startIndex + 1, endPoint);
        const keys = stringHoldingValue.split(".");

        let localValues = { ...values };
        try {
          for (let i = 0; i < keys.length; i++) {
            if (typeof localValues === "string") {
              localValues = JSON.parse(localValues);
            }
            if (localValues[keys[i] as any] !== undefined) {
              localValues = localValues[keys[i] as any];
            } else {
              throw new Error(`Key ${keys[i]} not found`);
            }
          }
          finalString += localValues;
        } catch (err) {
          console.error(
            `Error resolving key path "${stringHoldingValue}":`,
            err
          );
          finalString += `{${stringHoldingValue}}`;
        }

        startIndex = endPoint + 1;
        endIndex = startIndex + 1;
      } else {
        finalString += text[startIndex];
        startIndex++;
        endIndex++;
      }
    }

    if (text[startIndex]) {
      finalString += text[startIndex];
    }

    return finalString;
  } catch (err) {
    console.error("An error occurred during parsing:", err);
    return text;
  }
}
