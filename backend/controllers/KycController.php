<?php
// ============================================================
// KycController
// ============================================================

class KycController {

    public function status(): void {
        $user = requireAuth();
        $db   = getDB();

        $stmt = $db->prepare('SELECT * FROM user_kyc WHERE user_id = ? ORDER BY created_at DESC LIMIT 1');
        $stmt->execute([$user['user_id']]);
        $kyc = $stmt->fetch();
        respond(true, $kyc ?: ['status' => 'not_submitted']);
    }

    public function upload(): void {
        $user = requireAuth();
        $db   = getDB();

        if (empty($_FILES)) {
            respond(false, null, 'No files uploaded', 422);
        }

        $docType  = $_POST['doc_type'] ?? 'aadhaar';
        $allowed  = ['pan', 'aadhaar', 'driving_license', 'irdai_license', 'passport'];
        if (!in_array($docType, $allowed)) {
            respond(false, null, 'Invalid document type', 422);
        }

        $uploadDir = __DIR__ . '/../storage/kyc/' . $user['user_id'] . '/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $file = $_FILES['document'];
        $ext  = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $docType . '_' . time() . '.' . $ext;
        $path = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $path)) {
            respond(false, null, 'Upload failed', 500);
        }

        $storagePath = '/storage/kyc/' . $user['user_id'] . '/' . $filename;

        // Upsert KYC record
        $stmt = $db->prepare('
            INSERT INTO user_kyc (user_id, doc_type, file_path, status, created_at)
            VALUES (?, ?, ?, \'pending\', NOW())
            ON DUPLICATE KEY UPDATE file_path = ?, status = \'pending\', updated_at = NOW()
        ');
        $stmt->execute([$user['user_id'], $docType, $storagePath, $storagePath]);

        respond(true, ['path' => $storagePath], 'Document uploaded');
    }

    public function approve(string $id, array $body): void {
        requireAuth(['admin']);
        $db = getDB();

        $status = $body['status'] ?? '';
        if (!in_array($status, ['approved', 'rejected'])) {
            respond(false, null, 'Invalid status', 422);
        }

        $db->prepare('UPDATE user_kyc SET status = ?, reviewer_note = ?, reviewed_at = NOW() WHERE id = ?')
           ->execute([$status, $body['note'] ?? '', $id]);

        respond(true, null, 'KYC status updated');
    }
}
