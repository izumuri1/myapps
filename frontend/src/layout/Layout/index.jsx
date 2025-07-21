import React from "react";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import Header from "../Header";
import SideBar from "../SideBar";

const Layout = ({children}) => {
  return (
    <>
      <div className={styles.homeHeader}>
        <Header />
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.leftMain}>
          <SideBar />
        </div>
        <div className={styles.rightMain}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;