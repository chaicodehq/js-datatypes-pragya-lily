/**
 * 📋 Jugaad Form Validator - Indian Style!
 *
 * India mein form bharna ek art hai! College admission ka form validate
 * karna hai. Har field ke apne rules hain. Tujhe ek errors object return
 * karna hai jisme galat fields ke error messages hain. Agar sab sahi hai
 * toh empty errors object aur isValid = true.
 *
 * formData object:
 *   { name, email, phone, age, pincode, state, agreeTerms }
 *
 * Validation Rules:
 *   1. name: must be a non-empty trimmed string, min 2 chars, max 50 chars
 *      Error: "Name must be 2-50 characters"
 *
 *   2. email: must be a string containing exactly one "@" and at least one "."
 *      after the "@". Use indexOf(), lastIndexOf(), includes().
 *      Error: "Invalid email format"
 *
 *   3. phone: must be a string of exactly 10 digits, starting with 6, 7, 8, or 9
 *      (Indian mobile numbers). Check each char is a digit.
 *      Error: "Invalid Indian phone number"
 *
 *   4. age: must be a number between 16 and 100 inclusive, and an integer.
 *      JUGAAD: Agar string mein number diya hai (e.g., "22"), toh parseInt()
 *      se convert karo. Agar convert nahi ho paya (isNaN), toh error.
 *      Error: "Age must be an integer between 16 and 100"
 *
 *   5. pincode: must be a string of exactly 6 digits, NOT starting with "0"
 *      Error: "Invalid Indian pincode"
 *
 *   6. state: Use optional chaining (?.) and nullish coalescing (??) -
 *      if state is null/undefined, treat as "". Must be a non-empty string.
 *      Error: "State is required"
 *
 *   7. agreeTerms: must be truthy (Boolean(agreeTerms) === true).
 *      Falsy values: 0, "", null, undefined, NaN, false
 *      Error: "Must agree to terms"
 *
 * Return:
 *   { isValid: boolean, errors: { fieldName: "error message", ... } }
 *   - isValid is true ONLY when errors object has zero keys
 *
 * Hint: Use typeof, Boolean(), parseInt(), isNaN(), Number.isInteger(),
 *   ?. (optional chaining), ?? (nullish coalescing), Object.keys(),
 *   startsWith(), trim(), length
 *
 * @param {object} formData - Form fields to validate
 * @returns {{ isValid: boolean, errors: object }}
 *
 * @example
 *   validateForm({
 *     name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210",
 *     age: 20, pincode: "400001", state: "Maharashtra", agreeTerms: true
 *   })
 *   // => { isValid: true, errors: {} }
 *
 *   validateForm({
 *     name: "", email: "bad-email", phone: "12345", age: 10,
 *     pincode: "0123", state: null, agreeTerms: false
 *   })
 *   // => { isValid: false, errors: { name: "...", email: "...", ... } }
 */
export function validateForm(formData) {
  // Your code here
  const errors = {};

  // 1. Name Validation
  const trimmedName = (formData.name ?? "").trim();
  if (typeof trimmedName !== "string" || trimmedName.length < 2 || trimmedName.length > 50) {
    errors.name = "Name must be 2-50 characters";
  }

  // 2. Email Validation
  const email = formData.email ?? "";
  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");
  // Check: exactly one "@" AND at least one "." after that "@"
  const hasOneAt = atIndex !== -1 && atIndex === lastAtIndex;
  const hasDotAfterAt = hasOneAt && email.indexOf(".", atIndex) !== -1;

  if (!hasOneAt || !hasDotAfterAt) {
    errors.email = "Invalid email format";
  }

  // 3. Phone Validation
  const phone = String(formData.phone ?? "");
  const validStart = ["6", "7", "8", "9"].includes(phone[0]);
  const isTenDigits = phone.length === 10;
  // Check if every character is actually a digit
  const allDigits = [...phone].every(char => char >= '0' && char <= '9');

  if (!isTenDigits || !validStart || !allDigits) {
    errors.phone = "Invalid Indian phone number";
  }

  // 4. Age Validation (The Jugaad)
  const parsedAge = parseInt(formData.age);
  const isAgeValid = !isNaN(parsedAge) && 
                     Number.isInteger(Number(formData.age)) && 
                     parsedAge >= 16 && 
                     parsedAge <= 100;

  if (!isAgeValid) {
    errors.age = "Age must be an integer between 16 and 100";
  }

  // 5. Pincode Validation
  const pincode = String(formData.pincode ?? "");
  const isSixDigits = pincode.length === 6;
  const doesntStartWithZero = pincode[0] !== "0";
  const allPinDigits = [...pincode].every(char => char >= '0' && char <= '9');

  if (!isSixDigits || !doesntStartWithZero || !allPinDigits) {
    errors.pincode = "Invalid Indian pincode";
  }

  // 6. State Validation
  // Using optional chaining and nullish coalescing as requested
  const stateValue = formData?.state ?? "";
  if (typeof stateValue !== "string" || stateValue.trim().length === 0) {
    errors.state = "State is required";
  }

  // 7. Agree Terms Validation
  if (!Boolean(formData.agreeTerms)) {
    errors.agreeTerms = "Must agree to terms";
  }

  // Final Return
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
}

