<?php
// ■ 関数呼び出し
require_once('funcs.php');

// 1.CORS対応

// CORSヘッダー（クロスオリジンリソースシェアリング）。どのオリジン（ドメイン＋ポート）からのリクエストを許可するか
// ■ 関数呼び出し
cors_header();
option_request();

// 2.POST受け取り
// PHPのスーパーグローバル変数 $_SERVER['REQUEST_METHOD']を使って、リクエストがPOSTかを判定
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTデータを取得しPHPの変数（$xxx）に格納
    // 「左の値 ?? 右の値」➡　左がnullでなければ左の値、nullの場合は右の値
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
    

    // 3.DB登録
    try {
        // (1)■ DB接続（関数呼び出し）
        $pdo = db_conn();
        
        $stmt = $pdo->prepare('
            INSERT INTO targetschool_table
                (examStartTime, examEndTime, schoolName, subject, hensa, station, walk, interest, 
                favorite, application, applicationFee, entrance, entranceFee) 
            VALUES
                (:examStartTime, :examEndTime, :schoolName, :subject, :hensa, :station, :walk, :interest, 
                :favorite, :application, :applicationFee, :entrance, :entranceFee)
        ');

        // データバインド
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
            echo "SUCCESS: 志望校が正常に登録されました";
        }
        
    } catch (Exception $e) {
        echo "ERROR: データベース登録に失敗しました";
    }
        
    } else {
    echo "ERROR: POSTメソッドのみ対応しています";
}

