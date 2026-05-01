<?php
// ============================================================
// Backend Entry Point — index.php
// All API requests routed here via .htaccess
// ============================================================

require_once __DIR__ . '/config/env.php';       // load .env first
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/jwt.php';
require_once __DIR__ . '/routes/api.php';
