<?php
// ■ 関数呼び出し
require_once('funcs.php');

// 1.■ CORS対応
cors_header();
option_request();
// 2.GET受け取り
// PHPのスーパーグローバル変数 $_SERVER['REQUEST_METHOD']を使って、リクエストがGETかを判定
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // ソートタイプを取得（デフォルトは志望度順）
        $sortType = $_GET['sort'] ?? 'interest';
        
        // ソートタイプに応じてORDER BY句を決定
        $orderBy = '';
        switch ($sortType) {
            case 'interest':
                $orderBy = 'ORDER BY interest DESC, schoolName ASC';
                break;
            case 'examDate':
                $orderBy = 'ORDER BY examStartTime ASC, schoolName ASC';
                break;
            case 'entrance':
                $orderBy = 'ORDER BY entrance ASC, schoolName ASC';
                break;
            default:
                $orderBy = 'ORDER BY interest DESC, schoolName ASC';
        }
        
        // 3.DBへの検索
        // (1)■ DB接続
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
            {$orderBy}
        ");
        
        $stmt->execute();
        $schools = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 🔥 XSS対策：各文字列フィールドをサニタイズ
        $safeschools = [];
        foreach ($schools as $school) {
            $safeschools[] = [
                'id' => $school['id'],
                'examStartTime' => $school['examStartTime'],
                'examEndTime' => $school['examEndTime'],
                'schoolName' => h($school['schoolName']),           // XSS対策
                'subject' => h($school['subject']),                 // XSS対策
                'hensa' => (int)$school['hensa'],                   // 数値は安全
                'station' => h($school['station']),                // XSS対策
                'walk' => (int)$school['walk'],                     // 数値は安全
                'interest' => (int)$school['interest'],             // 数値は安全
                'favorite' => h($school['favorite']),              // XSS対策
                'application' => $school['application'],
                'applicationFee' => (int)$school['applicationFee'], // 数値は安全
                'entrance' => $school['entrance'],
                'entranceFee' => (int)$school['entranceFee']        // 数値は安全
            ];
        }
        
        // 成功レスポンス
        echo json_encode([
            'success' => true,
            'data' => $safeschools,  // サニタイズ済みデータ
            'count' => count($safeschools),
            'sortType' => h($sortType)  // XSS対策
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        // エラーレスポンス
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'データ取得に失敗しました',
            'error' => h($e->getMessage())  // XSS対策
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
