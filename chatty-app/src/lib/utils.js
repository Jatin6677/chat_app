// utils.js

export function formatMessageTime(timestamp) {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return 'Invalid time';

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}
