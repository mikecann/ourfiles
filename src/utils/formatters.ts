/**
 * Formats a file size in bytes to a human readable string
 * Automatically chooses the most appropriate unit (B, KB, MB, GB, TB)
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // For bytes, show no decimal places
  if (unitIndex === 0) return `${Math.round(size)} ${units[unitIndex]}`;

  // For KB and above, show 1 decimal place if the number is small
  // For larger numbers (>=100), show no decimal places
  const decimals = size >= 100 ? 0 : 1;
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}
