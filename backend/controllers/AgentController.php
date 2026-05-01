<?php
// ============================================================
// AgentController
// ============================================================

class AgentController {

    public function dashboard(): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();

        $agentId = $this->getAgentId($user['user_id']);

        $totalLeads = $this->count('leads', 'agent_id', $agentId);
        $converted  = $this->count('leads', 'agent_id', $agentId, "status = 'converted'");
        $policies   = $this->count('policies', 'agent_id', $agentId, "status = 'active'");

        $earnings = (float)($db->prepare('SELECT COALESCE(SUM(amount), 0) FROM commissions WHERE agent_id = ?')
                              ->execute([$agentId]) ? $db->query("SELECT COALESCE(SUM(amount), 0) FROM commissions WHERE agent_id = $agentId")->fetchColumn() : 0);

        respond(true, [
            'total_leads'    => $totalLeads,
            'converted'      => $converted,
            'active_policies'=> $policies,
            'total_earnings' => $earnings,
        ]);
    }

    public function leads(array $query): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $sql = 'SELECT * FROM leads WHERE agent_id = ?';
        $params = [$agentId];

        if (!empty($query['status'])) {
            $sql .= ' AND status = ?';
            $params[] = $query['status'];
        }

        $sql .= ' ORDER BY created_at DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(true, $stmt->fetchAll());
    }

    public function createLead(array $body): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $stmt = $db->prepare('
            INSERT INTO leads (agent_id, name, phone, email, insurance_type, source, status, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, \'new\', ?, NOW())
        ');
        $stmt->execute([
            $agentId,
            $body['name'] ?? '',
            $body['phone'] ?? '',
            $body['email'] ?? '',
            $body['insurance_type'] ?? 'car',
            $body['source'] ?? 'manual',
            $body['notes'] ?? '',
        ]);

        respond(true, ['lead_id' => $db->lastInsertId()], 'Lead created', 201);
    }

    public function updateLead(string $leadId, array $body): void {
        requireAuth(['agent', 'admin']);
        $db = getDB();

        $allowed = ['status', 'notes', 'next_followup'];
        $sets = [];
        $params = [];
        foreach ($allowed as $field) {
            if (isset($body[$field])) {
                $sets[]   = "$field = ?";
                $params[] = $body[$field];
            }
        }
        if (empty($sets)) respond(false, null, 'Nothing to update', 422);
        $params[] = $leadId;
        $db->prepare('UPDATE leads SET ' . implode(', ', $sets) . ', updated_at = NOW() WHERE id = ?')->execute($params);
        respond(true, null, 'Lead updated');
    }

    public function clients(array $query): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $stmt = $db->prepare('
            SELECT u.id, u.name, u.phone, u.email, u.kyc_status,
                   COUNT(p.id) as policy_count
            FROM policies p
            JOIN users u ON u.id = p.user_id
            WHERE p.agent_id = ?
            GROUP BY u.id
            ORDER BY u.name ASC
        ');
        $stmt->execute([$agentId]);
        respond(true, $stmt->fetchAll());
    }

    public function quotes(array $query): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $stmt = $db->prepare('SELECT * FROM quotes WHERE agent_id = ? ORDER BY created_at DESC');
        $stmt->execute([$agentId]);
        respond(true, $stmt->fetchAll());
    }

    public function createQuote(array $body): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $stmt = $db->prepare('
            INSERT INTO quotes (agent_id, lead_id, plan_id, premium, details, status, valid_until, created_at)
            VALUES (?, ?, ?, ?, ?, \'sent\', DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())
        ');
        $stmt->execute([
            $agentId,
            $body['lead_id'] ?? null,
            $body['plan_id'] ?? null,
            $body['premium'] ?? 0,
            json_encode($body['details'] ?? []),
        ]);
        respond(true, ['quote_id' => $db->lastInsertId()], 'Quote created', 201);
    }

    public function commissions(array $query): void {
        $user = requireAuth(['agent', 'admin']);
        $db   = getDB();
        $agentId = $this->getAgentId($user['user_id']);

        $stmt = $db->prepare('
            SELECT c.*, p.policy_number, ip.name as plan_name, ip.category
            FROM commissions c
            JOIN policies p ON p.id = c.policy_id
            JOIN insurance_plans ip ON ip.id = p.plan_id
            WHERE c.agent_id = ?
            ORDER BY c.created_at DESC
        ');
        $stmt->execute([$agentId]);
        respond(true, $stmt->fetchAll());
    }

    private function getAgentId(int $userId): int {
        $stmt = getDB()->prepare('SELECT id FROM agents WHERE user_id = ?');
        $stmt->execute([$userId]);
        $id = $stmt->fetchColumn();
        if (!$id) respond(false, null, 'Agent profile not found', 404);
        return (int)$id;
    }

    private function count(string $table, string $col, $val, string $extra = ''): int {
        $where = $extra ? "AND $extra" : '';
        $stmt = getDB()->prepare("SELECT COUNT(*) FROM $table WHERE $col = ? $where");
        $stmt->execute([$val]);
        return (int)$stmt->fetchColumn();
    }
}
