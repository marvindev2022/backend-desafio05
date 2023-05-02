function isValidEmail(email) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+.[^\s@]{3,}$/;
  return EMAIL_REGEX.test(email);
}

module.exports = {isValidEmail};
