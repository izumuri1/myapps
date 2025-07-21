import React, { useState } from 'react'
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import LoginForm from '../../components/LoginForm';

const SideBar = () => {
  // ログイン状態の管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // registerに初期値をセット
  const [register, setRegister] = useState({
    id: "",
    password: "",
  })

  // registerを更新する関数を定義
  const handleFormSubmit = (data) => {
    setRegister({
      id: data.id,
      password: data.password,
    });

    // ログイン成功時の処理
    if (data.loginSuccess) {
      setIsLoggedIn(true);
      setUserInfo(data.userInfo);
    }
  }

  // ログアウト処理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setRegister({
      id: "",
      password: "",
    });
    alert('ログアウトしました');
  }

  return (
    <>
      <div className="">
        {!isLoggedIn ? (
          // ログインしていない場合：ログインフォームを表示
          <LoginForm onSubmit={handleFormSubmit} />
        ) : (
          // ログインしている場合：ユーザー情報を表示
          <div className={styles.userInfo}>
            <h3>ログイン中</h3>
            <p>ユーザーID: {userInfo?.id}</p>
            <p>権限: {userInfo?.type === 'admin' ? '管理者' : '一般ユーザー'}</p>
            <button 
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default SideBar