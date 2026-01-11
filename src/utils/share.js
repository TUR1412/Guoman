const tryCopyViaExecCommand = (text) => {
  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = String(text ?? '');
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const ok = Boolean(document.execCommand?.('copy'));
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

export const copyTextToClipboard = async (text) => {
  if (typeof window === 'undefined') {
    return { ok: false, method: 'none' };
  }

  const safeText = text === null || text === undefined ? '' : String(text);
  if (!safeText) return { ok: false, method: 'none' };

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(safeText);
      return { ok: true, method: 'clipboard' };
    }
  } catch {}

  if (tryCopyViaExecCommand(safeText)) {
    return { ok: true, method: 'clipboard' };
  }

  return { ok: false, method: 'manual' };
};

export const shareOrCopyLink = async ({ title, url }) => {
  if (typeof window === 'undefined') {
    return { ok: false, method: 'none' };
  }

  const safeTitle = title ? String(title) : undefined;
  const safeUrl = url ? String(url) : window.location?.href;

  if (!safeUrl) return { ok: false, method: 'none' };

  try {
    if (navigator.share) {
      await navigator.share({ title: safeTitle, url: safeUrl });
      return { ok: true, method: 'share' };
    }
  } catch {
    // 用户取消/系统不支持都算可接受失败，继续 fallback
  }

  return copyTextToClipboard(safeUrl);
};
