/**
 *@fileoverview Serve as a email validation utlity
 */

export function isValidEmail(email: string): boolean{

  if (email.includes(" ")) return false

  const parts = email.split("@")

  if (parts.length !== 2) return false

  const [userName, domain] = parts

  if (!userName || !domain) return false

  const dotIndex = domain.indexOf(".")

  if(dotIndex <= 0 || dotIndex === domain.length-1) return false

  return true
}
