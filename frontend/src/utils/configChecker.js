// src/utils/configChecker.js - 設定確認用
import { API_URLS, CONFIG } from '../config/config.js';

export const checkConfig = () => {
  console.log('📋 設定確認結果:');
  console.log('─'.repeat(50));
  console.log('🏷️  環境:', import.meta.env.MODE);
  console.log('🌐 Base URL:', CONFIG.BASE_URL);
  console.log('📡 API URLs:');
  
  Object.entries(API_URLS).forEach(([key, url]) => {
    console.log(`   ${key}: ${url}`);
  });
  
  console.log('─'.repeat(50));
  
  // URL接続テスト
  if (CONFIG.BASE_URL.includes('localhost')) {
    console.log('⚠️  開発環境設定です');
  } else {
    console.log('🚀 本番環境設定です');
  }
};

// 開発時のみ実行
if (import.meta.env.MODE === 'development') {
  checkConfig();
}