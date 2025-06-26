export class CommonUtil {
  /**
   * RegExp.escape functionality to escape special characters.
   * Note the double backslash for escaping within a string literal.
   * @param str The string to replace special characters.
   * @returns The escape special characters of the string.
   */
  static escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * functionality to generate running timestamp.
   * @returns The format YYYYMMDDHHmmssSSS of the string.
   */
  static generateRunningTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  }
}
