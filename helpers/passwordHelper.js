const bcrypt = require("bcrypt");

module.exports.hashingPasswordFunction = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports.compareHashedPasswordFunction = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports.validatePassword = (password) => {
  const regexCapital = /[A-Z]/;
  const regexSmall = /[a-z]/;
  const regexNumber = /[0-9]/;
  const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (password.length < 9) {
    throw new Error("Password must be at least 9 characters long");
  }

  if (!regexCapital.test(password)) {
    throw new Error("Password must contain at least one capital letter");
  }

  if (!regexSmall.test(password)) {
    throw new Error("Password must contain at least one small letter");
  }

  if (!regexNumber.test(password)) {
    throw new Error("Password must contain at least one number");
  }

  if (!regexSpecial.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
};
