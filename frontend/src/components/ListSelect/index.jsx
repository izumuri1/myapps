import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./style.module.scss";
import { API_URLS, getApiUrl } from '../../config/config'; // 設定ファイルをインポート

const ListSelect = ({ sortType }) => {
    const navigate = useNavigate();
    
    // 志望校データを管理
    const [schools, setSchools] = useState([]);
    // データ取得中かどうかを管理
    // 初期状態は「ローディング中」
    const [loading, setLoading] = useState(true);
    // データ取得時のエラーを管理
    // 初期状態は「エラーなし」
    const [error, setError] = useState(null);

    // fetchを使ってPHPからデータを取得する関数
    const fetchSchools = async () => {
        try {
            setLoading(true);
            setError(null);

            // sortTypeをPHPに送信
            // 設定ファイルからSELECT用のURLを取得し、クエリパラメータを追加
            const response = await fetch(`${API_URLS.SELECT}?sort=${sortType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // HTTPステータスが200番台以外ならエラー扱い
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // PHPからデータを取得する際に付加されるsuccessで通信の成否を確認
            if (result.success) {
                setSchools(result.data);
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

    // 詳細表示ボタンクリック時の処理
    const handleDetailClick = (schoolId) => {
        // pages/detail/index.jsxに遷移（学校IDをパラメータで渡す）
        navigate(`/detail/${schoolId}`);
    };

    // 削除ボタンクリック時の処理（GETリクエスト）
    const handleDeleteClick = async (schoolId, schoolName) => {
        // 削除確認ダイアログ
        const isConfirmed = window.confirm(`「${schoolName}」を削除してもよろしいですか？`);
        
        if (!isConfirmed) return;

        try {
            // delete.phpにGETリクエストで削除送信（IDをクエリパラメータで送信）
            // 設定ファイルからDELETE用のURLを取得
            const response = await fetch(`${API_URLS.DELETE}?id=${schoolId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('削除が完了しました');
                // 削除成功時は画面を再読み込み
                fetchSchools();
            } else {
                alert('削除に失敗しました: ' + (result.message || '不明なエラー'));
            }
        } catch (error) {
            console.error('削除エラー:', error);
            alert('削除処理でエラーが発生しました');
        }
    };

    // fetchSchoolsの起動を制御
    // コンポーネント初回表示時に実行
    // 更にsortTypeが変更されたらデータ再取得
    useEffect(() => {
        fetchSchools();
    }, [sortType]);

    // ソート名の表示用
    const getSortDisplayName = (sort) => {
        switch(sort) {
            case 'interest': return '志望度順';
            case 'examDate': return '受験日時順';
            case 'entrance': return '入学金締切日時順';
            default: return '志望度順';
        }
    };

    // 日時のフォーマット関数（年を除外）
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString || dateTimeString === '') return '';
        const date = new Date(dateTimeString);
        // Invalid Dateの場合は空文字を返す
        if (isNaN(date.getTime())) return '';
        
        // 月日と時間のみを表示（年は除外）
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${month}/${day} ${hours}:${minutes}`;
    };

    // 数値のフォーマット関数
    const formatNumber = (num) => {
        if (!num || num === 0) return '';
        return num.toLocaleString();
    };

    // デバッグ用：データ確認
    useEffect(() => {
        if (schools.length > 0) {
            console.log('取得したデータ:', schools);
            console.log('最初の学校の志望度:', schools[0].interest);
            console.log('志望度の型:', typeof schools[0].interest);
        }
    }, [schools]);

    if (loading) {
        return <div className={styles.loading}>データを読み込み中...</div>;
    }

    if (error) {
        return <div className={styles.error}>エラー: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2>志望校一覧（{getSortDisplayName(sortType)}）</h2>
            
            {schools.length === 0 ? (
                <p className={styles.noData}>登録された志望校がありません。</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.schoolTable}>
                        <thead>
                            <tr>
                                <th className={styles.schoolName}>学校名</th>
                                <th className={styles.interest}>志望度</th>
                                <th className={styles.examStartTime}>受験開始日時</th>
                                <th className={styles.hensa}>偏差値</th>
                                <th className={styles.station}>最寄駅</th>
                                <th className={styles.walk}>徒歩</th>
                                <th className={styles.favorite}>お気に入り</th>
                                <th className={styles.application}>願書締切</th>
                                <th className={styles.applicationFee}>受験料</th>
                                <th className={styles.entrance}>入学金締切</th>
                                <th className={styles.entranceFee}>入学金</th>
                                <th className={styles.actions}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.map((school) => (
                                <tr key={school.id} className={styles.schoolRow}>
                                    <td className={`${styles.schoolName} ${styles.bold}`}>
                                        {school.schoolName}
                                    </td>
                                    <td className={`${styles.interest} ${styles.bold} ${styles.center}`}>
                                        {school.interest || ''}
                                    </td>
                                    <td className={`${styles.examStartTime} ${styles.bold}`}>
                                        {formatDateTime(school.examStartTime)}
                                    </td>
                                    <td className={`${styles.hensa} ${styles.bold} ${styles.center}`}>
                                        {school.hensa > 0 ? school.hensa : ''}
                                    </td>
                                    <td className={`${styles.station} ${styles.bold}`}>
                                        {school.station || ''}
                                    </td>
                                    <td className={`${styles.walk} ${styles.bold} ${styles.center}`}>
                                        {school.walk > 0 ? `${school.walk}分` : ''}
                                    </td>
                                    <td className={`${styles.favorite} ${styles.bold}`}>
                                        {school.favorite || ''}
                                    </td>
                                    <td className={styles.application}>
                                        {formatDateTime(school.application)}
                                    </td>
                                    <td className={`${styles.applicationFee} ${styles.bold} ${styles.right}`}>
                                        {school.applicationFee > 0 ? `${formatNumber(school.applicationFee)}円` : ''}
                                    </td>
                                    <td className={`${styles.entrance} ${styles.bold}`}>
                                        {formatDateTime(school.entrance)}
                                    </td>
                                    <td className={`${styles.entranceFee} ${styles.right}`}>
                                        {school.entranceFee > 0 ? `${formatNumber(school.entranceFee)}円` : ''}
                                    </td>
                                    <td className={styles.actions}>
                                        <div className={styles.actionButtons}>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.detailBtn}`}
                                                onClick={() => handleDetailClick(school.id)}
                                                title="詳細表示"
                                            >
                                                詳細
                                            </button>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDeleteClick(school.id, school.schoolName)}
                                                title="削除"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListSelect