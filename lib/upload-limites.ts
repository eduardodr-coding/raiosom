/**
 * Limites do upload do pedido médico.
 *
 * Fica separado de `lib/storage.ts` (que é `server-only`) porque o formulário
 * no navegador precisa dos mesmos números para avisar o paciente antes de
 * enviar 10 MB à toa. A validação que vale continua sendo a do servidor.
 */

export const TAMANHO_MAX_BYTES = 10 * 1024 * 1024;

export const TAMANHO_MAX_ROTULO = "10 MB";

/** Tipos aceitos, conferidos no servidor pelo magic number do arquivo. */
export const MIMES_ACEITOS = ["image/jpeg", "image/png", "application/pdf"] as const;

export const ACCEPT_ATTR = "image/jpeg,image/png,image/jpg,application/pdf";

export function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

/** Erro de validação do arquivo, em texto pronto para mostrar ao paciente. */
export function validarArquivo(arquivo: File): string | null {
  if (arquivo.size > TAMANHO_MAX_BYTES) {
    return `O arquivo tem ${formatarTamanho(arquivo.size)} e o limite é ${TAMANHO_MAX_ROTULO}. Tente tirar a foto de novo ou reduzir a qualidade.`;
  }
  if (arquivo.size === 0) {
    return "O arquivo parece estar vazio. Tente enviar de novo.";
  }
  const tipo = arquivo.type.toLowerCase();
  if (tipo && !MIMES_ACEITOS.includes(tipo as (typeof MIMES_ACEITOS)[number])) {
    if (tipo.includes("heic") || tipo.includes("heif")) {
      return "Este formato de foto do iPhone (HEIC) não é aceito. Envie em JPG: nos Ajustes do iPhone, em Câmera › Formatos, escolha “Mais Compatível”.";
    }
    return "Aceitamos apenas foto em JPG ou PNG, ou o pedido em PDF.";
  }
  return null;
}
