import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./style.module.scss";
import Layout from "../../layout/Layout";
import Update from "../../components/Update";
import { API_URLS } from '../../config/config'; // 設定ファイルをインポート

const Detail = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  
  // registerに初期値をセット
  const [register, setRegister] = useState({
    examStartTime: "",
    examEndTime: "",
    schoolName: "",
    subject: "",
    hensa: "",
    station: "",
    walk: "",
    interest: "",
    favorite: "",
    application: "",
    applicationFee: "",
    entrance: "",
    entranceFee: ""
  });

  // 学校データを保存するstate
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // registerを更新する関数を定義
  const handleFormSubmit = (data) => {
    setRegister({
      examStartTime: data.examStartTime,
      examEndTime: data.examEndTime,
      schoolName: data.schoolName,
      subject: data.subject,
      hensa: data.hensa,
      station: data.station,
      walk: data.walk,
      interest: data.interest,
      favorite: data.favorite,
      application: data.application,
      applicationFee: data.applicationFee,
      entrance: data.entrance,
      entranceFee: data.entranceFee
    });
  };

  // 学校データを取得する関数
  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 設定ファイルからDETAIL用のURLを取得
      const response = await fetch(`${API_URLS.DETAIL}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSchoolData(result.data);
      } else {
        setError(result.message || 'データ取得に失敗しました');
      }
    } catch (error) {
      console.error('取得エラー:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // コンポーネント初回表示時にデータ取得
  useEffect(() => {
    if (id) {
      fetchSchoolData();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="detail">
          <div>データを読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="detail">
          <div>エラー: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="detail">
          {/* onSubmit（props）として子（Update）へ関数を渡す */}
          {/* schoolDataも子に渡して初期値として使用 */}
          <Update onSubmit={handleFormSubmit} schoolData={schoolData} />
        </div>
      </Layout>
    </>
  );
};

export default Detail;