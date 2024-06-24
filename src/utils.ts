import { format, isValid, parse } from "date-fns";

export function isOfFormat(dateString: string, formatString: string): boolean {
  const parsedDate = parse(
    dateString.toLowerCase(),
    formatString.toLowerCase(),
    new Date()
  );

  if (!isValid(parsedDate)) {
    return false;
  }

  const formattedDate = format(parsedDate, formatString.toLowerCase());

  return dateString.toLowerCase() === formattedDate.toLowerCase();
}
