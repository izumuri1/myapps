<?php
/////////////////////////////////////////////
// DB接続
/////////////////////////////////////////////
function db_conn(){
    // configを呼び出すおまじない

    // ★本番用：絶対パス表示
    $config = require('/home/izumuri/.php.config/db_config.php');

    // ★ローカルホスト用：相対パス表示
    // $config = require(__DIR__ . '/config/db_config.php');
    
    try {$pdo = new PDO(
            "mysql:dbname={$config['db']}; charset={$config['charset']}; host={$config['host']}",
            $config['user'], 
            $config['pass']        );
        return $pdo;
    } catch (PDOException $e) {
        exit('DB Connection Error:' . $e->getMessage());
    }
}


/////////////////////////////////////////////
// CORS設定：特定のリクエストだけ許可
/////////////////////////////////////////////
// ◆◆◆難しい（よく理解できていない）
function cors_header(){
    // CORS設定1つ目：Viteで立ち上げたReact開発用サーバーのポートからのリクエストだけを許可
    // ★★★★★Viteのポートを要確認！！！
    header('Access-Control-Allow-Origin: https://izumuri.sakura.ne.jp');
    // CORS設定2つ目：このサーバーに対してHTTPメソッド（GET/POST/OPTIONS）によるリクエストを許可
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    // CORS設定3つ目：リクエストヘッダーとしてContent-Type（送信データの型情報）とX-Requested-With（Ajax通信を示すヘッダー）を許可
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    // CORS設定4つ目：認証情報（CookieやAuthorizationヘッダー）が付いたリクエストも許可
    // たとえば「ログイン済みユーザー」だけ使えるAPIなど、クロスオリジンでもCookieを有効化したい場合に必須の指定
    // こうすると、JSのfetchでcredentials: 'include'やwithCredentials: true指定が効くようになる
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
}



/////////////////////////////////////////////
// CORS設定：特定のリクエストだけ許可
/////////////////////////////////////////////
// ◆◆◆難しい（よく理解できていない）
// CORS対応で必要なプリフライト（OPTIONS）リクエスト専用の処理
// クライアント（React）からブラウザ経由でfetchを使い、POSTを送ると、まず「OPTIONS」リクエストが自動で発生
// このリクエストが来たら「200 OKヘッダーとCORSヘッダーだけ返して、その後は余計な処理しない」処理

// CORS対応のためにブラウザが本リクエストの前に送る“事前問い合わせリクエスト（OPTIONSリクエスト）
// PHPの組み込み変数$_SERVER['REQUEST_METHOD']で、今のHTTPリクエストが「OPTIONS」かどうかを判定
// OPTIONSは、CORSでカスタムヘッダーやPOST/PUTなどを使う際に自動的に送られる事前問い合わせリクエスト
// if文は「いま受けたリクエストがOPTIONSリクエストなら…」という意味
function option_request(){
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // 「このOPTIONSリクエストは正常に受け付けたよ」と返答
        http_response_code(200);
        // 処理終わり
        exit();
    }
}



/////////////////////////////////////////////
// SQL実行時のエラー処理
/////////////////////////////////////////////
function errorHandle($stmt){
    $error = $stmt->errorInfo();
    exit('SQLError:' . print_r($error, true));
}


/////////////////////////////////////////////
// XSS対策
/////////////////////////////////////////////
function h($str){
    return htmlspecialchars($str, ENT_QUOTES);
}

