import React from 'react'
import "./style.module.scss";
import ListSelect from '../../components/ListSelect';
import Layout from "../../layout/Layout";
import { useSearchParams } from 'react-router-dom';

const List = () => {
  // URLパラメータを取得（例: /list?sort=interest）
  const [searchParams] = useSearchParams();
  const sortType = searchParams.get('sort') || 'interest'; // デフォルトは志望度順

  return (
    <>
      <Layout>
        <div className="list">
          {/* sortTypeをpropsで渡す */}
          <ListSelect sortType={sortType} />
        </div>
      </Layout>
    </>
  )
}

export default List

///////////////////////////////////////////////////////////////////////////////////////////////////
// 【学習】
// 
// 1.全体の流れ
//    Header → List → ListSelect → select.php → DB → ListSelect → 画面表示
// 
// 2.Header：URL遷移
//    ユーザーがHeaderのリンクをクリック
//    React Routerが/list?sort=xxxに遷移
//    URLパラメータ: sort=interestが送信される
// 
// 3.List：URLパラメータを受け取り、propsとしてListSelectへ渡す
//    URLから?sort=xxxを取得
//    sortType = "xxx"に設定
//    sortTypeをpropsとしてListSelectに渡す
// 
// 4.ListSelect：
//    ListからsortType="xxx"をpropsで受け取り
//    select.php?sort=xxxにGETリクエストをHTTP通信
//    sortTypeが変わるとuseEffectにより自動で再取得
// 
// 5.select.php：GET受け取り、DB操作
//    $_GET['sort']でHTTPパラメータを取得
//    ソート条件に応じたSQL作成
//    データベースから志望校データを取得
// 6.select.php：h関数でXSS対策、Reactへの返答のためデータをJSON形式へ変換
//    XSS対策
//    数値フィールドをint型に変換
//    HTTP通信用のJSON形式に変換
// 
// 7.ListSelect：JSON受信、画面更新
//    PHPからのJSONレスポンス受信
//    schoolsstateに学校データを保存
//    状態が変わったので画面を更新
///////////////////////////////////////////////////////////////////////////////////////////////////