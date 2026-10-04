// Salvar em: src/lib/drive-image.ts
//
// Converte links de compartilhamento do Google Drive em uma URL que pode ser
// usada direto em <img src="...">. Qualquer outro link é devolvido sem alteração.
//
// Formatos aceitos:
//   https://drive.google.com/file/d/ID/view?usp=sharing
//   https://drive.google.com/open?id=ID
//   https://drive.google.com/uc?export=view&id=ID
//
// O arquivo no Drive precisa estar compartilhado como
// "Qualquer pessoa com o link" (Leitor).

export function extractDriveId(url: string): string | null {
  const value = url.trim();
  if (!/(^|\.)drive\.google\.com|docs\.google\.com/.test(value)) return null;

  const fromPath = value.match(/\/file\/d\/([\w-]+)/)?.[1];
  const fromQuery = value.match(/[?&]id=([\w-]+)/)?.[1];
  return fromPath ?? fromQuery ?? null;
}

export function normalizeImageUrl(url: string | null | undefined): string {
  const value = (url ?? "").trim();
  if (!value) return "";

  const id = extractDriveId(value);
  if (!id) return value;

  // O endpoint "thumbnail" costuma ser mais estável que "uc?export=view".
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

export function isDriveFolderLink(url: string): boolean {
  return /drive\.google\.com\/drive\/folders\//.test(url);
}
