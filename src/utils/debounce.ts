const debounce = (func: () => void, wait: number, interval: number | null): number | null => {
  if (interval) {
    clearTimeout(interval);
  }

  return setTimeout(() => {
    interval = null;
    func();
  }, wait);
};

export default debounce;
