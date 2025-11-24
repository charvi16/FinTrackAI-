export function projectNextMonth(totalHistory){
  
  const avg = totalHistory / 6;

  return Math.round(avg * 1.08); // assume 8% inflation
}
