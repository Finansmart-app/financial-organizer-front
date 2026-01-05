/**
 * Hace scroll al tope de la página de forma suave
 * Útil para llamar en ngOnInit() o al cambiar de ruta
 *
 * @example
 * ```typescript
 * ngOnInit(): void {
 *   scrollToTop();
 * }
 * ```
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

/**
 * Hace scroll al tope de la página de forma instantánea (sin animación)
 * Útil cuando necesitas un scroll inmediato
 *
 * @example
 * ```typescript
 * ngOnInit(): void {
 *   scrollToTopInstant();
 * }
 * ```
 */
export function scrollToTopInstant(): void {
  window.scrollTo(0, 0);
}

/**
 * Hace scroll a un elemento específico de la página
 *
 * @param elementId - El ID del elemento al que hacer scroll
 * @param behavior - Tipo de comportamiento: 'smooth' o 'auto'
 *
 * @example
 * ```typescript
 * scrollToElement('my-section', 'smooth');
 * ```
 */
export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = 'smooth'
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
}

/**
 * Omite propiedades específicas de un objeto y devuelve un nuevo objeto sin esas propiedades.
 *
 * @param obj - El objeto original del cual se omitirán las propiedades.
 * @param keys - Las claves de las propiedades a omitir.
 * @returns Un nuevo objeto sin las propiedades especificadas.
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: 2, c: 3 };
 * const modified = omit(original, 'b', 'c');
 * // modified será { a: 1 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): any {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}
