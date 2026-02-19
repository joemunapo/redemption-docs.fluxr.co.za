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
| `PROVIDER_DOWN` | `422` or `502` | Provider unavailable or temporary upstream failure. |
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
