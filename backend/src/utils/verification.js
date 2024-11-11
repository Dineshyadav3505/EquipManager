const codes = {};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeVerificationEmailCode(email, code) {
  codes[email] = code;
}

function storeVerificationPhoneCode(phone, code) {
  codes[phone] = code;
}

function verifyCode(email, code) {
  const storedCode = codes[email];
  if (storedCode === code) {
    delete codes[email]; // Remove the code after verification
    return true;
  }
  return false;
}

function verifyPhoneCode(phone, code) {
  const storedCode = codes[phone];
  if (storedCode === code) {
    delete codes[phone]; // Remove the code after verification
    return true;
  }
  return false;
}

export { generateVerificationCode, storeVerificationEmailCode, storeVerificationPhoneCode, verifyCode, verifyPhoneCode };