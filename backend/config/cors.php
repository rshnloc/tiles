<?php
// ============================================================
// CORS Configuration
// ============================================================

$allowedOrigins = array_filter([
    'https://insurance.careerxera.com',
    getenv('FRONTEND_URL') ?: null,
    'http://localhost:3000',
    'http://localhost',
]);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Also allow any *.vercel.app subdomain
$isVercel = preg_match('/^https:\/\/[a-z0-9\-]+\.vercel\.app$/', $origin);

if (in_array($origin, $allowedOrigins, true) || $isVercel) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://insurance.careerxera.com');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
