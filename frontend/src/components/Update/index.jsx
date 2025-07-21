import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import styles from "./style.module.scss";
import { API_URLS } from '../../config/config.js'; // 設定ファイルをインポート

const Update = ({ onSubmit, schoolData }) => {
    const { id } = useParams(); // URLパラメータからIDを取得
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm()

    // schoolDataが変更されたときにフォームの初期値を設定
    useEffect(() => {
        if (schoolData) {
            // 日時データの形式変換（datetime-local用）
            const formatDateTimeForInput = (dateTime) => {
                if (!dateTime) return '';
                const date = new Date(dateTime);
                if (isNaN(date.getTime())) return '';
                
                // ISO形式から'YYYY-MM-DDTHH:MM'形式に変換
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            // フォームに既存データを設定
            setValue('examStartTime', formatDateTimeForInput(schoolData.examStartTime));
            setValue('examEndTime', formatDateTimeForInput(schoolData.examEndTime));
            setValue('schoolName', schoolData.schoolName || '');
            setValue('subject', schoolData.subject || '');
            setValue('hensa', schoolData.hensa || '');
            setValue('station', schoolData.station || '');
            setValue('walk', schoolData.walk || '');
            setValue('interest', schoolData.interest || '');
            setValue('favorite', schoolData.favorite || '');
            setValue('application', formatDateTimeForInput(schoolData.application));
            setValue('applicationFee', schoolData.applicationFee || '');
            setValue('entrance', formatDateTimeForInput(schoolData.entrance));
            setValue('entranceFee', schoolData.entranceFee || '');
        }
    }, [schoolData, setValue]);

    // fetchを使ってPHPに送信する関数
    const handleFormSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // IDを追加（更新に必要）
            formData.append('id', id);
            formData.append('examStartTime', data.examStartTime || '');
            formData.append('examEndTime', data.examEndTime || '');
            formData.append('schoolName', data.schoolName || '');
            formData.append('subject', data.subject || '');
            formData.append('hensa', data.hensa || '');
            formData.append('station', data.station || '');
            formData.append('walk', data.walk || '');
            formData.append('interest', data.interest || '');
            formData.append('favorite', data.favorite || '');
            formData.append('application', data.application || '');
            formData.append('applicationFee', data.applicationFee || '');
            formData.append('entrance', data.entrance || '');
            formData.append('entranceFee', data.entranceFee || '');
            
            // 設定ファイルからUPDATE用のURLを取得
            const response = await fetch(API_URLS.UPDATE, {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            if (response.ok) {
                if (result.includes('SUCCESS')) {
                    onSubmit(data); // 親コンポーネントにデータを渡す
                    alert('志望校情報が更新されました！');
                } else {
                    alert('志望校情報の更新に失敗しました。再度お試しください。');
                }
            } else {
                alert(`送信に失敗しました。ステータス: ${response.status}`);
            }
        } catch (error) {
            alert('送信エラーが発生しました。ネットワーク接続を確認してください。');
        }
    };

    return (
        <>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <legend></legend>
                    <h2>志望校の情報を更新してください</h2><br />
                    <h3>1.受験日時</h3>
                    <div className={styles.formRow}>
                        <label htmlFor="examStartTime">受験開始日時</label>
                        <input 
                            type="datetime-local" 
                            name="examStartTime" 
                            id="examStartTime" 
                            {...register("examStartTime")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="examEndTime">受験終了日時</label>
                        <input 
                            type="datetime-local" 
                            name="examEndTime" 
                            id="examEndTime" 
                            {...register("examEndTime")}
                        />
                    </div>

                    <h3>2.学校情報</h3>
                    <div className={styles.formRow}>
                        <label htmlFor="schoolName">学校名</label>
                        <input 
                            type="text" 
                            name="schoolName" 
                            id="schoolName" 
                            {...register("schoolName",{ required: "学校名は必須です"})}
                        />
                        {errors.schoolName && <span className={styles.errorMessage}>{errors.schoolName.message}</span>}
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="subject">教科</label>
                        <select name="subject" id="subject" defaultValue="" {...register("subject")}>
                            <option value="" disabled>選択してください</option>
                            <option value="all">4教科</option>
                            <option value="sankoku">算数・国語</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="hensa">偏差値</label>
                        <input 
                            type="number" 
                            name="hensa" 
                            id="hensa" 
                            {...register("hensa")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="station">最寄駅</label>
                        <input 
                            type="text" 
                            name="station" 
                            id="station" 
                            {...register("station")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="walk">最寄駅から徒歩分数</label>
                        <input 
                            type="number" 
                            name="walk" 
                            id="walk" 
                            {...register("walk")}
                        />
                    </div>

                    <h3>3.子供の気持ち</h3>
                    <div className={styles.formRow}>
                        <label htmlFor="interest">志望度：低(1)～高(5)</label>
                        <select name="interest" id="interest" defaultValue="" {...register("interest",{ required: "志望度は必須です"})}>
                            <option value="" disabled>選択してください</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        {errors.interest && <span className={styles.errorMessage}>{errors.interest.message}</span>}
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="favorite">お気に入りポイント</label>
                        <input 
                            type="text" 
                            name="favorite" 
                            id="favorite" 
                            {...register("favorite")}
                        />
                    </div>

                    <h3>4.親の頑張り</h3>
                    <div className={styles.formRow}>
                        <label htmlFor="application">願書締切日時</label>
                        <input 
                            type="datetime-local" 
                            name="application" 
                            id="application" 
                            {...register("application")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="applicationFee">受験料</label>
                        <input 
                            type="number" 
                            name="applicationFee" 
                            id="applicationFee" 
                            {...register("applicationFee")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="entrance">入学金締切日時</label>
                        <input 
                            type="datetime-local" 
                            name="entrance" 
                            id="entrance" 
                            {...register("entrance")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="entranceFee">入学金</label>
                        <input 
                            type="number" 
                            name="entranceFee" 
                            id="entranceFee" 
                            {...register("entranceFee")}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor=""></label>
                        <button type="submit">志望校情報更新</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Update