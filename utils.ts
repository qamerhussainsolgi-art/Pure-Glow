import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clean currency formatter for Pakistani Rupees
 */
export function formatPKR(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString()}`;
}

/**
 * Validates Pakistani Phone formats:
 * - 03XX-XXXXXXX or 03XXXXXXXXX (11 digits)
 * - +923XX-XXXXXXX or 923XXXXXXXXX
 */
export function validatePakistaniPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-]/g, '');
  const pattern = /^((\+92)|(92))?3\d{9}$/;
  return pattern.test(clean) || /^03\d{9}$/.test(clean);
}

/**
 * Clears phone numbers to a standardized format starting with 923...
 */
export function standardizePakistaniPhone(phone: string): string {
  let clean = phone.replace(/[\s-+]/g, '');
  if (clean.startsWith('03')) {
    clean = '92' + clean.substring(1);
  }
  return clean;
}

/**
 * Validates name length and prevents digits
 */
export function validateLegalName(name: string): boolean {
  if (name.trim().length < 3) return false;
  // No digits allowed in luxury legal name
  return !/\d/.test(name);
}

/**
 * Validates Luhn Algorithm for Credit Cards
 */
export function validateLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates Card Expiry (MM/YY) and checks if it's in the future
 */
export function validateCardExpiry(expiry: string): boolean {
  const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!pattern.test(expiry)) return false;
  
  const [_, monthStr, yearStr] = expiry.match(pattern) || [];
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);
  
  const now = new Date();
  const nowMonth = now.getMonth() + 1;
  const nowYear = now.getFullYear();
  
  if (year < nowYear) return false;
  if (year === nowYear && month < nowMonth) return false;
  
  return true;
}

/**
 * Validates Card CVV (3-4 digits check)
 */
export function validateCVV(cvv: string): boolean {
  return /^[0-9]{3,4}$/.test(cvv);
}
