-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: mysql3108.db.sakura.ne.jp
-- 生成日時: 2025 年 7 月 12 日 21:57
-- サーバのバージョン： 8.0.40
-- PHP のバージョン: 8.2.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `izumuri_kadai`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `targetschool_table`
--

CREATE TABLE `targetschool_table` (
  `id` int NOT NULL,
  `examStartTime` datetime DEFAULT NULL,
  `examEndTime` datetime DEFAULT NULL,
  `schoolName` varchar(24) COLLATE utf8mb4_general_ci NOT NULL COMMENT '学校名',
  `subject` varchar(12) COLLATE utf8mb4_general_ci NOT NULL COMMENT '教科',
  `hensa` int NOT NULL COMMENT '偏差値',
  `station` varchar(12) COLLATE utf8mb4_general_ci NOT NULL COMMENT '最寄駅',
  `walk` int NOT NULL COMMENT '最寄駅から徒歩〇分',
  `interest` int NOT NULL COMMENT '志望度：低(1)～高(5)',
  `favorite` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'お気に入りポイント',
  `application` datetime DEFAULT NULL,
  `applicationFee` int NOT NULL COMMENT '受験料',
  `entrance` datetime DEFAULT NULL,
  `entranceFee` int NOT NULL COMMENT '入学金'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `targetschool_table`
--

INSERT INTO `targetschool_table` (`id`, `examStartTime`, `examEndTime`, `schoolName`, `subject`, `hensa`, `station`, `walk`, `interest`, `favorite`, `application`, `applicationFee`, `entrance`, `entranceFee`) VALUES
(12, '2025-07-12 21:21:00', '2025-07-12 23:21:00', 'A学校', 'all', 50, '五反田', 15, 3, '通学時間が短い', '2025-07-01 21:22:00', 9000, '2025-07-19 21:22:00', 100),
(13, '2025-07-12 09:32:00', '2025-07-12 12:32:00', 'B学校', 'all', 50, '恵比寿', 10, 3, '駅近', '2025-07-01 21:33:00', 7000, '2025-07-18 21:33:00', 80000);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `targetschool_table`
--
ALTER TABLE `targetschool_table`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `targetschool_table`
--
ALTER TABLE `targetschool_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
