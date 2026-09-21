# Security Specification for InfraCare

## Data Invariants
1. An issue must have a valid geo-location and priority.
2. A worker cannot be deleted if they have an active assignment (enforced via logic in rules if possible, but mainly schema validation).
3. Assignments must link to existing issues and workers (checked via `exists()`).
4. Timestamps should ideally be server-synced.

## Identity Roles
- **Admin**: `rukhsaarrahi@gmail.com` (Bootstrap Admin). Can read/write everything.
- **Worker/Viewer**: Any authenticated user can read issues and workers to see status.

## The Dirty Dozen (Payload Test Cases)
1. **Identity Spoofing**: Attempting to create an issue as unauthenticated. (Denied)
2. **Schema Break**: Creating an issue with a `lat` that is a string instead of number. (Denied)
3. **Shadow Update**: Updating an issue to add a field `isVerified: true` that doesn't exist in schema. (Denied)
4. **State Skip**: Directly setting an issue to `resolved` without going through `in-progress` (if we had state flow, for now we just validate status enum). (Denied if outside enum)
5. **PII Leak**: Accessing user emails if we had a users collection. (N/A for now but guarded by default deny)
6. **Orphaned Write**: Creating an assignment for an `issueId` that doesn't exist in `/issues`. (Denied)
7. **Size Attack**: Sending a 1MB string for the issue `title`. (Denied)
8. **Privilege Escalation**: A non-admin trying to update a worker's name. (Denied)
9. **ID Poisoning**: Using `/issues/../../malicious-path` as a document ID. (Denied by `isValidId`)
10. **Immutability Breach**: Changing `createdAt` on an existing issue. (Denied)
11. **Massive List Query**: Attempting to list all issues without any filters (if rules enforced list queries, for now standard read).
12. **Malicious ID**: Using a very long string as a document ID to increase storage costs. (Denied by `.size()` check on ID).
