import React from "react";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>どうする中学受験</h1>
      <div className={styles.headerMenu}>
        <ul className={styles.menuContainer}>
          <li>
            <Link to="/">志望校登録</Link>
          </li>
          <li>
            {/* URLパラメータ付きで/listに遷移 */}
            <Link to="/list?sort=interest">志望校一覧（志望度順）</Link>
          </li>
          <li>
            <Link to="/list?sort=examDate">志望校一覧（受験日時順）</Link>
          </li>
          <li>
            <Link to="/list?sort=entrance">志望校一覧（入学金締切日時順）</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;