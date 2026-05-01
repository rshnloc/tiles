<?php
// ============================================================
// InsuranceController — Plans, Quotes, Insurers
// ============================================================

class InsuranceController {

    // GET /api/insurance/{category}/plans?sort=premium&min=5000&max=30000
    public function getPlans(string $category, array $query): void {
        $validCategories = ['car', 'bike', 'health', 'life'];
        if (!in_array($category, $validCategories)) {
            respond(false, null, 'Invalid category', 422);
        }

        $db = getDB();
        $sql = '
            SELECT ip.*, i.name as insurer_name, i.logo, i.claim_ratio
            FROM insurance_plans ip
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE ip.category = ? AND ip.is_active = 1
        ';
        $params = [$category];

        if (!empty($query['min_premium'])) {
            $sql .= ' AND ip.base_premium >= ?';
            $params[] = (float)$query['min_premium'];
        }
        if (!empty($query['max_premium'])) {
            $sql .= ' AND ip.base_premium <= ?';
            $params[] = (float)$query['max_premium'];
        }
        if (!empty($query['min_claim_ratio'])) {
            $sql .= ' AND i.claim_ratio >= ?';
            $params[] = (float)$query['min_claim_ratio'];
        }

        $allowedSorts = ['base_premium', 'claim_ratio', 'rating'];
        $sort = in_array($query['sort'] ?? '', $allowedSorts) ? $query['sort'] : 'base_premium';
        $sql .= " ORDER BY ip.$sort ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $plans = $stmt->fetchAll();

        // Attach addons
        foreach ($plans as &$plan) {
            $addons = $db->prepare('SELECT * FROM plan_addons WHERE plan_id = ?');
            $addons->execute([$plan['id']]);
            $plan['addons'] = $addons->fetchAll();
        }

        respond(true, $plans);
    }

    // GET /api/insurance/{category}/{planId}
    public function getPlan(string $category, string $planId): void {
        $db = getDB();
        $stmt = $db->prepare('
            SELECT ip.*, i.name as insurer_name, i.logo, i.claim_ratio, i.website, i.support_phone
            FROM insurance_plans ip
            JOIN insurers i ON i.id = ip.insurer_id
            WHERE ip.id = ? AND ip.category = ?
        ');
        $stmt->execute([$planId, $category]);
        $plan = $stmt->fetch();
        if (!$plan) respond(false, null, 'Plan not found', 404);

        $addons = $db->prepare('SELECT * FROM plan_addons WHERE plan_id = ?');
        $addons->execute([$planId]);
        $plan['addons'] = $addons->fetchAll();

        respond(true, $plan);
    }

    // POST /api/insurance/quote  { category, details }
    public function getQuote(array $body): void {
        $category = $body['category'] ?? '';
        $details  = $body['details'] ?? [];

        // Simplified quote engine — real engine would factor in vehicle age, IDV, NCB etc.
        $basePremiums = ['car' => 12000, 'bike' => 3500, 'health' => 8000, 'life' => 15000];
        $base = $basePremiums[$category] ?? 10000;

        // Age factor for health/life
        $age = (int)($details['age'] ?? 30);
        $ageFactor = $age > 50 ? 1.5 : ($age > 35 ? 1.2 : 1.0);

        // NCB discount for motor
        $ncb = (int)($details['ncb'] ?? 0);
        $ncbDiscount = min($ncb / 100, 0.5);

        $premium = (int)($base * $ageFactor * (1 - $ncbDiscount));
        $gst     = (int)($premium * 0.18);
        $total   = $premium + $gst;

        respond(true, [
            'base_premium' => $premium,
            'gst'          => $gst,
            'total'        => $total,
            'valid_until'  => date('Y-m-d', strtotime('+7 days')),
        ]);
    }
}
