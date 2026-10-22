# Wordpool

**A speakers' data co-op for local languages. People record and label their own language, AI helps check quality, and when companies and researchers license the dataset, the money flows back to the speakers who made it, with every consent and payout recorded on Stellar.**

Contributors earn USDC for approved recordings, keep control of how their voice can be used through revocable on-chain consent receipts, and receive a share of every licence through a transparent royalty trail.

![License: MIT](https://img.shields.io/badge/License-MIT-green) ![Network: Stellar](https://img.shields.io/badge/Network-Stellar-blue) ![Contracts: Soroban](https://img.shields.io/badge/Contracts-Soroban-purple) ![Monorepo: pnpm](https://img.shields.io/badge/Monorepo-pnpm-orange) ![Build: Turborepo](https://img.shields.io/badge/Build-Turborepo-red)

> **Status:** early design and Testnet development. The function tables, invariants, and error codes below describe the target interface. Items marked *planned* are not yet implemented.

---

## The Problem

AI works well for the languages it has plenty of data for, and poorly for the rest.

- Languages such as Hausa, Yoruba, Igbo, Pidgin, and hundreds of others have very little high-quality speech and text data, so voice assistants, translation, and speech-to-text work badly for the people who speak them.
- Where data is collected, speakers are usually paid a flat fee (or nothing), sign away broad rights, and never see a share of the value their language later creates.
- Consent is a signed form in someone's drawer. A speaker cannot check where their voice went, or withdraw it.
- Buyers, in turn, struggle to trust a dataset: they cannot tell how it was collected, whether consent is real, or whether clips were produced by bots.
- Voice is also sensitive. It can identify a person and, in the wrong hands, be cloned.

## The Solution

Wordpool makes the speakers the owners of the pool.

1. **Contribute.** Speakers record short prompts, translate sentences, or label audio in their own language, from a phone browser.
2. **Check.** AI scores audio quality, language match, and duplicates. Other native speakers confirm. Approved contributions earn an upfront USDC reward.
3. **Consent.** Every contribution gets an on-chain **consent receipt** stating exactly what it may be used for. The speaker can revoke it.
4. **License.** Companies and researchers license dataset versions built only from consenting contributions for the right use tier.
5. **Share.** Licence income is split across contributors by a published, quality-weighted formula. Each speaker can see which licence paid them and why.

---

## Core Features

### For Contributors
- Record prompts, translate sentences, or label and verify other speakers' clips
- Works in a mobile browser on a basic smartphone, with recordings saved locally and uploaded when data is available
- Earn USDC for every approved contribution, plus ongoing royalties from licences
- Choose which uses you allow, per clip or as a default, and revoke later
- See exactly where your contributions are: included in which dataset versions, licensed to whom, and what you were paid
- Stay pseudonymous: payments go to a wallet, not a name

### For Sponsors and Licensees
- Fund **campaigns** to fill gaps (for example, "Yoruba medical vocabulary" or "Hausa market-price phrases")
- License dataset versions with clear, machine-readable terms
- Every version ships with its consent snapshot, quality statistics, and coverage report
- No guesswork about provenance: each clip is linked to a valid consent receipt

### For Reviewers
- Native speakers verify transcripts, dialect tags, and quality, and earn small rewards
- Reviewer reputation rises when their votes match the final outcome

### AI Features (Wordpool Ear)
| Feature | What it does |
|---|---|
| **Audio Quality Score** | Rates clarity, background noise, clipping, silence, and volume |
| **Language and Dialect ID** | Checks the clip matches the claimed language and suggests a dialect tag |
| **Transcript Check** | Compares the speaker's text with an automatic transcript where a model exists, and flags large mismatches |
| **Duplicate and Bot Detection** | Finds repeated clips, replayed audio, and synthetic or text-to-speech voices submitted as human recordings |
| **Gap Finder** | Spots missing dialects, topics, ages, and accents in the pool and suggests new prompts and campaigns |
| **Personal Data Check** | Flags names, phone numbers, and other personal details in transcripts so they can be removed |
| **Coverage Report** | Summarises what a dataset version contains, so licensees know what they are buying |

AI output is advisory. It pre-scores and flags, but acceptance needs confirmation from native-speaker reviewers, and money is only released by contract rules.

### Unique Feature 1: Consent Receipts
Every contribution carries an on-chain receipt that says what it may be used for.

- **Use tiers:** (1) non-commercial research, (2) commercial speech and language models, and (3) voice synthesis and cloning, which is **off by default** and needs a separate opt-in
- Receipts also record optional limits: allowed licensee types, regions, and an expiry date
- The speaker can **revoke** a receipt at any time. Revoked contributions are excluded from every future dataset version and can no longer be licensed
- Dataset versions publish their inclusion lists as a Merkle root. If a revoked clip is found inside a published version, any contributor can prove it with a Merkle proof, and the version is flagged and cannot be licensed until it is republished

### Unique Feature 2: Royalty Trail
Licence income reaches contributors through a public, auditable trail.

- A licence payment is split on-chain between contributors, a community fund, reviewers, and the platform
- The contributor share is distributed by quality-weighted contribution (duration of accepted audio times the final quality weight), computed with a published method
- The distribution is anchored as a Merkle root, so anyone can recompute it and every contributor can claim with a proof
- A contributor's dashboard shows each payout: which licence, which dataset version, which clips, and what weight

---

## Monorepo Structure

```
wordpool/
├── packages/
│   ├── contracts/      # @wordpool/contracts - Soroban smart contracts (Rust)
│   ├── ear/            # @wordpool/ear       - AI quality scoring, language ID, bot detection, gap finder
│   ├── pipeline/       # @wordpool/pipeline  - Ingest, dedupe, build dataset versions, Merkle trees, royalty weights
│   ├── indexer/        # @wordpool/indexer   - Event indexer for the app and API (TypeScript)
│   ├── api/            # @wordpool/api       - REST API (Node.js)
│   ├── sdk/            # @wordpool/sdk       - TypeScript SDK for contracts and API
│   └── app/            # @wordpool/app       - Contributor PWA, reviewer portal, licensee portal (Next.js)
├── docs/               # Architecture, consent model, royalty method, threat model, SECURITY_MODEL.md
├── prompts/            # Open prompt sets per language
├── scripts/            # Testnet bootstrap, seed data, deploy helpers
├── audits/             # Smart contract audit reports
├── pnpm-workspace.yaml
├── turbo.json
└── README.md           <- you are here
```

---

## How It Works

```
Contributor           Ear (AI) + Reviewers           Stellar Ledger                Licensee
     │                         │                            │                          │
     ├─ record clip ──────────▶│ quality, language, bot check                          │
     │                         ├─ peer review (native speakers)                        │
     ├─ choose uses ───────────────────────────────────────▶ ConsentRegistry.grant()   │
     │◀─ upfront reward ───────────────────────────────────┤ CampaignVault.pay()       │
     │                                                      │                          │
Pipeline                                                    │                          │
     ├─ build dataset version (active consents only)        │                          │
     ├─ anchor version ────────────────────────────────────▶ DatasetRegistry.publish() │
     │        challenge window: anyone can prove a revoked clip is inside               │
     │                                                      │                          │
     │                                                      │◀──── license(version) ───┤ pays USDC
     │                                                      ├─ split: contributors / reviewers / community / platform
     ├─ compute weights, anchor distribution root ─────────▶ RoyaltyVault.set_distribution()
     │◀─ claim royalty with Merkle proof ──────────────────┤ RoyaltyVault.claim()      │

Contributor
     ├─ revoke consent ────────────────────────────────────▶ ConsentRegistry.revoke()   │
     └─ excluded from all future versions                                              │
```

---

## Packages

### @wordpool/contracts
Soroban smart contracts in Rust, deployable to Stellar Testnet and Mainnet.

| Contract | Purpose |
|---|---|
| `ContributorRegistry` | Pseudonymous contributor profiles, language tags, reputation, and sanctions |
| `ConsentRegistry` | Consent receipts per contribution, with use tiers, limits, and revocation |
| `DatasetRegistry` | Immutable dataset versions with Merkle roots, consent snapshots, challenge windows, and taint flags |
| `CampaignVault` | Sponsor-funded campaigns that pay contributors and reviewers for approved work |
| `RoyaltyVault` | Licence sales, income splits, Merkle distributions, and claims |

```
packages/contracts/
├── contracts/
│   ├── contributor-registry/
│   ├── consent-registry/
│   ├── dataset-registry/
│   ├── campaign-vault/
│   ├── royalty-vault/
│   └── common/              # Shared error enum
├── tests/
├── Cargo.toml
└── README.md
```
**Stack:** Rust, Soroban SDK, Stellar CLI

**What goes on-chain and what does not.** Audio, transcripts, and personal details never go on-chain. They are stored encrypted off-chain. The ledger holds only hashes, Merkle roots, consent terms, scores, and money flows. Contributors are known by wallet address, not by name.

#### ContributorRegistry

| Function | Purpose |
|---|---|
| `initialize(admin, scorer_signer)` | Sets the admin and the key that attests quality scores |
| `register(contributor, languages, adult_declaration)` | Registers a pseudonymous contributor. Contributor auth required. Contributors must declare they are 18 or older |
| `update_languages(contributor, languages)` | Updates language tags |
| `record_outcome(contributor, accepted, quality_bps)` | Called only by `CampaignVault` to update reputation |
| `sanction(contributor, reason_hash, level)` | Admin or arbiter restricts a contributor for confirmed abuse (for example, submitting synthetic voices as human) |
| `lift_sanction(contributor)` | Arbiter lifts a sanction |
| `get_contributor(contributor) -> ContributorInfo` | Read-only |

#### ConsentRegistry

| Function | Purpose |
|---|---|
| `initialize(admin)` | Sets the admin |
| `set_default_terms(contributor, terms)` | Sets the contributor's default consent terms (use tiers, licensee types, regions, expiry) |
| `grant(contributor, contribution_hash, terms) -> u64` | Records a consent receipt for a contribution and returns `receipt_id`. Contributor auth required. Terms are immutable after granting |
| `revoke(receipt_id)` | The contributor revokes a receipt. Permanent for that receipt |
| `revoke_all(contributor)` | Revokes every active receipt for a contributor |
| `allows(receipt_id, use_tier) -> bool` | Read-only. True only if the receipt is active, unexpired, and permits the tier |
| `get_receipt(receipt_id) -> Receipt` | Read-only |
| `get_receipts_by_contributor(contributor, offset, limit) -> Vec<u64>` | Read-only |
| `extend_receipt_ttl(receipt_id)` | Extends TTL to prevent archival. Publicly callable |

Voice synthesis and cloning (tier 3) is never implied by another tier. A receipt must name it explicitly.

#### DatasetRegistry

| Function | Purpose |
|---|---|
| `initialize(admin, curators, challenge_window_ledgers)` | Sets the admin, the approved curators, and the challenge window |
| `publish(dataset_id, language, use_tier, root, clip_count, total_seconds, consent_snapshot_hash, stats_hash) -> u64` | A curator anchors a new immutable version and returns `version_id`. Version numbers rise monotonically per dataset |
| `challenge(version_id, receipt_id, leaf, proof)` | Anyone proves that a revoked contribution is included in a version. A valid challenge flags the version as tainted |
| `resolve_taint(version_id, replacement_version_id)` | A curator links a tainted version to its republished replacement |
| `is_licensable(version_id) -> bool` | Read-only. True only after the challenge window and only if not tainted |
| `get_version(version_id) -> DatasetVersion` | Read-only |
| `get_latest(dataset_id) -> Option<u64>` | Read-only |
| `verify_inclusion(version_id, leaf, proof) -> bool` | Read-only. Verifies a clip is in a version using sorted-pair SHA-256. Returns `ProofTooLong` if the proof exceeds `MAX_PROOF_LEN` |

#### CampaignVault

| Function | Purpose |
|---|---|
| `__constructor(VaultConfig)` | Sets admin, token, scorer signer, reviewer reward share, and caps in one call |
| `open_campaign(sponsor, language, task_kind, rate_per_unit, budget, end_ledger, min_quality_bps) -> u64` | A sponsor funds a campaign. Sponsor auth required |
| `submit(contributor, campaign_id, contribution_hash, receipt_id)` | A contributor submits work against a campaign. Requires an active consent receipt |
| `attest_score(campaign_id, contribution_hash, quality_bps, evidence_hash)` | The scorer signer attaches the AI score |
| `review(campaign_id, contribution_hash, reviewer, approve)` | A native-speaker reviewer votes. Each reviewer votes once |
| `finalize(campaign_id, contribution_hash)` | Accepts or rejects once the reviewer threshold is met. Accepted work is paid |
| `claim(campaign_id, contribution_hash)` | Contributor or reviewer claims an accepted reward |
| `close_campaign(campaign_id)` | After the end ledger, returns the unspent budget to the sponsor |
| `get_campaign(campaign_id) -> Campaign` | Read-only |
| `get_user_nonce(caller) -> u64` | Read-only replay-protection nonce |
| `pause()` / `unpause()` | Emergency stop. Admin auth required |

#### RoyaltyVault

| Function | Purpose |
|---|---|
| `__constructor(RoyaltyConfig)` | Sets admin, token, split in basis points (contributors, reviewers, community fund, platform), and claim window |
| `license(version_id, licensee, use_tier, price, terms_hash) -> u64` | A licensee pays for a dataset version. The version must be licensable and the tier must match. Returns `license_id` |
| `set_distribution(license_id, root, total_weight)` | The curator anchors the Merkle root of contributor weights for a licence. Set once |
| `claim(license_id, contributor, weight, proof)` | A contributor claims their share by Merkle proof. One claim per contributor per licence |
| `expire_unclaimed(license_id)` | After the claim window, moves unclaimed funds to the community fund |
| `withdraw_community_fund(to, amount, purpose_hash)` | Spends the community fund on new prompts or campaigns. Admin multisig |
| `get_license(license_id) -> License` | Read-only |
| `get_claimed(license_id, contributor) -> bool` | Read-only |
| `get_split() -> Split` | Read-only |
| `pause()` / `unpause()` | Emergency stop. Admin auth required |

#### Enforced Invariants and Test Mapping
Each invariant below is a design target and will be covered by the named tests.

**ConsentRegistry**

- **Terms are immutable**: once granted, a receipt's terms cannot be edited. Test: `contracts/consent-registry/src/test.rs -> test_receipt_terms_immutable`
- **Contributor-only control**: only the contributor can grant or revoke (`Unauthorized`). Test: `test_revoke_requires_contributor`, `test_grant_requires_contributor`
- **Revocation is permanent**: a revoked receipt cannot be reactivated (`AlreadyRevoked`). Test: `test_revoked_receipt_cannot_be_reactivated`
- **Synthesis is explicit**: a receipt that does not name tier 3 never allows it. Test: `test_voice_synthesis_requires_explicit_opt_in`
- **Expiry respected**: an expired receipt never allows any tier (`ReceiptExpired`). Test: `test_allows_false_after_expiry`
- **Adults only**: contributors must declare they are 18 or older to register (`AdultDeclarationRequired`). Test: `contracts/contributor-registry/src/test.rs -> test_register_without_adult_declaration_fails`

**DatasetRegistry**

- **Immutable versions**: a version's root, counts, and snapshot can never change. Test: `contracts/dataset-registry/src/test.rs -> test_version_fields_immutable`
- **Monotonic numbering**: version numbers per dataset only increase (`VersionNotMonotonic`). Test: `test_publish_non_monotonic_version_fails`
- **Curator-only publishing**: (`Unauthorized`). Test: `test_publish_requires_curator`
- **Challenge window**: a version cannot be licensed until the window ends (`ChallengeWindowOpen`). Test: `test_licensable_false_during_window`, `test_licensable_true_after_window`
- **Revoked clips taint a version**: a valid inclusion proof of a revoked receipt flags the version and blocks licensing (`VersionTainted`). Test: `test_valid_challenge_taints_version`, `test_challenge_with_active_receipt_fails`, `test_forged_proof_challenge_fails`
- **Proof length limit**: (`ProofTooLong`). Test: `test_verify_inclusion_proof_too_long_fails`

**CampaignVault**

- **Consent required**: work cannot be submitted without an active consent receipt (`ConsentNotActive`). Test: `contracts/campaign-vault/src/test.rs -> test_submit_without_consent_fails`, `test_submit_after_revoke_fails`
- **One payment per contribution**: a contribution hash is paid once (`AlreadyPaid`, `DuplicateContribution`). Test: `test_double_payment_fails`, `test_duplicate_contribution_fails`
- **Quality floor**: contributions below `min_quality_bps` are rejected (`BelowQualityFloor`). Test: `test_accept_below_quality_floor_fails`
- **Reviewer threshold, one vote each**: (`ThresholdNotMet`, `AlreadyVoted`). Test: `test_finalize_below_threshold_fails`, `test_reviewer_double_vote_fails`
- **Budget bound**: payouts never exceed the campaign budget (`BudgetExhausted`). Test: `test_payout_above_budget_fails`
- **Unspent budget returns**: only after the end ledger (`CampaignNotEnded`). Test: `test_close_before_end_fails`, `test_close_after_end_refunds_sponsor`
- **Sanctioned contributors blocked**: (`ContributorSanctioned`). Test: `test_sanctioned_contributor_cannot_submit`
- **Replay protection and pause**: (`InvalidNonce`, `Paused`). Test: `test_replay_with_old_nonce_fails`, `test_submit_when_paused_fails`

**RoyaltyVault**

- **Split sums to 100%**: the four split shares must total 10,000 bps (`InvalidSplit`). Test: `contracts/royalty-vault/src/test.rs -> test_split_must_sum_to_10000`
- **Tier match**: a licence tier must equal the dataset version's tier (`TierMismatch`). Test: `test_license_with_wrong_tier_fails`
- **Licensable versions only**: tainted or still-in-window versions cannot be licensed (`VersionNotLicensable`). Test: `test_license_tainted_version_fails`, `test_license_in_challenge_window_fails`
- **Distribution set once**: (`DistributionAlreadySet`). Test: `test_set_distribution_twice_fails`
- **Claim needs a valid proof**: (`InvalidProof`). Test: `test_claim_with_invalid_proof_fails`
- **One claim each**: (`AlreadyClaimed`). Test: `test_double_claim_fails`
- **Claims never exceed the pool**: total claimed is at most the contributor share of the licence. Test: `test_total_claims_never_exceed_pool`
- **Expiry moves funds to the community fund**: only after the claim window (`ClaimWindowOpen` before it). Test: `test_expire_before_window_fails`, `test_expire_after_window_moves_to_community_fund`
- **Pausable**: (`Paused`). Test: `test_license_when_paused_fails`, `test_claim_when_paused_fails`

### Events

| Event | Topics | Data |
|---|---|---|
| `ContributorRegisteredEvent` | `("contributor_registered_event", contributor)` | `languages`, `ledger` |
| `ConsentGrantedEvent` | `("consent_granted_event", receipt_id)` | `contributor`, `contribution_hash`, `tiers`, `expiry` |
| `ConsentRevokedEvent` | `("consent_revoked_event", receipt_id)` | `contributor`, `ledger` |
| `VersionPublishedEvent` | `("version_published_event", version_id)` | `dataset_id`, `language`, `use_tier`, `root`, `clip_count` |
| `VersionTaintedEvent` | `("version_tainted_event", version_id)` | `receipt_id`, `challenger`, `ledger` |
| `CampaignOpenedEvent` | `("campaign_opened_event", campaign_id)` | `sponsor`, `language`, `budget`, `end_ledger` |
| `ContributionAcceptedEvent` | `("contribution_accepted_event", campaign_id)` | `contribution_hash`, `quality_bps`, `reward` |
| `LicenseEvent` | `("license_event", license_id)` | `version_id`, `licensee`, `use_tier`, `price` |
| `DistributionSetEvent` | `("distribution_set_event", license_id)` | `root`, `total_weight` |
| `RoyaltyClaimedEvent` | `("royalty_claimed_event", license_id)` | `contributor`, `amount`, `weight` |

Indexers should key consent events on `receipt_id`, version events on `version_id`, and royalty events on `(license_id, contributor)`.

### Error Codes
Every contract returns errors from a single shared enum in `contracts/common`. Codes are stable: new variants are appended with fresh values and never renumbered.

| Code | Variant | Meaning |
|---|---|---|
| 1 | `AlreadyInitialized` | Initialisation attempted twice |
| 2 | `NotInitialized` | Call made before initialisation |
| 3 | `Unauthorized` | Caller lacks the required authority |
| 4 | `Paused` | Contract is paused |
| 5 | `InvalidAmount` | Amount was not strictly positive |
| 6 | `InvalidNonce` | Replay-protection nonce did not match |
| 100 | `AdultDeclarationRequired` | Contributor did not declare 18 or older |
| 101 | `ContributorSanctioned` | Contributor is restricted |
| 200 | `ReceiptNotFound` | No such consent receipt |
| 201 | `AlreadyRevoked` | Receipt is already revoked |
| 202 | `ReceiptExpired` | Receipt has expired |
| 203 | `ConsentNotActive` | Receipt is revoked, expired, or missing |
| 300 | `VersionNotFound` | No such dataset version |
| 301 | `VersionNotMonotonic` | Version number did not increase |
| 302 | `ChallengeWindowOpen` | Challenge window has not ended |
| 303 | `VersionTainted` | Version contains a revoked contribution |
| 304 | `VersionNotLicensable` | Version cannot currently be licensed |
| 305 | `ProofTooLong` | Merkle proof exceeds `MAX_PROOF_LEN` |
| 306 | `InvalidProof` | Merkle proof did not verify |
| 400 | `DuplicateContribution` | Contribution already submitted |
| 401 | `AlreadyPaid` | Contribution already paid |
| 402 | `BelowQualityFloor` | Quality score below the campaign minimum |
| 403 | `AlreadyVoted` | Reviewer already voted |
| 404 | `ThresholdNotMet` | Not enough reviewer approvals |
| 405 | `BudgetExhausted` | Campaign budget is spent |
| 406 | `CampaignNotEnded` | Campaign cannot be closed yet |
| 500 | `InvalidSplit` | Split shares do not total 10,000 bps |
| 501 | `TierMismatch` | Licence tier does not match the version tier |
| 502 | `DistributionAlreadySet` | Distribution root already anchored |
| 503 | `AlreadyClaimed` | Royalty already claimed |
| 504 | `ClaimWindowOpen` | Expiry attempted before the claim window ended |

### Storage and TTL
Soroban archives entries that are not kept alive. Consent receipts must outlive every dataset version that depends on them, so they are treated as long-lived. The active TTL strategy keeps records in persistent storage for about 30 days (~518,400 ledgers) at a time. The indexer's keeper service extends TTL for every active receipt, version, and open distribution. Anyone can call the public `extend_*_ttl` functions. An archived entry can be restored with a restore transaction before it is read again.

### Amount Semantics
All amounts are integer token base units (`i128`). No floating-point arithmetic is used.

| Unit | Base units |
|---|---|
| 1 stroop (smallest) | 1 |
| 1 token (USDC or XLM) | 10_000_000 |
| 0.02 USDC (example per-clip reward) | 200_000 |

Percentages and quality scores are stored in basis points. A 70% contributor share is `7_000` bps, and a quality score of 0.85 is `8_500`. Windows (challenge, claim, campaign end) are in Stellar ledgers, about 5 seconds each. For example, a 14-day challenge window is roughly 241,920 ledgers.

---

### @wordpool/ear
The AI layer. Takes an audio clip, a transcript, and a language tag, and returns a signed quality report.

```
packages/ear/
├── src/
│   ├── quality.ts         # Noise, clipping, silence, loudness
│   ├── language_id.ts     # Language and dialect check
│   ├── transcript.ts      # Transcript vs automatic transcript
│   ├── bot_detect.ts      # Synthetic voice, replay, duplicate detection
│   ├── gaps.ts            # Missing dialects, topics, ages, accents
│   ├── pii.ts             # Personal-data flags in transcripts
│   ├── coverage.ts        # Dataset coverage reports
│   └── attest.ts          # Signs scores for CampaignVault
├── evals/                 # Labelled clips per language, including known bad examples
├── prompts/
└── package.json
```
**Stack:** TypeScript, Python audio workers, speech models, embeddings for duplicate detection. Audio is processed in a private environment and is not sent to third-party model providers without explicit contributor consent.

### @wordpool/pipeline
Builds dataset versions from consented, accepted contributions and prepares royalty distributions.

```
packages/pipeline/
├── src/
│   ├── ingest.ts          # Pull accepted contributions and active receipts
│   ├── dedupe.ts          # Near-duplicate removal
│   ├── build.ts           # Build a version for one use tier
│   ├── merkle.ts          # Sorted-pair SHA-256 tree and proofs
│   ├── weights.ts         # Quality-weighted royalty weights (published method)
│   ├── canary.ts          # Per-licensee canary samples to trace leaks (planned)
│   └── publish.ts         # Anchor versions and distributions
├── fixtures/
└── package.json
```
The royalty method is fully documented in `docs/royalty-method.md`, and the pipeline is deterministic, so anyone can reproduce a distribution root from the public inputs.

### @wordpool/indexer
Streams contract events into PostgreSQL, extends TTL for active records, and serves the app and API.

### @wordpool/api
```
GET   /v1/languages                             Languages and coverage stats
GET   /v1/datasets                              Dataset versions (public metadata only)
GET   /v1/datasets/:id/versions/:v              Version stats, consent snapshot hash, licensability
GET   /v1/contributors/:address                 Public profile and reputation
GET   /v1/contributors/:address/earnings        Rewards and royalties, with the trail for each
GET   /v1/consent/:receipt_id                   Consent receipt terms and status
GET   /v1/campaigns                             Open campaigns
POST  /v1/contributions                         Submit a clip or text (wallet auth)
POST  /v1/ear/score                             Score a clip (authenticated)
POST  /v1/licenses                              Request a licence and signed download links (after payment)
```
**Stack:** Node.js, Fastify, PostgreSQL, Redis, S3-compatible encrypted storage, @stellar/stellar-sdk

### @wordpool/sdk
```ts
import { Wordpool } from "@wordpool/sdk";

const wp = new Wordpool({ network: "testnet" });
await wp.consent.grant({ contributionHash, tiers: ["research", "commercial"] });
const trail = await wp.earnings.trail(myAddress);   // licence -> version -> clips -> payout
await wp.consent.revoke(receiptId);
```

### @wordpool/app
| Route | Description |
|---|---|
| `/` | Pick a language and start contributing |
| `/record` | Record prompts, with offline save and upload when connected |
| `/translate` | Translate or label sentences |
| `/review` | Review other speakers' clips and transcripts |
| `/consent` | See and change consent terms, revoke receipts |
| `/earnings` | Rewards, royalties, and the full royalty trail |
| `/campaigns` | Open campaigns and sponsor tools |
| `/datasets` | Browse dataset versions, coverage, and licence terms |
| `/licensee` | Licence purchases and downloads |

**Stack:** Next.js 14, TailwindCSS, Web Audio API, @stellar/stellar-sdk, Freighter / LOBSTR / xBull wallet support. A phone-call recording option (IVR) for feature phones is *planned*.

---

## Why Stellar?

- **Micro-rewards are viable.** Paying 0.02 USDC per clip only works when fees are a tiny fraction of a cent.
- **Stablecoin payouts.** Contributors earn a dollar-denominated asset, not a volatile token.
- **Public consent and royalties.** A receipt, a revocation, a licence, and a payout are all verifiable by the people they affect.
- **Merkle distributions.** One anchored root can pay thousands of contributors, with each person claiming their own share.
- **Soroban logic.** Splits, taint flags, and claim rules are enforced by open, auditable contracts.

---

## Threat Model and Honest Limits

| Risk | Mitigation |
|---|---|
| **Voice cloning misuse** | Synthesis and cloning (tier 3) is off by default, needs explicit opt-in, and is licensed only in its own dataset versions |
| **Speaker re-identification** | Contributors are pseudonymous, audio is stored encrypted, speaker embeddings are never included in datasets, and prompts avoid personal content |
| **Spam, bots, and synthetic voices** | AI bot detection, reviewer confirmation, quality floors, reputation, and sanctions |
| **Reviewer collusion** | Reviewer threshold, random assignment, reputation tied to final outcomes, and slashed rewards for abuse |
| **Revoked clip left in a version** | Merkle inclusion challenges: any contributor can prove it, the version is tainted, and licensing is blocked until republished |
| **Dataset leaks by a licensee** | Licence terms, signed and expiring download links, and per-licensee canary samples to trace leaks (planned) |
| **Unfair payouts** | A published, deterministic royalty method and an anchored Merkle root anyone can recompute |
| **Minors** | 18+ declaration, reviewer and AI flags for apparent child voices, and removal on report |

Known limits:
- **Revocation is not magic.** It removes a contribution from all future versions and licences. It cannot recall a copy a licensee already downloaded, and it cannot make a trained model "forget". Licence terms require licensees to honour revocations in future training runs, but enforcing that is a legal and commercial matter.
- **A voice is personal data.** Collection, consent, and cross-border transfer must follow the data protection laws that apply, for example Nigeria's Data Protection Act. This project needs legal review before launch in any country.
- **AI scoring is imperfect.** It can be biased against some accents or recording devices. That is why native-speaker review decides acceptance, and why scoring methods and evaluation results are published.
- **Royalties depend on sales.** Early on, rewards will mostly come from sponsored campaigns. Licence income grows as the datasets do.
- **Quality weights can be gamed.** The method is public so it can be challenged, and it will be revised through community review.

Full details are in `docs/SECURITY_MODEL.md` and `docs/consent-model.md`.

---

## Getting Started

### Prerequisites
- Node.js 20 or later
- pnpm 9 or later
- Rust stable and the Stellar CLI
- Python 3.11 or later (for audio workers)
- A funded Stellar Testnet account (`stellar keys generate --fund`)

```bash
rustup target add wasm32v1-none
cargo install --locked stellar-cli
```

### Install
```bash
git clone https://github.com/your-org/wordpool.git
cd wordpool
pnpm install
cp .env.example .env     # add Stellar keys, storage config, encryption key
```

### Try the flow locally
```bash
pnpm --filter @wordpool/app dev            # contributor app with sample prompts
pnpm --filter @wordpool/ear dev            # scoring service on sample clips
pnpm --filter @wordpool/pipeline build:sample   # build a sample dataset version and royalty distribution
```

### Run in development
```bash
pnpm dev                                   # everything via Turborepo
pnpm --filter @wordpool/api dev            # API only
pnpm --filter @wordpool/indexer start:testnet
```

### Test
```bash
cd packages/contracts && cargo test
pnpm turbo test
pnpm turbo lint
```

### Deploy contracts to Testnet
```bash
cd packages/contracts
stellar contract build
bash ../../scripts/deploy_testnet.sh
```

---

## Live on Testnet

| Contract | ID |
|---|---|
| ContributorRegistry | *to be deployed* |
| ConsentRegistry | *to be deployed* |
| DatasetRegistry | *to be deployed* |
| CampaignVault | *to be deployed* |
| RoyaltyVault | *to be deployed* |

---

## Roadmap

| Phase | Milestone |
|---|---|
| 1 | `ContributorRegistry` and `ConsentRegistry` on Testnet, recording app, and consent receipts |
| 2 | `CampaignVault`, reviewer flow, and upfront USDC rewards |
| 3 | Wordpool Ear (quality, language ID, bot detection) and the pipeline for dataset versions |
| 4 | `DatasetRegistry` with challenge windows, `RoyaltyVault`, and royalty claims |
| 5 | Licensee portal, canary samples, phone-call (IVR) recording, legal review, security audit, Mainnet launch |

---

## Planned Issues for Contributors

Wordpool is built to give contributors scoped, well-defined work every sprint.

| Type | Examples |
|---|---|
| **Smart contracts** | Tests for each invariant above, Merkle inclusion and challenge edge cases, split and rounding maths, storage and fee optimisation |
| **Bug fixes** | Recording failures on low-end browsers, offline upload retries, duplicate-detection false positives |
| **New features** | Contributor earnings trail view, campaign creation wizard, reviewer assignment, coverage report page |
| **AI and audio** | Add labelled clips for a new language or dialect to the evaluation set, improve noise scoring, bot-voice detection, transcript-check models |
| **Languages and prompts** | New prompt sets per language and domain, dialect tags, translations of the app interface |
| **Testing** | End-to-end test from clip to royalty claim on Testnet, fuzzing the royalty weight maths, load tests for scoring |
| **Documentation** | Consent model, royalty method, reviewer handbook, licensee guide, API reference |
| **Good first issues** | Typos, prompt wording, empty-state screens, README examples, new sample data |

Every issue has a description, acceptance criteria, and a pointer to the relevant files.

---

## Security

- Contract audit: pending, with reports to be published in `audits/`
- Audio and transcripts are encrypted at rest and never stored on-chain
- AI never holds keys, never sets payouts, and never decides acceptance on its own
- Test fixtures use consented or synthetic audio only
- Responsible disclosure: `security@your-domain.example`

---

## Contributing

```bash
git checkout -b feat/your-feature
pnpm turbo test
pnpm turbo lint
# open a PR against main
```
See `CONTRIBUTING.md`, `docs/architecture.md`, and `docs/SECURITY_MODEL.md`.

---

## License

MIT, 2026 Wordpool Contributors. Dataset licences are separate and set per dataset version.

---

*Built on Stellar. Powered by Soroban. Your language, your voice, your share.*