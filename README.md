# TechNest

A full-featured e-commerce platform for technology products built with PHP, JavaScript, CSS, and HTML.

## 📋 Overview

TechNest is a modern e-commerce website designed for selling technology products. It provides a complete online shopping experience with product browsing, cart management, checkout process, and admin panel.

## 🚀 Features

- **Product Management**: Browse products by categories, view deals, and new arrivals
- **Shopping Cart**: Add products to cart and manage quantities
- **Checkout System**: Complete order processing with customer information
- **User Authentication**: Login and registration system
- **Admin Panel**: Manage products, orders, and site content
- **Newsletter Subscription**: Keep customers updated with latest offers
- **Contact Form**: Customer support communication
- **Additional Pages**: About, FAQ, Privacy Policy, Shipping Info, Warranty, Careers, Press, Blog, and Repair services

## 🛠️ Technology Stack

- **Backend**: PHP (35.5%)
- **Frontend**: JavaScript (31.2%), CSS (24%), HTML (9.1%)
- **Database**: MySQL (SQL file included)
- **Other**: Hack (0.2%)

## 📁 Project Structure

```
TechNest/
├── admin/              # Admin panel files
├── assets/             # CSS, JS, and other assets
├── auth/               # Authentication files
├── images/             # Product and site images
├── includes/           # Reusable PHP components
├── index.php           # Homepage
├── products.php        # Product listing page
├── categories.php      # Category browsing
├── checkout.php        # Checkout process
├── contact.php         # Contact page
├── about.php           # About page
├── faq.php             # Frequently asked questions
├── privacy.php         # Privacy policy
├── shipping.php        # Shipping information
├── deals.php           # Special deals
├── new-arrivals.php    # New products
└── technest_db.sql     # Database schema
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/belayetsaimun/TechNest.git
   cd TechNest
   ```

2. **Set up the database**
   - Create a new MySQL database
   - Import the `technest_db.sql` file into your database
   ```bash
   mysql -u your_username -p your_database_name < technest_db.sql
   ```

3. **Configure database connection**
   - Update the database configuration in your PHP files (typically in `includes/` directory)
   - Set your database credentials (host, username, password, database name)

4. **Set up web server**
   - Place the project in your web server's document root (e.g., `htdocs` for XAMPP, `www` for WAMP)
   - Or configure a virtual host pointing to the project directory

5. **Access the application**
   - Open your browser and navigate to `http://localhost/TechNest` (or your configured URL)

## 📝 Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Modern web browser

## 🔐 Admin Access

After installation, you can access the admin panel at `/admin` directory. Default credentials should be configured during database setup.

## 📧 Contact

For any inquiries or support, please use the contact form on the website or reach out through GitHub.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Belayet Saimun**
- GitHub: [@belayetsaimun](https://github.com/belayetsaimun)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/belayetsaimun/TechNest/issues).

## ⭐ Show your support

Give a ⭐️ if you like this project!
```
