const codes = {};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeVerificationCode(email, code) {
  codes[email] = code;
}

function verifyCode(email, code) {
  const storedCode = codes[email];
  if (storedCode === code) {
    delete codes[email]; // Remove the code after verification
    return true;
  }
  return false;
}

export { generateVerificationCode, storeVerificationCode, verifyCode };