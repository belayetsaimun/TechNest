<?php
$active_page = 'contact';
$title = "TechNest - Contact Us";
$page_js = 'contact.js'; // Add this line to load the correct script

require_once 'includes/config.php';
require_once 'includes/functions.php';
include 'includes/header.php';
?>

<div class="breadcrumb">
    <div class="container">
        <ul>
            <li><a href="<?php echo BASE_URL; ?>"><i class="fas fa-home"></i> Home</a></li>
            <li class="active"><i class="fas fa-envelope"></i> Contact Us</li>
        </ul>
    </div>
</div>

<section class="contact-hero">
    <div class="hero-backdrop"></div>
    <div class="container">
        <div class="hero-content">
            <div class="tech-badge">GET IN TOUCH</div>
            <h1>Contact <span class="gradient-text">TechNest</span></h1>
            <p class="hero-description">We're here to help you with all your tech needs. Get in touch with our expert team for support, inquiries, or feedback.</p>
            
            <div class="hero-stats">
                <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number">24/7</span>
                        <span class="stat-label">Support</span>
                    </div>
                </div>
                <div class="stat-item" data-aos="fade-up" data-aos-delay="200">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number">50K+</span>
                        <span class="stat-label">Happy Customers</span>
                    </div>
                </div>
                <div class="stat-item" data-aos="fade-up" data-aos-delay="300">
                    <div class="stat-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number">99%</span>
                        <span class="stat-label">Satisfaction Rate</span>
                    </div>
                </div>
                <div class="stat-item" data-aos="fade-up" data-aos-delay="400">
                    <div class="stat-icon">
                        <i class="fas fa-headset"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number"><2hr</span>
                        <span class="stat-label">Response Time</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="contact-info-section">
    <div class="container">
        <div class="section-header">
            <h2>Ways to Reach Us</h2>
            <p>Choose the most convenient way to get in touch with our team</p>
        </div>
        
        <div class="contact-info-grid">
            <div class="contact-info-card" data-aos="fade-up" data-aos-delay="100">
                <div class="card-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="card-content">
                    <h3>Visit Our Store</h3>
                    <p>SASH, CUET, Raozan-4349<br>Chattogram, Bangladesh</p>
                    <a href="#" class="card-link">Get Directions <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="card-glow"></div>
            </div>
            
            <div class="contact-info-card" data-aos="fade-up" data-aos-delay="200">
                <div class="card-icon">
                    <i class="fas fa-phone-alt"></i>
                </div>
                <div class="card-content">
                    <h3>Call Us Direct</h3>
                    <p>+8801581448561<br>+8801713661234</p>
                    <a href="tel:+8801581448561" class="card-link">Call Now <i class="fas fa-phone"></i></a>
                </div>
                <div class="card-glow"></div>
            </div>
            
            <div class="contact-info-card" data-aos="fade-up" data-aos-delay="300">
                <div class="card-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="card-content">
                    <h3>Email Support</h3>
                    <p>support@technest.com<br>info@technest.com</p>
                    <a href="mailto:support@technest.com" class="card-link">Send Email <i class="fas fa-paper-plane"></i></a>
                </div>
                <div class="card-glow"></div>
            </div>
            
            <div class="contact-info-card" data-aos="fade-up" data-aos-delay="400">
                <div class="card-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="card-content">
                    <h3>Business Hours</h3>
                    <p>Mon - Sat: 9:00 AM - 7:00 PM<br>Sunday: 10:00 AM - 5:00 PM</p>
                    <a href="#" class="card-link">View Schedule <i class="fas fa-calendar"></i></a>
                </div>
                <div class="card-glow"></div>
            </div>
        </div>
    </div>
</section>

<section class="contact-form-section">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-form-container" data-aos="fade-right">
    <div class="form-header">
        <div class="tech-badge">SEND MESSAGE</div>
        <h2>Get In Touch</h2>
        <p>Have a question or need assistance? Send us a message and we'll get back to you within 24 hours.</p>
    </div>
    
    <form id="contactForm" class="contact-form" action="<?php echo BASE_URL; ?>process_contact.php" method="POST">
        <div class="form-row">
            <div class="form-group">
                <label for="name">Full Name <span class="required">*</span></label>
                <div class="input-wrapper">
                    <i class="fas fa-user"></i>
                    <input type="text" id="name" name="name" placeholder="Enter your full name" required>
                </div>
            </div>
            <div class="form-group">
                <label for="email">Email Address <span class="required">*</span></label>
                <div class="input-wrapper">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required>
                </div>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <div class="input-wrapper">
                    <i class="fas fa-phone"></i>
                    <input type="tel" id="phone" name="phone" placeholder="Enter your phone number">
                </div>
            </div>
            <div class="form-group">
                <label for="subject">Subject <span class="required">*</span></label>
                <div class="input-wrapper">
                    <i class="fas fa-tag"></i>
                    <select id="subject" name="subject" required>
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label for="message">Message <span class="required">*</span></label>
            <div class="input-wrapper">
                <i class="fas fa-comment"></i>
                <textarea id="message" name="message" rows="6" placeholder="Tell us how we can help you..." required></textarea>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit" class="btn primary-btn submit-btn">
                <i class="fas fa-paper-plane"></i>
                <span>Send Message</span>
                <div class="btn-loader">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </button>
            <button type="reset" class="btn secondary-btn reset-btn">
                <i class="fas fa-undo"></i> Reset Form
            </button>
        </div>
    </form> 
</div>
            
            <div class="contact-map-container" data-aos="fade-left">
                <div class="map-header">
                    <h3>Find Us Here</h3>
                    <p>Visit our store for hands-on product experience</p>
                </div>
                <div class="contact-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.136997428798!2d91.96899491539126!3d22.42436908525868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2fca38555555%3A0x556add1f61863583!2sChittagong%20University%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sbd!4v1672222222222!5m2!1sen!2sbd" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <div class="map-overlay">
                        <div class="location-pin">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                    </div>
                </div>
                <div class="map-actions">
                    <a href="#" class="map-btn">
                        <i class="fas fa-directions"></i> Get Directions
                    </a>
                    <a href="#" class="map-btn">
                        <i class="fas fa-street-view"></i> Street View
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="faq-section">
    <div class="container">
        <div class="section-header">
            <div class="tech-badge">FAQ</div>
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to the most common questions about our products and services</p>
        </div>
        
        <div class="faq-container">
            <?php
            // Fetch all FAQs from the database
            $faq_sql = "SELECT * FROM faqs ORDER BY category, sort_order";
            $faq_result = mysqli_query($conn, $faq_sql);
            
            $faqs_by_category = [];
            if ($faq_result && mysqli_num_rows($faq_result) > 0) {
                while ($row = mysqli_fetch_assoc($faq_result)) {
                    $faqs_by_category[$row['category']][] = $row;
                }
            }
            
            $categories = array_keys($faqs_by_category);
            ?>

            <div class="faq-categories">
                <?php foreach ($categories as $index => $category): ?>
                    <button class="faq-category-btn <?php echo ($index === 0) ? 'active' : ''; ?>" data-category="<?php echo htmlspecialchars($category); ?>">
                        <i class="fas fa-info-circle"></i> <?php echo htmlspecialchars(ucfirst($category)); ?>
                    </button>
                <?php endforeach; ?>
            </div>

            <div class="faq-content">
                <?php foreach ($faqs_by_category as $category => $faqs): ?>
                <div class="faq-category-content <?php echo ($category === $categories[0]) ? 'active' : ''; ?>" data-category="<?php echo htmlspecialchars($category); ?>">
                    <?php foreach ($faqs as $faq): ?>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3><?php echo htmlspecialchars($faq['question']); ?></h3>
                            <div class="faq-toggle"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p><?php echo nl2br(htmlspecialchars($faq['answer'])); ?></p>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="faq-cta">
            <p>Can't find what you're looking for?</p>
            <a href="#contactForm" class="btn primary-btn">Contact Support <i class="fas fa-arrow-down"></i></a>
        </div>
    </div>
</section>
<?php
include 'includes/footer.php';
?>