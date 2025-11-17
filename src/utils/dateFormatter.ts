export function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return false;
  }

  const day = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10);
  const year = parseInt(parts[2]!, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false;
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Ensure month is within valid range before accessing monthLength
  if (month < 1 || month > 12) {
    return false;
  }

  return day > 0 && day <= monthLength[month - 1]!;
}

export function convertDMYToYMD(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day === undefined || month === undefined || year === undefined) {
      return dateString;
    }
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString; // Return original if format is unexpected
}

export function convertYMDToDMY(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (day === undefined || month === undefined || year === undefined) {
      return dateString;
    }
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return dateString; // Return original if format is unexpected
}