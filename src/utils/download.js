export const downloadTextFile = ({ text, filename, mimeType = 'text/plain;charset=utf-8' }) => {
  if (typeof document === 'undefined') return { ok: false, reason: 'no-document' };

  try {
    const blob = new Blob([text], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'exception' };
  }
};
