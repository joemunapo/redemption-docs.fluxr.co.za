# Redemptions

Use this section to submit vouchers and retrieve redemption history.

## Redemption Object

`GET /api/v1/redemptions` and `GET /api/v1/redemptions/{id}` return redemptions with the following fields.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Redemption ID. |
| `provider` | string | Voucher provider (`ott`, `onevoucher`, `bluvoucher`, `standard_bank`, `nedbank`, `capitec`). |
| `voucher_code_last4` | string | Last 4 characters of the voucher code. |
| `face_value` | number | Original voucher value. |
| `platform_fee` | number | Platform fee charged for the redemption. |
| `net_amount` | number | Net value credited after fees. |
| `currency` | string | ISO currency code, for example `ZAR`. |
| `status` | string | Redemption status (`pending`, `success`, `failed`, `reversed`). |
| `provider_reference` | string\|null | Provider transaction reference when available. |
| `created_at` | string\|null | ISO-8601 UTC timestamp. |
| `error_code` | string\|null | Included only when `status` is `failed`. |
| `error_message` | string\|null | Included only when `status` is `failed`. |

## <span class="endpoint-badge endpoint-post">POST</span>`/api/v1/redemptions`

Create a redemption request.

### Request Body

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `voucher_code` | string | Yes | Voucher code to redeem. Dashes and spaces are stripped automatically. Default flow requires `12-16` digits; explicit bank providers allow `8-16` digits. |
| `provider` | string | No | Optional explicit provider. Allowed values: `standard_bank`, `nedbank`, `capitec`. |
| `pin` | string | Conditional | Required when `provider` is `standard_bank`, `nedbank`, or `capitec`. Must be at least 4 digits. |

### Example Request

::: code-group

```bash [cURL]
curl --request POST "{{BASE_URL}}/api/v1/redemptions" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {{TOKEN}}" \
  --data '{
    "voucher_code": "123456789012"
  }'
```

```bash [cURL - Bank Cash-Out]
curl --request POST "{{BASE_URL}}/api/v1/redemptions" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {{TOKEN}}" \
  --data '{
    "voucher_code": "14-0408-1950",
    "provider": "nedbank",
    "pin": "9782"
  }'
```

```php [Laravel (Guzzle)]
<?php

use Illuminate\Support\Facades\Http;

$baseUrl = env('FLUXR_API_BASE_URL', 'https://redemption.fluxr.co.za');
$token = env('FLUXR_API_TOKEN');

$response = Http::baseUrl($baseUrl)
    ->withToken($token)
    ->acceptJson()
    ->asJson()
    ->post('/api/v1/redemptions', [
        'voucher_code' => '123456789012',
    ]);

$status = $response->status();
$body = $response->json();
```

```php [Laravel (Guzzle) - Bank Cash-Out]
<?php

use Illuminate\Support\Facades\Http;

$baseUrl = env('FLUXR_API_BASE_URL', 'https://redemption.fluxr.co.za');
$token = env('FLUXR_API_TOKEN');

$response = Http::baseUrl($baseUrl)
    ->withToken($token)
    ->acceptJson()
    ->asJson()
    ->post('/api/v1/redemptions', [
        'voucher_code' => '14-0408-1950',
        'provider' => 'nedbank',
        'pin' => '9782',
    ]);

$status = $response->status();
$body = $response->json();
```

:::

### Success Responses

- `201` Created (new successful redemption)
- `200` OK (successful retry or re-processed existing attempt)

```json
{
  "success": true,
  "message": "Voucher redeemed.",
  "data": {
    "id": 123,
    "provider": "ott",
    "voucher_code_last4": "9012",
    "face_value": 100,
    "platform_fee": 2,
    "net_amount": 98,
    "currency": "ZAR",
    "status": "success",
    "provider_reference": "OTT-REF-123",
    "created_at": "2026-02-19T10:00:00.000000Z",
    "wallet": {
      "currency": "ZAR",
      "balance": 98,
      "pending_balance": 0,
      "on_hold_balance": 0
    }
  }
}
```

`POST /api/v1/redemptions` includes `data.wallet` on success so clients can immediately read updated balances.

### Pending Confirmation Example (`409`)

```json
{
  "success": false,
  "message": "Processing / pending confirmation. Don’t retry yet.",
  "errors": {
    "provider": [
      "PENDING_CONFIRMATION"
    ]
  }
}
```

### Error Response Example (`422`)

```json
{
  "success": false,
  "message": "Already redeemed.",
  "errors": {
    "provider": [
      "ALREADY_REDEEMED"
    ]
  }
}
```

### Validation Error Example (`422`)

```json
{
  "message": "Voucher code must be 12 to 16 digits.",
  "errors": {
    "voucher_code": [
      "Voucher code must be 12 to 16 digits."
    ]
  }
}
```

### Provider Unavailable Example (`422`)

```json
{
  "success": false,
  "message": "Provider is currently unavailable. Please try again later.",
  "errors": {
    "provider": [
      "PROVIDER_DOWN"
    ]
  }
}
```

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/redemptions`

List redemption records.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `status` | string | No | `pending`, `success`, `failed`, `reversed` |
| `provider` | string | No | `onevoucher`, `ott`, `bluvoucher`, `standard_bank`, `nedbank`, `capitec` |
| `from` | date | No | Start date filter |
| `to` | date | No | End date filter |
| `per_page` | integer | No | Default `15`, max `100` |

### Example Request

::: code-group

```bash [cURL]
curl --request GET "{{BASE_URL}}/api/v1/redemptions?status=success&provider=ott&from=2026-02-01&to=2026-02-28&per_page=20" \
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
    ->get('/api/v1/redemptions', [
        'status' => 'success',
        'provider' => 'ott',
        'from' => '2026-02-01',
        'to' => '2026-02-28',
        'per_page' => 20,
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
        "id": 123,
        "provider": "ott",
        "voucher_code_last4": "9012",
        "face_value": 100,
        "platform_fee": 2,
        "net_amount": 98,
        "currency": "ZAR",
        "status": "success",
        "provider_reference": "OTT-REF-123",
        "created_at": "2026-02-19T10:00:00.000000Z"
      },
      {
        "id": 124,
        "provider": "onevoucher",
        "voucher_code_last4": "3344",
        "face_value": 50,
        "platform_fee": 1,
        "net_amount": 49,
        "currency": "ZAR",
        "status": "failed",
        "provider_reference": null,
        "created_at": "2026-02-19T11:00:00.000000Z",
        "error_code": "INVALID_VOUCHER",
        "error_message": "Voucher is invalid or expired."
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 2
    }
  }
}
```

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/redemptions/{id}`

Fetch one redemption record by ID.

### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | integer\|string | Yes | Redemption ID |

### Example Request

::: code-group

```bash [cURL]
curl --request GET "{{BASE_URL}}/api/v1/redemptions/{{REDEMPTION_ID}}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer {{TOKEN}}"
```

```php [Laravel (Guzzle)]
<?php

use Illuminate\Support\Facades\Http;

$baseUrl = env('FLUXR_API_BASE_URL', 'https://redemption.fluxr.co.za');
$token = env('FLUXR_API_TOKEN');
$redemptionId = 123;

$response = Http::baseUrl($baseUrl)
    ->withToken($token)
    ->acceptJson()
    ->get("/api/v1/redemptions/{$redemptionId}");

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
    "id": 123,
    "provider": "ott",
    "voucher_code_last4": "9012",
    "face_value": 100,
    "platform_fee": 2,
    "net_amount": 98,
    "currency": "ZAR",
    "status": "success",
    "provider_reference": "OTT-REF-123",
    "created_at": "2026-02-19T10:00:00.000000Z"
  }
}
```
