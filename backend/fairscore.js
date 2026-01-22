const axios = require('axios');

// ====== CONFIG ======
// Replace with your FairScale API key
const FAIR_API_KEY = '4131062921213b3094ea0c71874f029ccd40b064b6b994d2552921036bdaa246fbdaa13';

// ====== FUNCTIONS ======

// Fetch FairScore for a given wallet
async function getFairScore(walletAddress) {
  try {
    const res = await axios.get(
      `https://api.fairscale.xyz/v1/fairscore/${walletAddress}`,
      { headers: { 'x-api-key': FAIR_API_KEY } }
    );
    return res.data.fairScore; // Score between 0-100
  } catch (err) {
    console.error('Error fetching FairScore:', err.message);
    return 0; // Fallback if API fails
  }
}

// Calculate reward based on FairScore
function calculateReward(baseReward, fairScore) {
  if (fairScore >= 80) return baseReward * 2;   // Tier 3
  if (fairScore >= 50) return baseReward * 1.5; // Tier 2
  return baseReward;                             // Tier 1
}

// ====== DEMO USAGE ======
async function demo() {
  const wallet = '85F7VT9JKKxNHuZjncdir21hnvtkuvFZ1s29iD53v59j';
  const baseReward = 100;

  const score = await getFairScore(wallet);
  const reward = calculateReward(baseReward, score);

  console.log('===== EarnExx + FairScale Demo =====');
  console.log(`Wallet: ${wallet}`);
  console.log(`FairScore: ${score}`);
  console.log(`Base Reward: ${baseReward}`);
  console.log(`Adjusted Reward: ${reward}`);
  console.log('=====================================');
}

// Run demo
demo();
