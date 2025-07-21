import styles from './style.module.scss'
import Header from '../../layout/Header';
import { Link } from 'react-router-dom';
import Layout from '../../layout/Layout';


const NotFound404 = () => {
  return (
    <>
      <Layout>
        <Link to="/">ホームへ戻る</Link>
      </Layout>
    </>
  );
}

export default NotFound404;