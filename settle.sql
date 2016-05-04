-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2016 at 03:58 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `settle`
--

-- --------------------------------------------------------

--
-- Table structure for table `contributes`
--

CREATE TABLE IF NOT EXISTS `contributes` (
  `user_id` int(11) NOT NULL COMMENT 'User ID number',
  `payment_id` int(11) NOT NULL COMMENT 'Payment ID number',
  `amount` decimal(10,2) NOT NULL COMMENT 'Amount owed',
  `settled` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Flag for payment made'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contributes`
--

INSERT INTO `contributes` (`user_id`, `payment_id`, `amount`, `settled`) VALUES
(1, 20, '25.49', 1),
(1, 29, '15.00', 0),
(1, 30, '6.66', 0),
(1, 32, '20.00', 0),
(2, 21, '11.66', 1),
(2, 25, '2.00', 0),
(3, 30, '6.66', 0),
(4, 24, '20.00', 1),
(4, 28, '5.00', 0),
(4, 31, '12.50', 0),
(5, 19, '7.95', 1),
(5, 20, '25.49', 0),
(5, 26, '30.00', 0),
(6, 20, '25.49', 1),
(6, 24, '20.00', 0),
(6, 27, '15.00', 0),
(6, 28, '5.00', 0),
(8, 21, '11.66', 0),
(8, 24, '20.00', 0),
(8, 33, '10.00', 0),
(9, 20, '25.49', 0),
(9, 22, '20.00', 0),
(10, 24, '20.00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE IF NOT EXISTS `notification` (
`id` int(11) NOT NULL COMMENT 'Notification ID',
  `sender_id` int(11) NOT NULL COMMENT 'User ID of the sender',
  `recipient_id` int(11) NOT NULL COMMENT 'User ID of the recipient',
  `payment_id` int(11) NOT NULL COMMENT 'Notification payment ID',
  `type` int(11) NOT NULL COMMENT 'Notification type: 1 = ''added to payment'', 2 = ''payment made''',
  `confirmed` tinyint(1) NOT NULL COMMENT 'Confirmed state of the notification'
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `sender_id`, `recipient_id`, `payment_id`, `type`, `confirmed`) VALUES
(6, 4, 5, 19, 1, 1),
(7, 10, 6, 20, 1, 1),
(8, 10, 5, 20, 1, 1),
(9, 10, 1, 20, 1, 1),
(10, 10, 9, 20, 1, 1),
(11, 1, 8, 21, 1, 1),
(12, 1, 2, 21, 1, 1),
(13, 7, 9, 22, 1, 1),
(22, 9, 10, 24, 1, 1),
(23, 9, 8, 24, 1, 1),
(24, 9, 6, 24, 1, 1),
(25, 9, 4, 24, 1, 1),
(26, 3, 2, 25, 1, 1),
(27, 3, 5, 26, 1, 1),
(28, 5, 6, 27, 1, 1),
(29, 5, 6, 28, 1, 1),
(30, 5, 4, 28, 1, 1),
(31, 6, 1, 29, 1, 1),
(32, 2, 1, 30, 1, 1),
(33, 2, 3, 30, 1, 1),
(34, 6, 4, 31, 1, 1),
(35, 4, 1, 32, 1, 1),
(36, 1, 8, 33, 1, 1),
(37, 1, 10, 20, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE IF NOT EXISTS `payment` (
`id` int(11) NOT NULL COMMENT 'Payment ID number',
  `name` varchar(100) NOT NULL COMMENT 'Payment name',
  `description` text COMMENT 'Payment description',
  `total` decimal(10,2) NOT NULL COMMENT 'Payment total amount',
  `host_user` int(11) NOT NULL COMMENT 'User ID of the payment host',
  `contributors` int(11) NOT NULL COMMENT 'Number of payment contributors',
  `date` varchar(20) DEFAULT NULL COMMENT 'Payment creation date',
  `confirmed` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Payment members all confirmed'
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `name`, `description`, `total`, `host_user`, `contributors`, `date`, `confirmed`) VALUES
(19, 'Cinema Tickets', 'From BvS last week', '0.00', 4, 0, '1461778351', 1),
(20, 'Dinner', 'From 14/04/16', '50.98', 10, 2, '1461778713', 1),
(21, 'Drinks', 'Last Friday', '11.68', 1, 1, '1461778929', 1),
(22, 'Green Fees', 'From National Park Golf Course at the weekend (I won!)', '20.00', 7, 1, '1461779157', 1),
(24, 'Marg''s birthday present', 'The Olivia Burton watch', '40.00', 9, 2, '1461779872', 1),
(25, 'Football', 'Paid both our subs mate', '2.00', 3, 1, '1461780134', 1),
(26, 'Dinner at the weekend', 'You forced me to split it! (I''ll get the drinks though)', '30.00', 3, 1, '1461780244', 1),
(27, 'Leccy Bill', 'That time of the month again', '15.00', 5, 1, '1461780338', 1),
(28, 'Cinema', '(Jungle Book on Wednesday 27th)', '10.00', 5, 2, '1461780488', 1),
(29, 'Drinks last weekend', '"Forgot your card", again >:(', '15.00', 6, 1, '1461780652', 1),
(30, 'Internet Bill', '(for April)', '13.34', 2, 2, '1461780877', 1),
(31, 'Pizza', 'Mmm.. Pizza', '12.50', 6, 1, '1461781047', 1),
(32, 'Â£20', 'You just do', '20.00', 4, 1, '1461781111', 1),
(33, 'From the game last night', 'A bet''s a bet my friend!', '10.00', 1, 1, '1461781273', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`id` int(11) NOT NULL COMMENT 'User ID number',
  `email` varchar(100) NOT NULL COMMENT 'User email address',
  `first_name` varchar(50) NOT NULL COMMENT 'User first name',
  `last_name` varchar(50) NOT NULL COMMENT 'User last name',
  `password` varchar(100) NOT NULL COMMENT 'User password',
  `pin` varchar(5) NOT NULL COMMENT 'User PIN',
  `score` int(11) NOT NULL DEFAULT '0' COMMENT 'Total user score',
  `percentage` float NOT NULL DEFAULT '100' COMMENT 'Percentage user score'
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `first_name`, `last_name`, `password`, `pin`, `score`, `percentage`) VALUES
(1, 'fperez0@chicagotribune.com', 'Frances', 'Perez', 'etEQsrQP', 'f38zu', 2, 5),
(2, 'jhall1@un.org', 'Johnny', 'Hall', '1weqvWkKeFG', 'e5cw1', 10, 100),
(3, 'thughes2@un.org', 'Timothy', 'Hughes', 'BupB8hV', 'b4uhc', 0, 100),
(4, 'tdaniels3@tumblr.com', 'Teresa', 'Daniels', 'L1kUWNaiFB', '5xq7u', 10, 100),
(5, 'mjohnson4@state.tx.us', 'Margaret', 'Johnson', 'iUzHhR', 'smyd7', 10, 100),
(6, 'bnguyen5@nydailynews.com', 'Bonnie', 'Nguyen', '5fo8NznZzJqf', '56wgt', 10, 100),
(7, 'rmontgomery6@freewebs.com', 'Roy', 'Montgomery', 'z4sqYdd', '9dnbg', 0, 100),
(8, 'smatthews7@instagram.com', 'Steven', 'Matthews', '9fCRXv4uAtK', 'b4xh8', 0, 100),
(9, 'rwatkins8@umn.edu', 'Ronald', 'Watkins', 'ZEohSe', '6xuhy', 0, 100),
(10, 'jwatson9@artisteer.com', 'Jeffrey', 'Watson', 'Gg0kKtn', 'x7ytr', 10, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contributes`
--
ALTER TABLE `contributes`
 ADD PRIMARY KEY (`user_id`,`payment_id`), ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
 ADD PRIMARY KEY (`id`), ADD KEY `REC_USER` (`recipient_id`) COMMENT 'User ID from User table', ADD KEY `SEN_USER` (`sender_id`) COMMENT 'User ID from User table', ADD KEY `PAYMENT` (`payment_id`) COMMENT 'Payment ID from Payment table';

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
 ADD PRIMARY KEY (`id`), ADD KEY `HOSTUSER` (`host_user`) COMMENT 'Host user ID of the payment, from the user table';

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`), ADD UNIQUE KEY `PIN UNIQUE` (`pin`) COMMENT 'PINs are unique';

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Notification ID',AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Payment ID number',AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID number',AUTO_INCREMENT=11;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `contributes`
--
ALTER TABLE `contributes`
ADD CONSTRAINT `contributes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `contributes_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `notification_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`host_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
