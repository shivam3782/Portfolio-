export function validateContact(values) {
  const errors = {};
  if (!values.name.trim() || values.name.length > 100)
    errors.name = "Enter your name (up to 100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
    values.email.length > 254
  )
    errors.email = "Enter a valid email address.";
  if (values.message.trim().length < 10 || values.message.length > 5000)
    errors.message = "Write a message of 10–5,000 characters.";
  return errors;
}
