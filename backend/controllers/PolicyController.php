<?php
// ============================================================
// PolicyController
// ============================================================

class PolicyController {

    // GET /api/policies
    public function list(): void {
        $user = requireAuth();
        $db = getDB();

        $stmt = $db->prepare('
            SELECT p.*, ip.name as plan_name, ip.category, i.name as insurer_name, i.logo
            FROM policies p
            JOIN insurance_plans ip ON ip.id = p.plan_id
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        ');
        $stmt->execute([$user['user_id']]);
        respond(true, $stmt->fetchAll());
    }

    // GET /api/policies/{id}
    public function get(string $id): void {
        $user = requireAuth();
        $db   = getDB();

        $stmt = $db->prepare('
            SELECT p.*, ip.name as plan_name, ip.category, ip.coverage_details,
                   i.name as insurer_name, i.logo, i.support_phone
            FROM policies p
            JOIN insurance_plans ip ON ip.id = p.plan_id
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE p.id = ? AND (p.user_id = ? OR ? = \'admin\')
        ');
        $stmt->execute([$id, $user['user_id'], $user['role']]);
        $policy = $stmt->fetch();
        if (!$policy) respond(false, null, 'Policy not found', 404);
        respond(true, $policy);
    }

    // POST /api/policies  { plan_id, holder_details, vehicle_details, payment_id, addons }
    public function create(array $body): void {
        $user = requireAuth();
        $db   = getDB();

        $planId = $body['plan_id'] ?? null;
        if (!$planId) respond(false, null, 'plan_id required', 422);

        // Get plan
        $plan = $db->prepare('SELECT * FROM insurance_plans WHERE id = ?');
        $plan->execute([$planId]);
        $plan = $plan->fetch();
        if (!$plan) respond(false, null, 'Plan not found', 404);

        $policyNumber = 'POL-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));
        $startDate    = date('Y-m-d');
        $endDate      = date('Y-m-d', strtotime('+1 year'));

        $stmt = $db->prepare('
            INSERT INTO policies
            (policy_number, user_id, plan_id, holder_details, vehicle_details,
             addons, premium_paid, start_date, end_date, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, \'active\', NOW())
        ');
        $stmt->execute([
            $policyNumber,
            $user['user_id'],
            $planId,
            json_encode($body['holder_details'] ?? []),
            json_encode($body['vehicle_details'] ?? []),
            json_encode($body['addons'] ?? []),
            $body['premium'] ?? $plan['base_premium'],
            $startDate,
            $endDate,
        ]);

        $policyId = $db->lastInsertId();
        respond(true, ['policy_id' => $policyId, 'policy_number' => $policyNumber], 'Policy created successfully', 201);
    }

    // GET /api/policies/{id}/download
    public function download(string $id): void {
        requireAuth();
        // In real app: generate PDF and stream it
        respond(true, ['download_url' => "/storage/policies/{$id}.pdf"]);
    }
}
