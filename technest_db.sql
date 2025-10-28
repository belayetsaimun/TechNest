-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2025 at 09:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `technest_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `name`, `email`, `role`, `last_login`, `created_at`) VALUES
(1, 'admin', '$2y$10$lv2IKdHuj9x1iezbslD8UugBMxz2KlgRxencRJ//561Z1rEGxU03G', 'System Administrator', 'admin@technest.com', 'admin', '2025-07-04 11:00:16', '2025-06-25 14:53:38');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `sort_order`) VALUES
(1, 'general', 'What makes TechNest different from other tech retailers?', 'TechNest offers premium quality tech products at competitive prices with exceptional customer service. We provide 2-year warranty on all products, free shipping on orders over ৳5,000, and 24/7 technical support.', 0),
(2, 'general', 'Do you offer warranty on your products?', 'Yes, all our products come with at least a 1-year manufacturer\'s warranty. Many of our premium products include an extended 2-year TechNest warranty at no extra cost.', 0),
(3, 'shipping', 'What are your shipping options and costs?', 'We offer free standard shipping on all orders over ৳5,000. Standard shipping typically takes 3-5 business days. Express shipping is available for ৳500 and delivers within 1-2 business days.', 0),
(4, 'shipping', 'How can I track my order?', 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also log into your TechNest account and view your order status in the \"My Orders\" section.', 0),
(5, 'returns', 'What is your return policy?', 'We offer a 30-day return policy on most items. Products must be in their original condition with all packaging and accessories. Please see our Returns page for complete details.', 0),
(6, 'support', 'How can I get technical support?', 'Our technical support team is available 24/7 via phone, email, or live chat. You can also access our knowledge base and video tutorials on our support page for common issues and setup guides.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `received_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `is_read`, `received_at`) VALUES
(2, 'Belayet Hossain Saimun', 'belayetsaimun16@gmail.com', '01828440376', 'support', 'Hello, How are you?', 0, '2025-06-27 13:05:49');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'Processing',
  `order_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `name`, `email`, `phone`, `address`, `city`, `state`, `zipcode`, `total_amount`, `payment_method`, `status`, `order_notes`, `created_at`) VALUES
(1, 4, 'bhs', 'be@gmail.com', '01828440376', 'frctrxewaaxgcyc,', 'ftftff67f76', '', '22258', 165000.00, 'cod', 'Processing', '', '2025-06-19 14:49:21'),
(3, 4, 'bhs', 'be@gmail.com', '01828440376', 'frctrxewaaxgcyc,', 'ftftff67f76', '', '22258', 165000.00, 'cod', 'Processing', '', '2025-06-19 15:12:04'),
(4, 4, 'bhs', 'be@gmail.com', '01828440376', 'frctrxewaaxgcyc,', 'ftftff67f76', '', '22258', 165000.00, 'cod', 'Processing', '', '2025-06-19 15:12:57'),
(5, 4, 'bhs', 'be@gmail.com', '01828440376', 'none,', 'villa', '', '4565', 165000.00, 'cod', 'Processing', '', '2025-06-19 15:49:26'),
(6, 4, 'Belayet Saimun', 'be@gmail.com', '01828440376', 'none,', 'villa', '', '22258', 165000.00, 'cod', 'Processing', '', '2025-06-19 16:00:34'),
(7, 5, 'Belayet Saimun', 'belayetsaimun@gmail.com', '01828440376', 'none,', 'villa', '', '4565', 165000.00, 'cod', 'Processing', '', '2025-06-19 16:04:30'),
(8, 5, 'Belayet Saimun', 'belayetsaimun@gmail.com', '01828440376', 'none,', 'villa', '', '4565', 165000.00, 'cod', 'Processing', '', '2025-06-19 16:04:34'),
(9, 5, 'Belayet Saimun', 'belayetsaimun@gmail.com', '01828440376', 'none', 'villa', '', '22258', 199999.00, 'cod', 'Processing', NULL, '2025-06-19 16:09:54'),
(10, 5, 'Belayet Saimun', 'belayetsaimun@gmail.com', '01828440376', 'omconoicnoqwmcm', 'kj jasc', '', '2333', 427498.00, 'cod', 'Processing', NULL, '2025-06-19 18:58:45'),
(11, 4, 'bhs', 'be@gmail.com', '01828440376', 'biniuhiojoi', 'njnnnm', '', '77777', 189999.00, 'cod', 'Shipped', NULL, '2025-06-19 19:37:19'),
(12, 6, 'Karim', 'karim@gmail.com', '01828440376', 'KTM Hat,Charparbati,Companygonj', 'Noakhali', '', '3850', 179999.00, 'bkash', 'Processing', NULL, '2025-06-20 03:50:30'),
(13, 6, 'Karim', 'karim@gmail.com', '01382584237', '245 Cold Storage Rd', 'Craig', '', '99921', 189999.00, 'rocket', 'Processing', NULL, '2025-06-20 04:31:10'),
(14, 6, 'Karim', 'karim@gmail.com', '01828440376', 'KTM Hat,Charparbati,Companygonj', 'Noakhali', '', '3850', 18560.00, 'rocket', 'Processing', NULL, '2025-06-20 04:55:43'),
(15, 4, 'bhs', 'be@gmail.com', '01828440376', 'KTM Hat,Charparbati,Companygonj', 'Noakhali', '', '3850', 189999.00, 'rocket', 'Shipped', NULL, '2025-06-21 15:09:23'),
(16, 4, 'bhs', 'be@gmail.com', '01828440376', 'KTM Hat,Charparbati,Companygonj', 'Noakhali', '', '3850', 179999.00, 'rocket', 'Processing', NULL, '2025-07-03 16:24:41');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`) VALUES
(4, 4, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(5, 5, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(6, 6, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(7, 7, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(8, 8, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(9, 9, 22, 'ASUS ROG Zephyrus G16', 1, 165000.00),
(10, 9, 16, 'Nintendo Switch OLED', 1, 34999.00),
(11, 10, 25, 'Logitech MX Mechanical Keyboard', 2, 14500.00),
(12, 10, 1, 'iPhone 16 Pro Max', 2, 189999.00),
(13, 10, 3, 'AirPods Pro (3rd Gen)', 1, 18500.00),
(14, 11, 1, 'iPhone 16 Pro Max', 1, 189999.00),
(15, 12, 2, 'Samsung Galaxy S24 Ultra', 1, 179999.00),
(16, 13, 5, 'MacBook Pro 16-inch M3', 1, 189999.00),
(17, 14, 3, 'AirPods Pro (3rd Gen)', 1, 18500.00),
(18, 15, 1, 'iPhone 16 Pro Max', 1, 189999.00),
(19, 16, 2, 'Samsung Galaxy S24 Ultra', 1, 179999.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `features` varchar(255) DEFAULT NULL,
  `available_colors` varchar(255) DEFAULT 'white,black',
  `stock_quantity` int(11) DEFAULT 20,
  `rating` decimal(3,1) DEFAULT 4.5,
  `review_count` int(11) DEFAULT 0,
  `deal_type` varchar(50) DEFAULT NULL,
  `deal_expires` datetime DEFAULT NULL,
  `progress_claimed` int(3) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `old_price`, `category`, `brand`, `image_url`, `features`, `available_colors`, `stock_quantity`, `rating`, `review_count`, `deal_type`, `deal_expires`, `progress_claimed`, `is_featured`, `created_at`) VALUES
(1, 'iPhone 16 Pro Max', 'The iPhone 16 Pro Max offers cutting-edge technology with an exceptional display, advanced camera system, and lightning-fast performance.', 189999.00, 219999.00, 'phones', 'apple', 'iphone16W.png', 'Processor: A17 Pro Chip, RAM: 8GB, Storage: 256GB, Display: 6.7\" Super Retina XDR, Camera: 48MP Triple Camera, Battery: All-day battery life', 'white,black,blue', 50, 4.8, 1247, '', '2025-06-05 23:59:59', 75, 1, '2025-06-17 22:09:45'),
(2, 'Samsung Galaxy S24 Ultra', 'Experience the pinnacle of mobile technology with the Galaxy S24 Ultra, featuring a pro-grade camera and the powerful S Pen.', 179999.00, 189999.00, 'phones', 'samsung', 'samsung-galaxyW.png', 'Processor: Snapdragon 8 Gen 3, RAM: 12GB, Storage: 512GB, Display: 6.8\" Dynamic AMOLED, Camera: 200MP Quad Camera, Battery: 5000mAh', 'white,black', 40, 4.7, 956, NULL, NULL, NULL, 1, '2025-06-17 22:09:45'),
(3, 'AirPods Pro (3rd Gen)', 'Immerse yourself in rich, high-quality sound with Active Noise Cancellation and Spatial Audio.', 18500.00, 21499.00, 'earbuds', 'apple', 'airpods proW.png', 'Active ANC: Yes, Spatial Audio: Yes, Battery Life: 6 hours, Water Resistance: IPX4, Charging: Wireless, Connectivity: Bluetooth 5.3', 'white,black,blue', 80, 4.6, 823, 'weekly', '2025-06-15 23:59:59', 45, 1, '2025-06-17 22:09:45'),
(4, 'Sony WH-1000XM5 Headphones', 'Industry-leading noise canceling headphones with a new design and exceptional sound quality for a truly immersive listening experience.', 40800.00, 68000.00, 'headphones', 'sony', 'product_68676597c8f5a.png', 'Noise Cancellation: Industry-leading, Battery: 30 hours, Driver: 30mm, Charging: USB-C, Connectivity: Bluetooth 5.2, Weight: 250g', 'white', 35, 4.8, 1156, 'clearance', '2025-07-10 23:59:00', 85, 0, '2025-06-17 22:09:45'),
(5, 'MacBook Pro 16-inch M3', 'The most powerful MacBook Pro ever. Supercharged by the M3 Pro chip for pro-level workflows and all-day battery life.', 189999.00, 235000.00, 'laptops', 'apple', 'macprom3.png', 'Processor: M3 Pro Chip, RAM: 16GB, Storage: 512GB SSD, Display: 16.2\" Liquid Retina XDR, Battery: Up to 22 hours, Ports: Thunderbolt 4, HDMI, SD Card', 'white,black', 25, 4.9, 542, 'deal-of-the-day', '2025-06-20 23:59:59', 70, 1, '2025-06-17 22:09:45'),
(6, 'Dell XPS 13 Plus', 'A sleek, minimalist laptop with a stunning OLED display and powerful performance for creators on the go.', 195000.00, NULL, 'laptops', 'dell', 'dell-xpsW.png', 'Processor: Intel i7 12th Gen, RAM: 16GB, Storage: 512GB SSD, Display: 13.4\" 4K OLED, Graphics: Intel Iris Xe, Battery: Up to 12 hours', 'white', 30, 4.6, 387, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(8, 'Apple Watch Ultra 2', 'The most rugged and capable Apple Watch ever, designed for exploration, adventure, and endurance.', 28269.99, 43499.00, 'smartwatches', 'apple', 'appwatch.png', 'Display: Always-On Retina, GPS: Precision dual-frequency, Water Resistance: 100m, Battery: Up to 36 hours, Connectivity: Cellular + WiFi, Materials: Titanium case', 'white,black,blue', 60, 4.8, 445, '', '0000-00-00 00:00:00', 90, 1, '2025-06-17 22:09:45'),
(9, 'PlayStation 5', 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, and an all-new generation of incredible PlayStation games.', 65999.00, NULL, 'gaming', 'sony', 'ps5.png', 'Processor: AMD Zen 2, GPU: 10.28 TFLOPS RDNA 2, RAM: 16GB GDDR6, Storage: 825GB SSD, Resolution: 4K 120Hz, Audio: Tempest 3D AudioTech', 'white', 30, 4.9, 2156, NULL, NULL, NULL, 1, '2025-06-17 22:09:45'),
(10, 'Canon EOS R5', 'A professional full-frame mirrorless camera offering photographers and filmmakers high-resolution stills and 8K video.', 425000.00, 445000.00, 'cameras', 'canon', 'CanonB.png', 'Sensor: 45MP Full-frame CMOS, Video: 8K 30p Raw, Stabilization: 5-axis IBIS, ISO: 100-51,200, AF Points: 1,053, Weather Sealed: Yes', 'white,black', 15, 4.8, 234, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(11, 'Magic Keyboard for iPad', 'The Magic Keyboard is the perfect companion for iPad Pro and iPad Air. It features a great typing experience, a trackpad, and a floating cantilever design.', 35999.00, 38999.00, 'accessories', 'apple', 'keyboard.png', 'Compatibility: iPad Pro/iPad Air, Keys: Backlit, Trackpad: Multi-touch, Ports: USB-C, Connectivity: Smart Connector, Foldable: Yes', 'white,black', 50, 4.6, 187, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(12, 'Anker PowerCore 26800', 'The colossal-capacity portable charger with dual Micro USB input and PowerIQ technology for high-speed charging.', 8999.00, 11999.00, 'accessories', 'anker', 'powerbank.png', 'Capacity: 26,800mAh, Ports: 3x USB-A, Input: Dual Micro USB, Charging Tech: PowerIQ, Weight: 495g, Fast Charging: Yes', 'white,black', 100, 4.7, 1345, NULL, NULL, NULL, 1, '2025-06-17 22:09:45'),
(13, 'Samsung Galaxy Buds2 Pro', 'Studio-quality sound isn\'t just for the pros. Feel every note like you\'re there with Galaxy Buds2 Pro.', 18999.00, 21999.00, 'earbuds', 'samsung', 'samsung-budsW.png', 'ANC: Advanced, Hi-Fi: 24bit, Battery: 5 hours with ANC, Water Resistance: IPX7, Connectivity: Bluetooth 5.3, Wireless Charging: Yes', 'white,black', 70, 4.5, 567, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(14, 'LG UltraWide 34-inch Monitor', 'A 5K2K Nano IPS display for creative professionals, featuring Thunderbolt 3 connectivity and precise color.', 85999.00, 94999.00, 'accessories', 'lg', 'monitor.png', 'Resolution: 5120x2160, Panel: Nano IPS, Refresh Rate: 60Hz, HDR: HDR10, Ports: Thunderbolt 3, DisplayPort, HDMI, Color Accuracy: 98% DCI-P3', 'white,black', 25, 4.6, 298, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(15, 'Logitech MX Master 3S', 'An iconic mouse, remastered. With MagSpeed scrolling, 8K DPI tracking, and quiet clicks.', 12999.00, 15999.00, 'accessories', 'logitech', 'mouse.png', 'Sensor: 8K DPI, Buttons: 7, Connectivity: USB-C, Bluetooth, Battery: Up to 70 days, Scroll: MagSpeed, Multi-device: Yes', 'white,black', 90, 4.8, 1567, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(16, 'Nintendo Switch OLED', 'Feast your eyes on a 7-inch OLED screen that makes colors pop. Play at home on the TV or on the go with a vibrant handheld.', 34999.00, NULL, 'gaming', 'nintendo', 'nintendo-switchW.png', 'Display: 7\" OLED, Storage: 64GB, Battery: 4.5-9 hours, Resolution: 720p handheld, 1080p docked, Audio: Enhanced stereo, Connectivity: WiFi, Bluetooth', 'white,black', 55, 4.7, 1234, 'clearance', '2025-06-20 23:59:59', NULL, 0, '2025-06-17 22:09:45'),
(17, 'Samsung Galaxy Tab S9', 'The Galaxy Tab S9 sets a new standard for premium tablets with a Dynamic AMOLED 2X display and an included S Pen.', 74999.00, 79999.00, 'tablets', 'samsung', 'samsung-tabW.png', 'Processor: Snapdragon 8 Gen 2, RAM: 12GB, Storage: 256GB, Display: 11\" Dynamic AMOLED 2X, Battery: 8,400mAh, Included: S Pen', 'white,black', 40, 4.6, 445, NULL, NULL, NULL, 0, '2025-06-17 22:09:45'),
(18, 'Google Pixel 8 Pro', 'The most powerful, personal, and secure Pixel phone yet, with the advanced Google Tensor G3 chip.', 89999.00, 94999.00, 'phones', 'google', 'google-pixelW.png', 'Processor: Google Tensor G3, RAM: 12GB, Storage: 256GB, Display: 6.7\" OLED 120Hz, Camera: 50MP Triple, Battery: 5,000mAh, OS: Android 14', 'white,black', 35, 4.6, 678, 'flash-sale', '2025-06-25 23:59:59', NULL, 1, '2025-06-17 22:09:45'),
(19, 'MacBook Pro + AirPods Bundle', 'Get the powerful MacBook Pro and the immersive AirPods Pro together in this exclusive bundle offer.', 245000.00, 275000.00, 'laptops', 'apple', 'macair.webp', 'MacBook: M3 Chip, 13.3\" Retina Display, 8GB RAM, 256GB SSD, AirPods: 3rd Gen, Spatial Audio, 6-hour battery, MagSafe Charging Case', 'white,black', 20, 4.9, 89, 'bundle', '2025-06-25 23:59:59', 60, 0, '2025-06-17 22:09:45'),
(20, 'iPad 10.2-inch', 'The classic iPad with the A13 Bionic chip, a 10.2-inch Retina display, and support for Apple Pencil.', 33150.00, 39000.00, 'tablets', 'apple', 'ipad1.png', 'Processor: A13 Bionic, RAM: 3GB, Storage: 64GB, Display: 10.2\" Retina, Camera: 8MP, Battery: 10 hours, Compatibility: Apple Pencil (1st gen)', 'white,black', 60, 4.5, 89, 'weekly', '2025-07-01 23:59:00', 65, 0, '2025-06-17 22:09:45'),
(21, 'VR Headset Pro', 'Next-generation virtual reality with ultra-high resolution, haptic feedback, and wireless freedom for the ultimate immersive experience.', 85000.00, NULL, 'gaming', 'Oculus', 'VR.png', 'Resolution: 4K per eye, Refresh Rate: 120Hz, FOV: 110°, Tracking: 6DoF, Controllers: Haptic feedback, Connectivity: Wireless, Audio: Spatial 3D', 'white,black', 0, 4.8, 0, 'coming-soon', NULL, NULL, 0, '2025-06-17 22:09:45'),
(22, 'ASUS ROG Zephyrus G16', 'Unleash peak gaming performance with the ROG Zephyrus G16. Featuring a stunning Nebula Display and powered by the latest Intel Core i7 processor and NVIDIA RTX 4060 graphics.', 165000.00, 179999.00, 'laptops', 'asus', 'asus-laptop.png', 'Processor: Intel Core i7-13700H, GPU: RTX 4060, RAM: 16GB DDR5, Storage: 1TB NVMe SSD, Display: 16\" 240Hz Nebula, Battery: 90Wh, Weight: 1.95kg', 'black', 15, 4.9, 78, NULL, NULL, NULL, 0, '2025-06-18 11:05:16'),
(23, 'Google Nest Audio', 'Meet Nest Audio. Hear music the way it should sound, with crisp vocals and powerful bass that fill the room. Just say, \"Hey Google\" to play your favorite songs or ask for help.', 9500.00, 10999.00, 'accessories', 'google', 'google-nest.png', 'Speakers: 75mm woofer, 19mm tweeter, Connectivity: WiFi, Bluetooth, Assistant: Google Assistant, Multi-room: Yes, Mics: 3-mic array, Audio: 360° sound', 'white,black', 50, 4.7, 450, NULL, NULL, NULL, 0, '2025-06-18 11:05:16'),
(24, 'DJI Mini 4 Pro Drone', 'The ultimate mini camera drone for creators. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, and a 34-minute flight time to capture breathtaking aerial shots.', 85000.00, 92500.00, 'cameras', 'dji', 'dji-drone.png', 'Camera: 4K/60fps, Sensor: 1/1.3\" CMOS, Flight Time: 34 minutes, Range: 12km, Obstacle Sensing: Omnidirectional, Weight: 249g, Foldable: Yes', 'white', 25, 4.8, 112, NULL, NULL, NULL, 0, '2025-06-18 11:05:16'),
(25, 'Logitech MX Mechanical Keyboard', 'A full-size keyboard with an extraordinary feel, precision, and performance. Low-profile mechanical keys, smart illumination, and multi-device connectivity make it a masterpiece for coders and creators.', 14500.00, NULL, 'accessories', 'logitech', 'logitech-keyboard.png', 'Keys: Low-profile mechanical, Switches: Tactile Quiet, Backlight: Smart illumination, Battery: Up to 15 days, Connectivity: Bluetooth/USB, Multi-device: 3 devices', 'black', 40, 4.9, 215, NULL, NULL, NULL, 0, '2025-06-18 11:05:16'),
(26, 'SmartFit Pro Ultra', 'The most advanced SmartFit watch, featuring a durable titanium case, advanced health sensors, and an always-on display that is twice as bright.', 43900.00, 47500.00, 'smartwatches', 'apple', 'appwatch.png', 'Display: Always-On Retina, Case: Titanium, Water Resistance: 100m, Sensors: Advanced health sensors, Battery: 18 hours, Connectivity: Cellular, GPS, WiFi', 'white', 30, 4.6, 64, NULL, NULL, NULL, 0, '2025-06-18 11:20:11'),
(32, 'Apple AirPods Max', 'Experience audio like never before with Apple AirPods Max, where breakthrough sound meets iconic Apple design. Crafted with premium materials and packed with cutting-edge technology, these over-ear headphones deliver a listening experience that’s immersive, intuitive, and effortlessly luxurious.', 64998.99, NULL, 'headphones', 'apple', 'product_6867615616f69.webp', 'Drivers: 40mm Custom Dynamic Drivers, Spatial Audio: Yes with Dynamic Head Tracking, Chip: Apple H1 (Dual), Battery Life: Up to 20 hour', 'white,black', 20, 4.5, 0, '', NULL, NULL, 0, '2025-07-04 05:06:30');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `email`, `subscribed_at`) VALUES
(3, 'belayetsaimun16@gmail.com', '2025-06-27 13:04:16'),
(4, 'karim@gmail.com', '2025-06-27 13:16:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`) VALUES
(2, 'Belayet Hossain Saimun', 'u2108032@student.cuet.ac.bd', '$2y$10$X63QCmsDyOZMkKFNqkg.OOmDT0V5wi/FD5ug6L92CPSO1U6qGieYy', '9cd3b3d9be2f96825869ad9f84823b486a96c8f51430d2843006014e4bbf853d', '2025-06-01 17:36:18'),
(4, 'bhs', 'be@gmail.com', '$2y$10$ZHeDQVBFsX6OTvdMAojB/eWOfUAyMxqdZh7jB.ZTdJldacmekFB4K', '63b5011587377cd8959fbeddfbfcd32b4cc63ce79672e7bfebdc2cb3baa69477', '2025-06-16 12:44:18'),
(5, 'Belayet Saimun', 'belayetsaimun@gmail.com', '$2y$10$r2ggXmcQQAJc9iSYJa4kEesOcxvg0H4KuJ41gcre0N8uingKmAcNW', NULL, '2025-06-19 16:03:27'),
(6, 'Karim', 'karim@gmail.com', '$2y$10$Uf2Bhnvvm2BAe5SZJkMfHuyY4ueclgHNupTG7w3HvXTVI2pPX0uBy', NULL, '2025-06-20 03:49:02'),
(7, 'utktkutut', 'utltlut@hm.h0j', '$2y$10$3MGsPiM//prF6Aj.40C9KOGMBMb2cWTmVcwSzZXMjdw/xmlO/dot.', NULL, '2025-06-22 09:02:39'),
(8, 'BELAYET HOSSAIN SAIMUN', 'bs32@gmail.com', '$2y$10$uuUfEUEruiS40THX521iB.79nKXEKomcb0VLvgy0B0Cqi65rRdJ8e', NULL, '2025-06-28 18:07:43'),
(9, 'Saimun', 'saimun@gmail.com', '$2y$10$.Sno9ADwhjPk5niJC90tGuxT36qPx.S5nLZrzxRmPbhkrx8Imx9bi', '141c3a1bb6fe56fb45ab42fb11540465540dd27f2e191b17472cb08cecbb3520', '2025-06-28 18:08:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
