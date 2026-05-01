<?php
// ============================================================
// AuthController — OTP-based Phone Authentication
// ============================================================

class AuthController {

    // POST /api/auth/send-otp
    public function sendOtp(array $body): void {
        $phone = trim($body['phone'] ?? '');
        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            respond(false, null, 'Invalid phone number', 422);
        }

        $otp = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', time() + 300); // 5 minutes

        $db = getDB();

        // Upsert user
        $stmt = $db->prepare('INSERT INTO users (phone, created_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE phone = phone');
        $stmt->execute([$phone]);
        $userId = $db->lastInsertId() ?: $this->getUserIdByPhone($phone);

        // Store OTP
        $stmt = $db->prepare('INSERT INTO otp_sessions (user_id, phone, otp, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?');
        $stmt->execute([$userId, $phone, $otp, $expiresAt, $otp, $expiresAt]);

        // TODO: Integrate SMS provider (e.g., MSG91, Twilio)
        // Return OTP in response until SMS is configured
        $data = ['otp_sent' => true, 'debug_otp' => $otp];

        respond(true, $data, 'OTP sent successfully');
    }

    // POST /api/auth/verify-otp
    public function verifyOtp(array $body): void {
        $phone = trim($body['phone'] ?? '');
        $otp   = trim($body['otp'] ?? '');

        if (!$phone || !$otp) {
            respond(false, null, 'Phone and OTP are required', 422);
        }

        $db = getDB();

        $stmt = $db->prepare('
            SELECT os.*, u.id as user_id, u.name, u.email, u.role, u.avatar, u.kyc_status
            FROM otp_sessions os
            JOIN users u ON u.id = os.user_id
            WHERE os.phone = ? AND os.otp = ? AND os.expires_at > NOW()
            ORDER BY os.created_at DESC LIMIT 1
        ');
        $stmt->execute([$phone, $otp]);
        $row = $stmt->fetch();

        if (!$row) {
            respond(false, null, 'Invalid or expired OTP', 401);
        }

        // Invalidate OTP
        $db->prepare('DELETE FROM otp_sessions WHERE phone = ?')->execute([$phone]);

        $user = [
            'id'         => $row['user_id'],
            'phone'      => $phone,
            'name'       => $row['name'],
            'email'      => $row['email'],
            'role'       => $row['role'],
            'avatar'     => $row['avatar'],
            'kycStatus'  => $row['kyc_status'],
        ];

        $token = jwtEncode(['user_id' => $row['user_id'], 'phone' => $phone, 'role' => $row['role']]);

        respond(true, ['user' => $user, 'token' => $token], 'Login successful');
    }

    // POST /api/auth/logout
    public function logout(): void {
        // JWT is stateless — client should discard the token
        respond(true, null, 'Logged out successfully');
    }

    // GET /api/auth/me
    public function me(): void {
        $payload = requireAuth();
        $db = getDB();
        $stmt = $db->prepare('SELECT id, phone, name, email, role, avatar, kyc_status FROM users WHERE id = ?');
        $stmt->execute([$payload['user_id']]);
        $user = $stmt->fetch();
        if (!$user) respond(false, null, 'User not found', 404);
        respond(true, $user);
    }

    private function getUserIdByPhone(string $phone): int {
        $stmt = getDB()->prepare('SELECT id FROM users WHERE phone = ?');
        $stmt->execute([$phone]);
        return (int)$stmt->fetchColumn();
    }
}
