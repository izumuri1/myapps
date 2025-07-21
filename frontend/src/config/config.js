// 環境設定ファイル

// 環境判定（developmentかproductionか）
// import.meta.env.MODEは、現在アプリがどの環境で動いているかを示すViteの組込環境変数
const isDevelopment = import.meta.env.MODE === 'development';

// 開発環境のURL
const DEVELOPMENT_CONFIG = {
  BASE_URL: 'http://localhost/myapps/backend',
  API_ENDPOINTS: {
    INSERT: '/insert.php',
    UPDATE: '/update.php',
    SELECT: '/select.php',
    DELETE: '/delete.php',
    DETAIL: '/detail.php',
    LOGIN: '/login.php'
  }
};

// 本番環境のURL（★★★★★ここを本番URLに変更）
const PRODUCTION_CONFIG = {
  BASE_URL: 'https://izumuri.sakura.ne.jp/backend',  // ★★★★★要変更
  API_ENDPOINTS: {
    INSERT: '/insert.php',
    UPDATE: '/update.php',
    SELECT: '/select.php',
    DELETE: '/delete.php',
    DETAIL: '/detail.php',
    LOGIN: '/login.php'
  }
};

// 現在の環境に応じた設定を選択
// 環境判定が、開発環境ならDEVELOPMENT_CONFIG、本番ならPRODUCTION_CONFIGをconfigに代入
const config = isDevelopment ? DEVELOPMENT_CONFIG : PRODUCTION_CONFIG;

// APIのフルURLを生成するヘルパー関数
export const getApiUrl = (endpoint) => {
  return `${config.BASE_URL}${config.API_ENDPOINTS[endpoint]}`;
};

// 個別のAPI URL（直接使用したい場合）
export const API_URLS = {
  INSERT: getApiUrl('INSERT'),
  UPDATE: getApiUrl('UPDATE'),
  SELECT: getApiUrl('SELECT'),
  DELETE: getApiUrl('DELETE'),
  DETAIL: getApiUrl('DETAIL'),
  LOGIN: getApiUrl('LOGIN')
};

// 設定全体をエクスポート
export const CONFIG = config;

// デバッグ用（開発時のみ）
if (isDevelopment) {
  console.log('現在の環境:', import.meta.env.MODE);
  console.log('API URLs:', API_URLS);
}