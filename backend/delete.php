<?php
// ■ 関数呼び出し
require_once('funcs.php');

// 1.■ CORS対応
cors_header();
option_request();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // GETパラメータからIDを取得
        $id = $_GET['id'] ?? null;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '削除対象のIDが指定されていません'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // 2.■ データベース操作
        $pdo = db_conn();
        
        // まず削除対象が存在するかチェック
        $checkStmt = $pdo->prepare('SELECT schoolName FROM targetschool_table WHERE id = :id');
        $checkStmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $checkStmt->execute();
        $school = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$school) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => '指定されたデータが見つかりません'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // 削除実行
        $deleteStmt = $pdo->prepare('DELETE FROM targetschool_table WHERE id = :id');
        $deleteStmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $status = $deleteStmt->execute();

        if ($status === false) {
            errorHandle($deleteStmt);
        } else {
            // 削除成功
            echo json_encode([
                'success' => true,
                'message' => '志望校データを削除しました',
                'deletedSchool' => h($school['schoolName'])
            ], JSON_UNESCAPED_UNICODE);
        }
        
    } catch (Exception $e) {
        // エラーレスポンス
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'データ削除に失敗しました',
            'error' => h($e->getMessage())
        ], JSON_UNESCAPED_UNICODE);
    }
    
} else {
    // GETメソッド以外はエラー
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'GETメソッドのみ対応しています'
    ], JSON_UNESCAPED_UNICODE);
}
