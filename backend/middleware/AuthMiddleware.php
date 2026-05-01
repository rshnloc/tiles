<?php
// ============================================================
// Auth Middleware
// ============================================================

function requireAuth(array $allowedRoles = []): array {
    $token = getBearerToken();
    if (!$token) {
        respond(false, null, 'Authentication required', 401);
    }

    $payload = jwtDecode($token);
    if (!$payload) {
        respond(false, null, 'Invalid or expired token', 401);
    }

    if (!empty($allowedRoles) && !in_array($payload['role'], $allowedRoles)) {
        respond(false, null, 'Insufficient permissions', 403);
    }

    return $payload;
}

function currentUser(): ?array {
    $token = getBearerToken();
    if (!$token) return null;
    return jwtDecode($token);
}
