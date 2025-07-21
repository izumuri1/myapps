import React from "react";
import "./style.module.scss";
import HookForm from "../../components/HookForm";
import { useState } from "react";
import Layout from "../../layout/Layout";

const Home = () => {
  // registerに初期値をセット
  const [register, setRegister] = useState({
    examStartTime: "",
    examEndTime: "",
    schoolName: "",
    subject: "",
    hensa:  "",
    station: "",
    walk: "",
    interest: "",
    favorite: "",
    application: "",
    applicationFee: "",
    entrance: "",
    entranceFee: ""
  })
  // registerを更新する関数を定義
  const handleFormSubmit = (data) => {setRegister({
    examStartTime: data.examStartTime,
    examEndTime: data.examEndTime,
    schoolName: data.schoolName,
    subject: data.subject,
    hensa:  data.hensa,
    station: data.station,
    walk: data.walk,
    interest: data.interest,
    favorite: data.favorite,
    application: data.application,
    applicationFee: data.applicationFee,
    entrance: data.entrance,
    entranceFee: data.entranceFee
  })
}

  return (
    <>
      <Layout>
        <div className="hookForm">
          {/* onSubmit（props）として子（HookForm）へ関数を渡す */}
          <HookForm  onSubmit={handleFormSubmit}/>
        </div>
      </Layout>
    </>
  );
};

export default Home

///////////////////////////////////////////////////////////////////////////////////////////////////
// 【学習】
// 
// 1.全体の流れ
//    ユーザー → Home → HookForm → PHP(insert.php) → DB → 結果表示
// 
// 2.Home：初期段階
//    Home コンポーネントで全フォームデータの状態管理を準備
//    handleFormSubmit関数を定義（後でHookFormから呼び出される）
//    この関数をpropsとしてHookFormに渡す
// 
// 3.HookForm：フォーム表示
//    HomeからonSubmit（実際はhandleFormSubmit）をpropsで受け取り
//    React Hook Formの機能を使ってフォーム管理を初期化
//    ユーザーがフォームに入力できる状態を作成
// 4.HookForm：ユーザーによるフォーム入力
//    ユーザーが学校名、志望度などを入力
//    React Hook Formのregisterが各入力値を自動管理
//    バリデーション設定（必須チェックなど）も同時に適用
// 5.HookForm：ユーザーによるフォーム送信
//    ユーザーが「志望校登録」ボタンをクリック
//    React Hook FormのhandleSubmitがバリデーションを実行
//    バリデーションOKならhandleFormSubmit（HookForm内の独自関数：Home側の関数名とだぶって命名してしまった...）が発火
// 6.HookForm：データ準備・送信
//    フォームの入力データをFormData形式に変換
//    fetchを使ってPHPのinsert.phpにPOSTリクエスト送信
//    ブラウザ → PHPサーバーへHTTP通信が発生
// 
// 7.insert.php：PHP処理
//    ReactからのHTTPリクエストを受信
//    $_POSTからフォームデータを取得
//    SQLのINSERT文でデータベースに登録
//    成功/失敗の結果をReactに返答
// 
// 8.HookForm：PHPからの応答処理
//    PHPからの応答（"SUCCESS"など）を確認
//    成功ならonSubmit(data)でHomeから受け取ったhandleFormSubmitを呼び出し
//    Homeの状態を更新し、フォームをリセット
// 
// 9.Home：最終処理
//    HookFormから受け取ったデータでHome状態を更新
//    これで親コンポーネント(Home)も最新データを把握
///////////////////////////////////////////////////////////////////////////////////////////////////

