<?php
// ============================================================
// ClaimController
// ============================================================

class ClaimController {

    public function list(): void {
        $user = requireAuth();
        $db   = getDB();

        $stmt = $db->prepare('
            SELECT c.*, p.policy_number, ip.category, ip.name as plan_name
            FROM claims c
            JOIN policies p ON p.id = c.policy_id
            JOIN insurance_plans ip ON ip.id = p.plan_id
            WHERE p.user_id = ?
            ORDER BY c.created_at DESC
        ');
        $stmt->execute([$user['user_id']]);
        $claims = $stmt->fetchAll();

        foreach ($claims as &$claim) {
            $timeline = $db->prepare('SELECT * FROM claim_timeline WHERE claim_id = ? ORDER BY created_at ASC');
            $timeline->execute([$claim['id']]);
            $claim['timeline'] = $timeline->fetchAll();
        }

        respond(true, $claims);
    }

    public function get(string $id): void {
        $user = requireAuth();
        $db   = getDB();

        $stmt = $db->prepare('
            SELECT c.*, p.policy_number, ip.category, ip.name as plan_name, i.name as insurer_name
            FROM claims c
            JOIN policies p ON p.id = c.policy_id
            JOIN insurance_plans ip ON ip.id = p.plan_id
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE c.id = ? AND (p.user_id = ? OR ? = \'admin\')
        ');
        $stmt->execute([$id, $user['user_id'], $user['role']]);
        $claim = $stmt->fetch();
        if (!$claim) respond(false, null, 'Claim not found', 404);
        respond(true, $claim);
    }

    public function create(array $body): void {
        $user = requireAuth();
        $db   = getDB();

        $policyId = $body['policy_id'] ?? null;
        if (!$policyId) respond(false, null, 'policy_id required', 422);

        $claimNumber = 'CLM-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

        $stmt = $db->prepare('
            INSERT INTO claims (claim_number, policy_id, type, incident_date, description, amount_claimed, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, \'submitted\', NOW())
        ');
        $stmt->execute([
            $claimNumber,
            $policyId,
            $body['type'] ?? 'accident',
            $body['incident_date'] ?? date('Y-m-d'),
            $body['description'] ?? '',
            $body['amount'] ?? 0,
        ]);

        $claimId = $db->lastInsertId();

        // Add timeline entry
        $db->prepare('INSERT INTO claim_timeline (claim_id, status, note, created_at) VALUES (?, \'submitted\', \'Claim submitted successfully\', NOW())')
           ->execute([$claimId]);

        respond(true, ['claim_id' => $claimId, 'claim_number' => $claimNumber], 'Claim submitted', 201);
    }

    public function updateStatus(string $id, array $body): void {
        requireAuth(['admin']);
        $db = getDB();

        $validStatuses = ['under_review', 'approved', 'rejected', 'paid'];
        $status = $body['status'] ?? '';
        if (!in_array($status, $validStatuses)) respond(false, null, 'Invalid status', 422);

        $db->prepare('UPDATE claims SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$status, $id]);

        // Timeline
        $db->prepare('INSERT INTO claim_timeline (claim_id, status, note, created_at) VALUES (?, ?, ?, NOW())')
           ->execute([$id, $status, $body['note'] ?? "Status updated to $status"]);

        respond(true, null, 'Claim status updated');
    }
}
