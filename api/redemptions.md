# Redemptions

Use this section to submit vouchers and retrieve redemption history.

## <span class="endpoint-badge endpoint-post">POST</span>`/api/v1/redemptions`

Create a redemption request.

### Request Body

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `voucher_code` | string | Yes | Voucher PIN/code to redeem. |

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

:::

### Success Responses

- `201` Created
- `200` OK
- `202` Accepted (processing state)

```json
{
  "success": true,
  "message": "Voucher redeemed.",
  "data": {
    "id": 123,
    "provider": "ott",
    "voucher_code_last4": "9012",
    "face_value": 100,
    "currency": "ZAR",
    "status": "success",
    "provider_reference": "OTT-REF-123",
    "redeemed_at": "2026-02-19T10:00:02.000000Z",
    "created_at": "2026-02-19T10:00:00.000000Z"
  }
}
```

### Error Response Example (`422`)

```json
{
  "success": false,
  "message": "The voucher has already been used.",
  "errors": {
    "provider": ["ALREADY_REDEEMED"]
  }
}
```

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/redemptions`

List redemption records.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `status` | string | No | `pending`, `success`, `failed`, `reversed` |
| `provider` | string | No | `onevoucher`, `ott`, `bluvoucher` |
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
    "items": [],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 0
    }
  }
}
```

## <span class="endpoint-badge endpoint-get">GET</span>`/api/v1/redemptions/{id}`

Fetch one redemption record by ID.

### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | integer|string | Yes | Redemption ID |

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
