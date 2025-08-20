export const isAllowedKey = (e) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

  return /[0-9]/.test(e.key) || allowedKeys.includes(e.key);
};
