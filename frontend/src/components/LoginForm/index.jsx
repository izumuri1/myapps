import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import styles from "./style.module.scss";
import { API_URLS } from '../../config/config.js';

const LoginForm = ({ onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    // fetchを使ってPHPに送信する関数
    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('id', data.id || '');
            formData.append('password', data.password || '');
            
            // 設定ファイルからLOGIN用のURLを取得
            const response = await fetch(API_URLS.LOGIN, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                if (result.success) {
                    // ログイン成功
                    onSubmit({
                        ...data,
                        loginSuccess: true,
                        userInfo: result.user
                    });
                    reset();
                    alert(`ログインに成功しました！\nユーザータイプ: ${result.user.type === 'admin' ? '管理者' : '一般ユーザー'}`);
                } else {
                    // ログイン失敗
                    alert(result.message || 'ログインに失敗しました');
                }
            } else {
                alert(`ログインに失敗しました。ステータス: ${response.status}`);
            }
        } catch (error) {
            console.error('ログインエラー:', error);
            alert('ログイン処理でエラーが発生しました。ネットワーク接続を確認してください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                {/* fetchでの通信に変更（action属性を削除） */}
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <h2>ログインしてください</h2><br />
                    <div className={styles.formRow}>
                        <div className={styles.inputRow}>
                            <label htmlFor="id">ID</label>
                            <input 
                                type="text"
                                name="id" 
                                id="id" 
                                disabled={isLoading}
                                {...register("id", { required: "IDは必須です" })}
                            />
                        </div>
                        {errors.id && <p className={styles.errorMessage}>{errors.id ? errors.id.message : "\u00A0"}</p>}
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.inputRow}>
                            <label htmlFor="password">パスワード</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                disabled={isLoading}
                                {...register("password", { required: "パスワードは必須です" })}
                            />
                        </div>
                        {errors.password && <p className={styles.errorMessage}>{errors.password ? errors.password.message : "\u00A0"}</p>}
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor=""></label>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginForm