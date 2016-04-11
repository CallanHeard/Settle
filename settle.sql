-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2016 at 02:36 PM
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
CREATE DATABASE IF NOT EXISTS `settle` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `settle`;

-- --------------------------------------------------------

--
-- Table structure for table `contributes`
--

DROP TABLE IF EXISTS `contributes`;
CREATE TABLE IF NOT EXISTS `contributes` (
  `user_id` int(11) NOT NULL COMMENT 'User ID number',
  `payment_id` int(11) NOT NULL COMMENT 'Payment ID number',
  `amount` decimal(10,2) NOT NULL COMMENT 'Amount owed',
  `settled` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Flag for payment made'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
`id` int(11) NOT NULL COMMENT 'Payment ID number',
  `name` varchar(100) NOT NULL COMMENT 'Payment name',
  `description` text NOT NULL COMMENT 'Payment description',
  `amount` decimal(10,2) NOT NULL COMMENT 'Payment amount',
  `type` int(11) NOT NULL COMMENT 'Payment type',
  `host_user` int(11) NOT NULL COMMENT 'User ID of the payment host'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
`id` int(11) NOT NULL COMMENT 'User ID number',
  `email` varchar(100) NOT NULL COMMENT 'User email address',
  `first_name` varchar(50) NOT NULL COMMENT 'User first name',
  `last_name` varchar(50) NOT NULL COMMENT 'User last name',
  `password` varchar(100) NOT NULL COMMENT 'User password'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
 ADD PRIMARY KEY (`id`);

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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Payment ID number';
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID number';
--
-- Constraints for dumped tables
--

--
-- Constraints for table `contributes`
--
ALTER TABLE `contributes`
ADD CONSTRAINT `contributes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `contributes_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
