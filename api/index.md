# API Overview

This documentation covers the vendor-facing API under `/api/v1`.

## Supported Voucher Providers

- OTT
- 1Voucher (Flash)
- BluVoucher

## Access and Token Management

Vendors should create API keys from the Fluxr UI and store tokens in environment variables.

Recommended operational practice:

- Store the token in `.env` (for example: `FLUXR_API_TOKEN`).
- Rotate keys every `60-90` days.
- Revoke and replace any compromised token immediately.

## Required Headers

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{TOKEN}}
```

## Example Environment Variables

```dotenv
FLUXR_API_BASE_URL=https://redemption.fluxr.co.za
FLUXR_API_TOKEN=your_token_here
```

## Response Envelopes

Success envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Error envelope:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["ERROR_CODE"]
  }
}
```

Validation failures may return Laravel's validation shape:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": [
      "Validation message"
    ]
  }
}
```
