# Wallet

Use wallet endpoints to read current balances and transaction history.

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/wallet/balance`

Return wallet balance for the authenticated vendor.

### Example Request

::: code-group

```bash [cURL]
curl --request GET "{{BASE_URL}}/api/v1/wallet/balance" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer {{TOKEN}}"
```

```php [Laravel (Guzzle)]
<?php

use Illuminate\Support\Facades\Http;

$baseUrl = env('FLUXR_API_BASE_URL', 'https://redemption.fluxr.co.za');
$token = env('FLUXR_API_TOKEN');

$response = Http::baseUrl($baseUrl)
    ->withToken($token)
    ->acceptJson()
    ->get('/api/v1/wallet/balance');

$status = $response->status();
$body = $response->json();
```

:::

### Success Response (`200`)

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "currency": "ZAR",
    "balance": 92,
    "pending_balance": 0,
    "on_hold_balance": 0
  }
}
```

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/wallet/transactions`

List wallet transactions.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `from` | date | No | Start date filter |
| `to` | date | No | End date filter |
| `type` | string | No | `credit`, `debit`, or `all` |
| `per_page` | integer | No | Default `15`, max `100` |

### Example Request

::: code-group

```bash [cURL]
curl --request GET "{{BASE_URL}}/api/v1/wallet/transactions?from=2026-02-01&to=2026-02-28&type=credit&per_page=15" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer {{TOKEN}}"
```

```php [Laravel (Guzzle)]
<?php

use Illuminate\Support\Facades\Http;

$baseUrl = env('FLUXR_API_BASE_URL', 'https://redemption.fluxr.co.za');
$token = env('FLUXR_API_TOKEN');

$response = Http::baseUrl($baseUrl)
    ->withToken($token)
    ->acceptJson()
    ->get('/api/v1/wallet/transactions', [
        'from' => '2026-02-01',
        'to' => '2026-02-28',
        'type' => 'credit',
        'per_page' => 15,
    ]);

$status = $response->status();
$body = $response->json();
```

:::

### Success Response (`200`)

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [
      {
        "uuid": "da6c3d8e-3e15-4f30-bf5a-5ca40f0e7e31",
        "type": "deposit",
        "amount": 92,
        "received": 92,
        "commission": 0,
        "currency": "ZAR",
        "status": "paid",
        "meta": {
          "name": "Voucher redemption credit",
          "provider": "ott",
          "redemption_id": 123
        },
        "created_at": "2026-02-19T10:00:02.000000Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 1
    }
  }
}
```
