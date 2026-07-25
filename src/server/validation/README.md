# Server Payload Validation (`src/server/validation/`)

This directory houses our server-side validation models and sanitization contracts.

## Responsibility
- Define exact, highly typed Zod schemas representing correct parameters for POST/PUT requests.
- Provide helper middlewares and functions to parse request payloads before any domain logic executes.
