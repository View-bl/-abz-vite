export function formatPhone(phone) {
  const match = phone.match(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (!match) return phone;
  return `+38 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
}
