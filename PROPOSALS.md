# API Documentation – Proposed Updates

> **Generated**: 2026-02-27
> **Method**: Automated audit — every doc page in `api/` compared line-by-line against routes, controllers, form requests, API resources, and service code.

---

## 1. `api/index.md` — API Overview

### 1.1 Token abilities / scopes not documented

**Code says:** `createToken(...)` grants abilities `['redeem', 'read:wallet', 'read:redemptions']`.

**Proposal:** Document token scopes in the overview so vendors know which operations each ability permits.

### 1.2 Validation error envelope inconsistency

**Doc says:** Shows two different error shapes — the `success/message/errors` envelope **and** Laravel's native `message/errors` shape (without `success` key).
**Code says:** The controller catches `ValidationException` and wraps it inside the `success/message/errors` envelope via `$this->error(...)`. However, if a `FormRequest` validation fails *before* the controller acts, Laravel's exception handler will return the **raw** `message/errors` shape — no `success` key.

**Proposal:** Clarify this explicitly:

> Validation errors thrown by the framework (before reaching the controller) return the raw Laravel shape. Errors returned by the controller always include the `success` key.

Alternatively, register a global exception handler override to always wrap validation errors in the `success` envelope — then remove the second example shape from the docs.

---

## 2. `api/redemptions.md` — Redemptions

### 2.1 `POST /api/v1/redemptions` — Request Body

#### 2.1.1 `currency` parameter exists in code but is undocumented

**Code says:** `$currency = strtoupper(data_get($payload, 'currency', config('redemption.default_currency', 'ZAR')))`. The payload can include a `currency` field.

**Proposal:** Either:
- **(A)** Document `currency` as an optional request field (defaults to `ZAR`), **or**
- **(B)** If it is intentionally internal-only, remove it from the service's payload reading.

### 2.2 `POST /api/v1/redemptions` — Success Responses

#### 2.2.1 `202 Accepted` semantics poorly described

**Doc says:** `202 Accepted (pending confirmation)`
**Code says:** The service returns outcome `pending_confirmation` with message `"Processing / pending confirmation. Don't retry yet."` when `isDefinitiveFailure` is `false`. This is an ambiguous state — the redemption is **not confirmed successful**.

**Proposal:** Expand the 202 documentation with:
- Clarify that `202` means the provider did **not** confirm success, but the failure is **not definitive** (e.g., timeout). The status field will be `failed` in the redemption object until the admin reconciles.
- Recommend the vendor **poll `GET /redemptions/{id}`** to check final status.
- Emphasize: **do not retry** — the voucher may have been consumed upstream.

#### 2.2.2 Error path `502` not documented for `POST`

**Code says:** A catchall `Throwable` returns HTTP `502` with error code `PROVIDER_DOWN`.

**Proposal:** Add `502 Bad Gateway` to the documented error responses for `POST /redemptions`.

### 2.3 Redemption Object — Field table

#### 2.3.1 `face_value`, `platform_fee`, `net_amount` types

**Doc says:** `number`
**Code says:** `(float)` cast.

**Proposal:** Change type to `float` or add a note that these are always returned as floating-point numbers (e.g., `100.0`, not `100`).

### 2.4 `GET /api/v1/redemptions/{id}`

#### 2.4.1 Admin vs vendor access not documented

**Code says:** If the user `isVendor()`, the query is scoped to `user_id = auth_user_id`. Admin-tier users can see any redemption.

**Proposal:** Add a note:

> Vendors can only access their own redemptions. Admin-tier users can access any redemption by ID.

#### 2.4.2 `404` response not documented

**Code says:** `firstOrFail()` → Laravel throws `ModelNotFoundException` → `404`.

**Proposal:** Add `404 Not Found` to documented error responses.

---

## 3. `api/wallet.md` — Wallet

### 3.1 `GET /api/v1/wallet/balance`

#### 3.1.1 Admin `user_id` parameter not documented

**Code says:** Admin-tier users can pass `user_id` to view another user's balance.

**Proposal:** Add:

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `user_id` | integer | No | Admin-only. View balance of a specific vendor. |

#### 3.1.2 `403` error not documented

**Code says:** Returns `403` with `FORBIDDEN` error code if the user is not a vendor or admin.

**Proposal:** Document the `403` response.

### 3.2 `GET /api/v1/wallet/transactions`

#### 3.2.1 `user_id` parameter not documented

**Code says:** Validates `user_id` as `['sometimes', 'integer', 'exists:users,id']`. Admin users can query specific vendor transactions.

**Proposal:** Add `user_id` to the query parameter table:

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `user_id` | integer | No | Admin-only. View transactions for a specific vendor. |

#### 3.2.2 Transaction object `type` field is misleading

**Doc says:** `"type": "deposit"` in the example response.
**Code says:** `'type' => $this->processor_id` — the `type` field is actually the `processor_id` column from the database, **not** a semantic credit/debit label. Possible values depend on the wallet package internals.

**Proposal:** Either:
- **(A)** Rename the JSON key from `type` to `processor` (breaking change), **or**
- **(B)** Document the actual values `processor_id` can take and explain the mapping, **or**
- **(C)** Add a computed `direction` field (e.g., `credit` / `debit`) alongside `type` — this is what vendors likely expect.

#### 3.2.3 Transaction object fields not formally defined

**Doc says:** Only shows an example; no field definition table exists.

**Proposal:** Add a "Transaction Object" table similar to the "Redemption Object" table in `redemptions.md`:

| Field | Type | Notes |
|---|---|---|
| `uuid` | string | Transaction UUID |
| `type` | string | Processor identifier (see note above) |
| `amount` | float | Gross transaction amount |
| `received` | float | Net amount received |
| `commission` | float | Commission charged |
| `currency` | string | ISO currency code |
| `status` | string | Transaction status |
| `meta` | object | Provider-specific metadata |
| `created_at` | string\|null | ISO-8601 UTC timestamp |

#### 3.2.4 `403` error not documented

Same as balance endpoint — undocumented `FORBIDDEN` error for non-vendor/admin users.

---

## 4. `api/errors.md` — Error Codes

### 4.1 Missing error codes

The following error codes exist in code but are not listed:

| Code | HTTP Status | Meaning |
|---|---|---|
| `NOT_FOUND` | `404` | Provider configuration not found. |
| `INVALID_VOUCHER` | `422` | Voucher could not be resolved to any provider. |

**Proposal:** Add both to the error code table.

### 4.2 `PROVIDER_DOWN` HTTP status range

**Doc says:** `422` or `502`
**Code says:** The `ProviderUnavailableException` handler returns `422`. The catchall `Throwable` handler returns `502`. Additionally disabled-provider checks throw a `ValidationException` with `PROVIDER_DOWN` as `422`.

**Proposal:** Clarify the distinct trigger paths and when each HTTP status applies.

### 4.3 Error code `FORBIDDEN` scope

**Doc says:** "Access is not allowed for the requested operation."
**Code says:** Used in wallet endpoints (non-vendor/admin) and admin endpoints (non-admin).

**Proposal:** Clarify that `FORBIDDEN` applies to both wallet and admin endpoints.

---

## 5. Undocumented Endpoints

### 5.1 Admin Provider Management endpoints

| Route | Method | Notes |
|---|---|---|
| `/api/v1/admin/providers` | GET | Lists all providers with enabled/disabled status |
| `/api/v1/admin/providers/{id}/toggle` | POST | Enable/disable a provider; body: `{ "is_enabled": true/false }` |

**Proposal:** Create `api/admin.md` documenting these admin-only endpoints, including:
- Request/response examples
- Admin-tier authorization requirement
- Response fields: `id`, `provider`, `is_enabled`, `updated_at`

---

## 6. Dead Code Cleanup

### 6.1 `AuthController` is unused

The `auth/login` and `auth/logout` routes have been removed — authentication is handled exclusively via Filament. The following files are now dead code:

- `app/Http/Controllers/Api/V1/AuthController.php`
- `app/Http/Requests/Api/V1/LoginRequest.php`
- `app/Http/Resources/Api/V1/UserResource.php` (only used by auth login response)

**Proposal:** Delete these three files.

---

## 7. API Standards Compliance Issues

### 7.1 Inconsistent HTTP status semantics

| Issue | Current | Standard Practice |
|---|---|---|
| Business-rule failures returned as `422` | `ALREADY_REDEEMED` → `422`, `PROVIDER_DOWN` → `422` | `422` is for validation. Business errors should use `409 Conflict` or `503 Service Unavailable`. |
| `502` for generic exceptions | Catch-all `Throwable` → `502 Bad Gateway` | `502` implies upstream proxy failure. Prefer `500` or `503`. |

**Proposal:** Consider migrating to semantically correct status codes. If breaking changes are unacceptable, document the current mapping as intentional.

### 7.2 No rate-limiting documentation

**Proposal:**
- Add per-endpoint rate limits (e.g., `60/min` for reads, `10/min` for redemption POSTs) via `throttle` middleware.
- Document limits with `X-RateLimit-*` response headers.

### 7.3 No API versioning strategy documented

**Proposal:** Add a versioning section to `index.md`: current version, deprecation policy, breaking change communication.

### 7.4 No pagination `links` in list responses

**Proposal (non-breaking):** Add a `links` object alongside `meta` containing `next`, `prev`, `first`, and `last` URLs.

### 7.5 Missing idempotency strategy for `POST /redemptions`

The deduplication logic for identical voucher codes exists but is not documented.

**Proposal:** Document the idempotency behavior:
- Same voucher code submitted twice → returns `ALREADY_REDEEMED` if the first attempt succeeded.
- If the first attempt result is unknown (`pending_confirmation`), behavior should be specified.

### 7.6 No `X-Request-Id` / correlation header

**Proposal:** Generate and return a `X-Request-Id` header on every response for debugging and support purposes.

---

## Summary Priority Matrix

| Priority | Section | Effort |
|---|---|---|
| 🔴 Critical | 4.1 — Add missing error codes | Low |
| 🔴 Critical | 6.1 — Delete dead auth code | Low |
| 🟠 High | 2.2.1 — Clarify `202` semantics | Low |
| 🟠 High | 3.2.2 — Fix wallet `type` field mapping | Medium |
| 🟠 High | 3.2.3 — Add transaction object table | Low |
| 🟠 High | 5.1 — Document admin endpoints | Medium |
| 🟡 Medium | 3.1.1, 3.2.1 — Document admin `user_id` param | Low |
| 🟡 Medium | 1.2 — Clarify validation envelope shape | Low |
| 🟡 Medium | 7.5 — Document idempotency behavior | Low |
| 🟢 Low | 7.1 — HTTP status code alignment | High (breaking) |
| 🟢 Low | 7.2 — Rate limiting | Medium |
| 🟢 Low | 7.3 — Versioning policy | Low |
| 🟢 Low | 7.4 — Pagination links | Medium |
| 🟢 Low | 7.6 — Request ID header | Low |
