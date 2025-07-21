<?php
// ■ 関数呼び出し
require_once('funcs.php');

// 1.■ CORS対応
cors_header();
option_request();

// 2.GET受け取り
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // IDを取得
        $id = $_GET['id'] ?? '';
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => '学校IDが指定されていません'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // 3.DBへの検索
        $pdo = db_conn();
        
        // SQL作成・実行
        $stmt = $pdo->prepare("
            SELECT 
                id,
                examStartTime,
                examEndTime,
                schoolName,
                subject,
                hensa,
                station,
                walk,
                interest,
                favorite,
                application,
                applicationFee,
                entrance,
                entranceFee
            FROM targetschool_table 
            WHERE id = :id
        ");
        
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        $school = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$school) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => '指定された学校データが見つかりません'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // XSS対策：文字列フィールドをサニタイズ
        $safeSchool = [
            'id' => $school['id'],
            'examStartTime' => $school['examStartTime'],
            'examEndTime' => $school['examEndTime'],
            'schoolName' => h($school['schoolName']),
            'subject' => h($school['subject']),
            'hensa' => (int)$school['hensa'],
            'station' => h($school['station']),
            'walk' => (int)$school['walk'],
            'interest' => (int)$school['interest'],
            'favorite' => h($school['favorite']),
            'application' => $school['application'],
            'applicationFee' => (int)$school['applicationFee'],
            'entrance' => $school['entrance'],
            'entranceFee' => (int)$school['entranceFee']
        ];
        
        // 成功レスポンス
        echo json_encode([
            'success' => true,
            'data' => $safeSchool
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        // エラーレスポンス
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'データ取得に失敗しました',
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
