// In-memory store for the latest result (SPA-safe).
// Note: refresh will clear it (expected). Result page already handles "expired".

let _result = null;

export function setResult(payload) {
  _result = payload;
  return true;
}

export function getResult() {
  return _result;
}

export function clearResult() {
  _result = null;
}
