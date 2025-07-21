<?php
// ■ 関数呼び出し
require_once('funcs.php');

// 1.CORS対応
cors_header();
option_request();

// 2.POST受け取り
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTデータを取得
    $id = $_POST['id'] ?? '';
    $schoolName = $_POST['schoolName'] ?? '';
    $interest = $_POST['interest'] ?? '';
    $examStartTime = $_POST['examStartTime'] ?? '';
    $examEndTime = $_POST['examEndTime'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $hensa = !empty($_POST['hensa']) ? (int)$_POST['hensa'] : 0;
    $station = $_POST['station'] ?? '';
    $walk = !empty($_POST['walk']) ? (int)$_POST['walk'] : 0;
    $favorite = $_POST['favorite'] ?? '';
    $application = $_POST['application'] ?? '';
    $applicationFee = !empty($_POST['applicationFee']) ? (int)$_POST['applicationFee'] : 0;
    $entrance = $_POST['entrance'] ?? '';
    $entranceFee = !empty($_POST['entranceFee']) ? (int)$_POST['entranceFee'] : 0;
    
    // IDが必須
    if (empty($id)) {
        echo "ERROR: 更新対象のIDが指定されていません";
        exit();
    }

    // 3.DB更新
    try {
        // (1)■ DB接続（関数呼び出し）
        $pdo = db_conn();
        
        $stmt = $pdo->prepare('
            UPDATE targetschool_table SET
                examStartTime = :examStartTime,
                examEndTime = :examEndTime,
                schoolName = :schoolName,
                subject = :subject,
                hensa = :hensa,
                station = :station,
                walk = :walk,
                interest = :interest,
                favorite = :favorite,
                application = :application,
                applicationFee = :applicationFee,
                entrance = :entrance,
                entranceFee = :entranceFee
            WHERE id = :id
        ');

        // データバインド
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->bindValue(':examStartTime', $examStartTime, PDO::PARAM_STR);
        $stmt->bindValue(':examEndTime', $examEndTime, PDO::PARAM_STR);
        $stmt->bindValue(':schoolName', $schoolName, PDO::PARAM_STR);
        $stmt->bindValue(':subject', $subject, PDO::PARAM_STR);
        $stmt->bindValue(':hensa', $hensa, PDO::PARAM_INT);
        $stmt->bindValue(':station', $station, PDO::PARAM_STR);
        $stmt->bindValue(':walk', $walk, PDO::PARAM_INT);
        $stmt->bindValue(':interest', (int)$interest, PDO::PARAM_INT);
        $stmt->bindValue(':favorite', $favorite, PDO::PARAM_STR);
        $stmt->bindValue(':application', $application, PDO::PARAM_STR);
        $stmt->bindValue(':applicationFee', $applicationFee, PDO::PARAM_INT);
        $stmt->bindValue(':entrance', $entrance, PDO::PARAM_STR);
        $stmt->bindValue(':entranceFee', $entranceFee, PDO::PARAM_INT);
        
        $status = $stmt->execute();

        if ($status === false) {
            // (2)■ エラー処理（関数呼び出し）
            errorHandle($stmt);
        } else {
            // ReactにSUCCESSを返答
            echo "SUCCESS: 志望校情報が正常に更新されました";
        }
        
    } catch (Exception $e) {
        echo "ERROR: データベース更新に失敗しました";
    }
        
} else {
    echo "ERROR: POSTメソッドのみ対応しています";
}
