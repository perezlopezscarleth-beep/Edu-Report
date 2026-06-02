/** Correo institucional: nombre@institucion.cr (acepta o sin tilde en institución). */
export const INSTITUTION_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@instituci[oó]n\.cr$/i;

export function isInstitutionEmail(email: string): boolean {
  return INSTITUTION_EMAIL_REGEX.test(email.trim());
}
