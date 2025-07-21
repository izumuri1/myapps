<?php
// セッション開始
session_start();

// ■ 関数呼び出し
require_once('funcs.php');

// 1.CORS対応
cors_header();
option_request();

// 2.POST受け取り
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTデータを取得
    $id = $_POST['id'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // 入力値チェック
    if (empty($id) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'IDとパスワードを入力してください'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        // 3.DB接続
        $pdo = db_conn();
        
        // ユーザー情報を取得（IDで検索）
        $stmt = $pdo->prepare('SELECT id, password, flag FROM user_table WHERE id = :id');
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // ユーザーが存在しない場合
        if (!$user) {
            echo json_encode([
                'success' => false,
                'message' => 'IDまたはパスワードが間違っています'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        // パスワード照合
        // DBのパスワードがハッシュ化されている場合
        if (password_verify($password, $user['password'])) {
            // ログイン成功 - セッションに情報を保存
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_flag'] = $user['flag'];
            $_SESSION['login_time'] = time();
            
            // ユーザータイプを判定
            $userType = ($user['flag'] == 9) ? 'admin' : 'general';
            
            echo json_encode([
                'success' => true,
                'message' => 'ログインに成功しました',
                'user' => [
                    'id' => $user['id'],
                    'flag' => $user['flag'],
                    'type' => $userType
                ]
            ], JSON_UNESCAPED_UNICODE);
            
        } 
        // DBのパスワードがプレーンテキストの場合（開発用）
        elseif ($password === $user['password']) {
            // ログイン成功 - セッションに情報を保存
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_flag'] = $user['flag'];
            $_SESSION['login_time'] = time();
            
            // ユーザータイプを判定
            $userType = ($user['flag'] == 9) ? 'admin' : 'general';
            
            echo json_encode([
                'success' => true,
                'message' => 'ログインに成功しました',
                'user' => [
                    'id' => $user['id'],
                    'flag' => $user['flag'],
                    'type' => $userType
                ]
            ], JSON_UNESCAPED_UNICODE);
            
        } else {
            // パスワード不一致
            echo json_encode([
                'success' => false,
                'message' => 'IDまたはパスワードが間違っています'
            ], JSON_UNESCAPED_UNICODE);
        }
        
    } catch (Exception $e) {
        // エラーレスポンス
        echo json_encode([
            'success' => false,
            'message' => 'ログイン処理でエラーが発生しました',
            'error' => h($e->getMessage())
        ], JSON_UNESCAPED_UNICODE);
    }
    
} else {
    // POSTメソッド以外はエラー
    echo json_encode([
        'success' => false,
        'message' => 'POSTメソッドのみ対応しています'
    ], JSON_UNESCAPED_UNICODE);
}
