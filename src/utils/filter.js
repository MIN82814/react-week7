export const currency = (num) => {
  //如果不是數字就變成0
  const n = Number(num) || 0;
  return n.toLocaleString();
};
