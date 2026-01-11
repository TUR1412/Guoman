export const getBuildInfo = () => {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : null;
  const sha = typeof __BUILD_SHA__ !== 'undefined' ? __BUILD_SHA__ : null;
  const builtAt = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null;

  const shortSha = typeof sha === 'string' && sha.length >= 7 ? sha.slice(0, 7) : sha || null;

  return {
    version: version || null,
    sha: sha || null,
    shortSha,
    builtAt: builtAt || null,
  };
};
