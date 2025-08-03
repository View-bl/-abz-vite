
export function validateForm(form, selectedPosition) {
  const errors = {};

  // Ім'я: обов'язкове, мінімум 2 символи
  if (!form.name || form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // Email: обов'язковий, перевірка формату
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "Invalid email address.";
  }

  // Телефон: обов'язковий, формат +38 (XXX) XXX - XX - XX
  const phoneRegex = /^\+38\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  if (!form.phone || !phoneRegex.test(form.phone)) {
    errors.phone = "Phone must be in format +38 (XXX) XXX - XX - XX.";
  }

  // Позиція: обов'язково вибрати радіокнопку
  if (!selectedPosition) {
    errors.position = "Please select a position.";
  }

  // Фото: обов'язково, тип jpeg, не більше 5 МБ
  if (!form.photo) {
    errors.photo = "Photo is required.";
  } else if (form.photo.type !== "image/jpeg") {
    errors.photo = "Photo must be in JPEG format.";
  } else if (form.photo.size > 5 * 1024 * 1024) {
    errors.photo = "Photo size must not exceed 5 MB.";
  }

  return errors;
}
