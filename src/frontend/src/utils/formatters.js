/**
 * Utilitários para formatação de campos de formulário
 */

/**
 * Formata um CPF no padrão 000.000.000-00
 * @param {string} value - Valor do CPF para formatar
 * @returns {string} CPF formatado
 */
export const formatCPF = (value) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
    .slice(0, 14); // Limita o tamanho para 000.000.000-00
};

/**
 * Formata um número de telefone no padrão (99) 99999-9999
 * @param {string} value - Valor do telefone para formatar
 * @returns {string} Telefone formatado
 */
export const formatPhone = (value) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1")
    .slice(0, 15); // Limita o tamanho para (99) 99999-9999
};

/**
 * Formata um SIAPE removendo caracteres não numéricos e limitando a 7 dígitos
 * @param {string} value - Valor do SIAPE para formatar
 * @returns {string} SIAPE formatado
 */
export const formatSIAPE = (value) => {
  return value.replace(/\D/g, "").slice(0, 7);
};

/**
 * Remove formatação de um valor, mantendo apenas números
 * @param {string} value - Valor formatado
 * @returns {string} Apenas números
 */
export const removeFormatting = (value) => {
  return value.replace(/\D/g, "");
};

/**
 * Valida se um CPF tem o formato e tamanho correto
 * @param {string} value - Valor do CPF (pode estar formatado)
 * @returns {boolean} True se válido
 */
export const isValidCPF = (value) => {
  const cleanCPF = removeFormatting(value);
  return cleanCPF.length === 11;
};

/**
 * Valida se um telefone tem o formato e tamanho correto
 * @param {string} value - Valor do telefone (pode estar formatado)
 * @returns {boolean} True se válido
 */
export const isValidPhone = (value) => {
  const cleanPhone = removeFormatting(value);
  return cleanPhone.length === 11;
};

/**
 * Valida se um SIAPE tem o formato e tamanho correto
 * @param {string} value - Valor do SIAPE (pode estar formatado)
 * @returns {boolean} True se válido
 */
export const isValidSIAPE = (value) => {
  const cleanSIAPE = removeFormatting(value);
  return cleanSIAPE.length === 7;
};