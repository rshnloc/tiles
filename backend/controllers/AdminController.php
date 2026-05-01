<?php
// ============================================================
// AdminController
// ============================================================

class AdminController {

    public function dashboard(): void {
        requireAuth(['admin']);
        $db = getDB();

        $totalUsers    = $this->scalar('SELECT COUNT(*) FROM users');
        $totalAgents   = $this->scalar('SELECT COUNT(*) FROM agents');
        $totalPolicies = $this->scalar('SELECT COUNT(*) FROM policies');
        $activePolicies= $this->scalar("SELECT COUNT(*) FROM policies WHERE status = 'active'");
        $pendingKyc    = $this->scalar("SELECT COUNT(*) FROM user_kyc WHERE status = 'pending'");
        $openClaims    = $this->scalar("SELECT COUNT(*) FROM claims WHERE status IN ('submitted','under_review')");
        $totalRevenue  = $this->scalar('SELECT COALESCE(SUM(premium_paid), 0) FROM policies');

        respond(true, [
            'total_users'     => $totalUsers,
            'total_agents'    => $totalAgents,
            'total_policies'  => $totalPolicies,
            'active_policies' => $activePolicies,
            'pending_kyc'     => $pendingKyc,
            'open_claims'     => $openClaims,
            'total_revenue'   => $totalRevenue,
        ]);
    }

    public function users(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $sql = 'SELECT u.*, (SELECT COUNT(*) FROM policies WHERE user_id = u.id) as policy_count FROM users u WHERE 1=1';
        $params = [];

        if (!empty($query['role'])) {
            $sql .= ' AND u.role = ?';
            $params[] = $query['role'];
        }
        if (!empty($query['kyc_status'])) {
            $sql .= ' AND u.kyc_status = ?';
            $params[] = $query['kyc_status'];
        }
        if (!empty($query['search'])) {
            $sql .= ' AND (u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)';
            $like = '%' . $query['search'] . '%';
            $params = array_merge($params, [$like, $like, $like]);
        }

        $sql .= ' ORDER BY u.created_at DESC LIMIT 50';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(true, $stmt->fetchAll());
    }

    public function agents(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $stmt = $db->prepare('
            SELECT a.*, u.name, u.phone, u.email, u.kyc_status,
                   COUNT(p.id) as total_policies,
                   COALESCE(SUM(c.amount), 0) as total_commission
            FROM agents a
            JOIN users u ON u.id = a.user_id
            LEFT JOIN policies p ON p.agent_id = a.id AND p.status = \'active\'
            LEFT JOIN commissions c ON c.agent_id = a.id
            GROUP BY a.id
            ORDER BY total_policies DESC
        ');
        $stmt->execute();
        respond(true, $stmt->fetchAll());
    }

    public function policies(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $sql = '
            SELECT p.*, u.name as holder_name, u.phone as holder_phone,
                   ip.name as plan_name, ip.category, i.name as insurer_name
            FROM policies p
            JOIN users u ON u.id = p.user_id
            JOIN insurance_plans ip ON ip.id = p.plan_id
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE 1=1
        ';
        $params = [];

        if (!empty($query['status'])) {
            $sql .= ' AND p.status = ?';
            $params[] = $query['status'];
        }
        if (!empty($query['category'])) {
            $sql .= ' AND ip.category = ?';
            $params[] = $query['category'];
        }

        $sql .= ' ORDER BY p.created_at DESC LIMIT 50';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(true, $stmt->fetchAll());
    }

    public function claims(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $sql = '
            SELECT c.*, p.policy_number, u.name as customer_name,
                   ip.category, ip.name as plan_name
            FROM claims c
            JOIN policies p ON p.id = c.policy_id
            JOIN users u ON u.id = p.user_id
            JOIN insurance_plans ip ON ip.id = p.plan_id
            WHERE 1=1
        ';
        $params = [];

        if (!empty($query['status'])) {
            $sql .= ' AND c.status = ?';
            $params[] = $query['status'];
        }

        $sql .= ' ORDER BY c.created_at DESC LIMIT 50';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(true, $stmt->fetchAll());
    }

    public function updateClaim(string $id, array $body): void {
        requireAuth(['admin']);
        $db = getDB();

        $validStatuses = ['under_review', 'approved', 'rejected', 'paid'];
        $status = $body['status'] ?? '';
        if (!in_array($status, $validStatuses)) respond(false, null, 'Invalid status', 422);

        $db->prepare('UPDATE claims SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$status, $id]);
        $db->prepare('INSERT INTO claim_timeline (claim_id, status, note, created_at) VALUES (?, ?, ?, NOW())')
           ->execute([$id, $status, $body['note'] ?? "Admin updated status to $status"]);

        respond(true, null, 'Claim updated');
    }

    public function kycQueue(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $sql = 'SELECT k.*, u.name, u.phone, u.email, u.role FROM user_kyc k JOIN users u ON u.id = k.user_id WHERE 1=1';
        $params = [];

        $status = $query['status'] ?? 'pending';
        if ($status !== 'all') {
            $sql .= ' AND k.status = ?';
            $params[] = $status;
        }
        $sql .= ' ORDER BY k.created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(true, $stmt->fetchAll());
    }

    public function updateKyc(string $id, array $body): void {
        requireAuth(['admin']);
        $db = getDB();

        $status = $body['status'] ?? '';
        if (!in_array($status, ['approved', 'rejected'])) respond(false, null, 'Invalid status', 422);

        $db->prepare('UPDATE user_kyc SET status = ?, reviewed_at = NOW(), reviewer_note = ? WHERE id = ?')
           ->execute([$status, $body['note'] ?? '', $id]);

        // Sync kyc_status on users table
        $kyc = $db->prepare('SELECT user_id FROM user_kyc WHERE id = ?');
        $kyc->execute([$id]);
        $userId = $kyc->fetchColumn();
        if ($userId) {
            $db->prepare('UPDATE users SET kyc_status = ? WHERE id = ?')->execute([$status, $userId]);
        }

        respond(true, null, 'KYC status updated');
    }

    public function analytics(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $monthly = $db->query('
            SELECT DATE_FORMAT(created_at, \'%Y-%m\') as month,
                   COUNT(*) as policies,
                   SUM(premium_paid) as revenue
            FROM policies
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY month
            ORDER BY month ASC
        ')->fetchAll();

        $byCategory = $db->query('
            SELECT ip.category, COUNT(*) as count, SUM(p.premium_paid) as revenue
            FROM policies p JOIN insurance_plans ip ON ip.id = p.plan_id
            GROUP BY ip.category
        ')->fetchAll();

        respond(true, ['monthly' => $monthly, 'by_category' => $byCategory]);
    }

    public function payments(array $query): void {
        requireAuth(['admin']);
        $db = getDB();

        $stmt = $db->prepare('
            SELECT p.*, u.name as user_name, pol.policy_number
            FROM payments p
            JOIN users u ON u.id = p.user_id
            JOIN policies pol ON pol.id = p.policy_id
            ORDER BY p.created_at DESC LIMIT 50
        ');
        $stmt->execute();
        respond(true, $stmt->fetchAll());
    }

    private function scalar(string $sql): mixed {
        return getDB()->query($sql)->fetchColumn();
    }
}
