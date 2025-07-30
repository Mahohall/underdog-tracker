
export function calculateSimulatedProfit(initialOdds: number, finalOdds: number): number {
  if (!initialOdds || !finalOdds || finalOdds >= initialOdds) {
    return 0;
  }

  // Simulate a conservative Betfair-style cashout
  const stake = 100;
  const initialReturn = initialOdds * stake;
  const newReturn = finalOdds * stake;

  // Calculate how much the market would allow you to cash out (approx)
  const estimatedCashout = newReturn + (initialReturn - newReturn) * 0.4;

  const profitPercent = ((estimatedCashout - stake) / stake) * 100;

  return Math.round(profitPercent);
}
