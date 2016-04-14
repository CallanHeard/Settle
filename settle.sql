-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2016 at 01:11 AM
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
(1, 3, '5.00', 0),
(2, 2, '20.00', 0),
(2, 4, '7.99', 0),
(3, 4, '7.99', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE IF NOT EXISTS `payment` (
`id` int(11) NOT NULL COMMENT 'Payment ID number',
  `name` varchar(100) NOT NULL COMMENT 'Payment name',
  `description` text NOT NULL COMMENT 'Payment description',
  `total` decimal(10,2) NOT NULL COMMENT 'Payment total amount',
  `type` int(11) NOT NULL COMMENT 'Payment type',
  `host_user` int(11) NOT NULL COMMENT 'User ID of the payment host',
  `contributors` int(11) NOT NULL COMMENT 'Number of payment contributors'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `name`, `description`, `total`, `type`, `host_user`, `contributors`) VALUES
(2, 'Dinner 31/03/16', 'Meal out together from the other night', '20.00', 1, 1, 1),
(3, 'Ice-cream', 'From the day at the beach last week', '5.00', 1, 2, 1),
(4, 'Cinema', 'Paid for cinema tickets on Wednesday', '15.98', 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`id` int(11) NOT NULL COMMENT 'User ID number',
  `email` varchar(100) NOT NULL COMMENT 'User email address',
  `first_name` varchar(50) NOT NULL COMMENT 'User first name',
  `last_name` varchar(50) NOT NULL COMMENT 'User last name',
  `password` varchar(100) NOT NULL COMMENT 'User password'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `first_name`, `last_name`, `password`) VALUES
(1, 'callanheard@hotmail.co.uk', 'Callan', 'Heard', 'hello123'),
(2, 'pops95@hotmail.co.uk', 'Poppy', 'Willard', 'hello123'),
(3, 'bethheard15@googlemail.com', 'Bethan', 'Heard', 'hello123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contributes`
--
ALTER TABLE `contributes`
 ADD PRIMARY KEY (`user_id`,`payment_id`), ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
 ADD PRIMARY KEY (`id`), ADD KEY `HOSTUSER` (`host_user`) COMMENT 'Host user ID of the payment, from the user table';

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Payment ID number',AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID number',AUTO_INCREMENT=4;
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
-- Constraints for table `payment`
--
ALTER TABLE `payment`
ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`host_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
