# EarnExx + FairScale Prototype

**EarnExx** is a task-based earning platform on Solana where users complete verifiable on-chain tasks to earn tokens. This prototype integrates **FairScale** (on-chain reputation scoring) to make rewards reputation-based: higher FairScore = bigger multipliers, incentivizing genuine participation and reducing sybil/farming attacks.

This directly uses FairScale in core logic—not just displaying a score, but dynamically adjusting economic outcomes (rewards gated/multiplied by reputation tiers).

## Why This Matters for Solana
- Adds trust primitives to dApps: fairer rewards, better loyalty programs, reduced bot abuse.
- Aligns incentives: rewards consistent, high-reputation users over extractive ones.
- Demonstrates real-world usefulness: reputation as a first-class factor in task/earn platforms.

## Features
- Connect Solana wallet and fetch live FairScore via FairScale API.
- Map FairScore to tiers for reward multipliers.
- Simulate task completion → see adjusted reward (e.g., low score = base only).
- Simple frontend demo to visualize the flow.

## FairScale Integration (Meaningful Use)
We use the FairScale beta API to fetch the real-time FairScore for the connected wallet.

- **Endpoint** (from beta Swagger/docs): Likely `GET /v1/score` or similar (check https://swagger.api.fairscale.xyz/ for exact path after authorizing with your key).
- **Auth**: `fairkey` header or Bearer token with your API key.
- **Logic**:
  - Fetch score in `backend/fairscore.js`.
  - Map to tiers:
    - < 400 (e.g., my current 219): Basic tier → 1x multiplier (base rewards only).
    - 400–700: Medium tier → 1.5x multiplier.
    - >700: High tier → 2x+ multiplier.
  - Apply multiplier to base reward on task claim.
- This impacts outcomes: Low-reputation wallets get no boost (prevents farming), high ones earn more.

Example response handling in code (adapt as needed):
```js
// backend/fairscore.js excerpt
async function getFairScore(wallet) {
  const response = await fetch(`https://api.fairscale.xyz/v1/score?wallet=${wallet}`, {
    headers: { 'fairkey': process.env.FAIRSCALE_API_KEY }
  });
  const data = await response.json();
  return data.fairscore; // or data.score
}

// Then in reward calc:
const multiplier = score < 400 ? 1 : score < 700 ? 1.5 : 2;
const finalReward = baseReward * multiplier;
