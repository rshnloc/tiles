<?php
// ============================================================
// API Router
// ============================================================

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/InsuranceController.php';
require_once __DIR__ . '/../controllers/PolicyController.php';
require_once __DIR__ . '/../controllers/ClaimController.php';
require_once __DIR__ . '/../controllers/AgentController.php';
require_once __DIR__ . '/../controllers/AdminController.php';
require_once __DIR__ . '/../controllers/KycController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim(preg_replace('#^/api#', '', $uri), '/');
$segments = array_values(array_filter(explode('/', $uri)));

// ── Health check ──────────────────────────────────────────
if ($uri === '/health' || $uri === 'health') {
    try {
        getDB(); // test DB connection
        respond(true, ['status' => 'ok', 'db' => 'connected', 'time' => date('c')], 'healthy');
    } catch (\Throwable $e) {
        respond(false, ['status' => 'error', 'db' => 'unreachable'], 'unhealthy', 503);
    }
}

function respond(bool $success, $data = null, string $message = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

function getBody(): array {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// ── Auth Routes ─────────────────────────────────────────────
if ($segments[0] === 'auth') {
    $ctrl = new AuthController();
    match ([$method, $segments[1] ?? '']) {
        ['POST', 'send-otp']    => $ctrl->sendOtp(getBody()),
        ['POST', 'verify-otp']  => $ctrl->verifyOtp(getBody()),
        ['POST', 'logout']      => $ctrl->logout(),
        ['GET',  'me']          => $ctrl->me(),
        default                 => respond(false, null, 'Route not found', 404),
    };
}

// ── Insurance Routes ─────────────────────────────────────────
elseif ($segments[0] === 'insurance') {
    $ctrl = new InsuranceController();
    if ($method === 'GET' && isset($segments[1]) && isset($segments[2]) && $segments[2] === 'plans') {
        $ctrl->getPlans($segments[1], $_GET);
    } elseif ($method === 'GET' && isset($segments[1]) && isset($segments[2])) {
        $ctrl->getPlan($segments[1], $segments[2]);
    } elseif ($method === 'POST' && ($segments[1] ?? '') === 'quote') {
        $ctrl->getQuote(getBody());
    } else {
        respond(false, null, 'Route not found', 404);
    }
}

// ── Policy Routes ─────────────────────────────────────────────
elseif ($segments[0] === 'policies') {
    requireAuth();
    $ctrl = new PolicyController();
    match (true) {
        $method === 'GET' && empty($segments[1])                         => $ctrl->list(),
        $method === 'GET' && isset($segments[1])                         => $ctrl->get($segments[1]),
        $method === 'POST' && empty($segments[1])                        => $ctrl->create(getBody()),
        $method === 'GET' && isset($segments[2]) && $segments[2] === 'download' => $ctrl->download($segments[1]),
        default                                                           => respond(false, null, 'Route not found', 404),
    };
}

// ── Claims Routes ─────────────────────────────────────────────
elseif ($segments[0] === 'claims') {
    requireAuth();
    $ctrl = new ClaimController();
    match (true) {
        $method === 'GET'  && empty($segments[1]) => $ctrl->list(),
        $method === 'GET'  && isset($segments[1]) => $ctrl->get($segments[1]),
        $method === 'POST' && empty($segments[1]) => $ctrl->create(getBody()),
        $method === 'PATCH' && isset($segments[1]) && $segments[2] === 'status' => $ctrl->updateStatus($segments[1], getBody()),
        default => respond(false, null, 'Route not found', 404),
    };
}

// ── Agent Routes ─────────────────────────────────────────────
elseif ($segments[0] === 'agent') {
    requireAuth(['agent', 'admin']);
    $ctrl = new AgentController();
    match ([$method, $segments[1] ?? '']) {
        ['GET',  'dashboard']    => $ctrl->dashboard(),
        ['GET',  'leads']        => $ctrl->leads($_GET),
        ['POST', 'leads']        => $ctrl->createLead(getBody()),
        ['PATCH','leads']        => $ctrl->updateLead($segments[2] ?? '', getBody()),
        ['GET',  'clients']      => $ctrl->clients($_GET),
        ['GET',  'quotes']       => $ctrl->quotes($_GET),
        ['POST', 'quotes']       => $ctrl->createQuote(getBody()),
        ['GET',  'commissions']  => $ctrl->commissions($_GET),
        default                  => respond(false, null, 'Route not found', 404),
    };
}

// ── KYC Routes ─────────────────────────────────────────────
elseif ($segments[0] === 'kyc') {
    requireAuth();
    $ctrl = new KycController();
    match ([$method, $segments[1] ?? '']) {
        ['GET',  'status']    => $ctrl->status(),
        ['POST', 'upload']    => $ctrl->upload(),
        ['PATCH','approve']   => $ctrl->approve($segments[2] ?? '', getBody()),
        default               => respond(false, null, 'Route not found', 404),
    };
}

// ── Admin Routes ─────────────────────────────────────────────
elseif ($segments[0] === 'admin') {
    requireAuth(['admin']);
    $ctrl = new AdminController();
    match ([$method, $segments[1] ?? '']) {
        ['GET',  'dashboard']  => $ctrl->dashboard(),
        ['GET',  'users']      => $ctrl->users($_GET),
        ['GET',  'agents']     => $ctrl->agents($_GET),
        ['GET',  'policies']   => $ctrl->policies($_GET),
        ['GET',  'claims']     => $ctrl->claims($_GET),
        ['PATCH','claims']     => $ctrl->updateClaim($segments[2] ?? '', getBody()),
        ['GET',  'kyc']        => $ctrl->kycQueue($_GET),
        ['PATCH','kyc']        => $ctrl->updateKyc($segments[2] ?? '', getBody()),
        ['GET',  'analytics']  => $ctrl->analytics($_GET),
        ['GET',  'payments']   => $ctrl->payments($_GET),
        default                => respond(false, null, 'Route not found', 404),
    };
}

else {
    respond(false, null, 'Route not found', 404);
}
