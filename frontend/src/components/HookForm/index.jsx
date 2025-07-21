import React from 'react'
import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { API_URLS } from '../../config/config'; // 設定ファイルをインポート

const HookForm = ({onSubmit}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    // fetchを使ってPHPに送信する関数
    const handleFormSubmit = async (data) => {
        try {
            // FormData()は、Webブラウザが提供する組込API
            // HTMLの <form> の内容を JavaScriptで扱いやすくする
            // 通常は、fetch() などと組み合わせて、フォームデータをサーバーに送信する場面で使う
            const formData = new FormData();
            
            // formDataオブジェクトに値を追加
            // 第一引数はフォームに送信されるフィールド名（サーバー側でこの名前で受け取る）
            // 第二引数 「data.xxx || ''」は、値があればそれを、無ければ空文字列をセット
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
            
            // fetch 関数を用いて、HTTPリクエストを実行
            // 設定ファイルからINSERT用のURLを取得
            const response = await fetch(API_URLS.INSERT, {
                // 第二引数でmethodプロパティとしてHTTPメソッドのPOSTを指定
                // POSTはサーバーへデータを送信するために使用
                method: 'POST',
                // 送信するデータ本体としてformData（FormDataオブジェクト）を設定
                // このオブジェクトは、自動的にmultipart/form-data形式でエンコードされ、ファイルや複数のキー値ペアを送るのに適する
                body: formData
            });

            const result = await response.text();

            // レスポンスのステータスコードが200台なら、response.okはtrue
            // 200番台なら以降の処理へ、エラー(例: 404, 500等)ならelseへ
            if (response.ok) {
                // サーバーからの返答テキストresultに"SUCCESS"が含まれているかを判定
                if (result.includes('SUCCESS')) {
                    onSubmit(data); // 親コンポーネントにデータを渡す
                    reset();        // フォームをリセット
                    alert('志望校が登録されました！');
                } else {
                    alert('志望校の登録に失敗しました。再度お試しください。');
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
                {/* <form> が送信される ➡ (React Hook Formの) handleSubmitでバリデーション */}
                {/* ➡ OKならjs側のhandleFormSubmit(data)発火 ➡ その処理が走る */}
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <legend></legend>
                    <h2>志望校を登録してください</h2><br />
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
                        <button type="submit">志望校登録</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default HookForm