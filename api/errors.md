# Error Codes

## Error Envelope

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["ERROR_CODE"]
  }
}
```

## Vendor-Facing Error Codes

| Code | Typical HTTP Status | Meaning |
| --- | --- | --- |
| `INVALID_VOUCHER` | `422` | Voucher is invalid, expired, malformed, or not found. |
| `ALREADY_REDEEMED` | `422` | Voucher has already been used. |
| `PENDING_CONFIRMATION` | `409` | Processing is still in-flight or unknown; wait before retrying. |
| `PROVIDER_DOWN` | `422` or `502` | Provider unavailable or temporary upstream failure. Client-facing messages are sanitized (for example: `Provider is currently unavailable. Please try again later.`). |
| `FORBIDDEN` | `403` | Access is not allowed for the requested operation. |

## Validation Payload Example

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "voucher_code": [
      "The voucher code field is required."
    ]
  }
}
```
