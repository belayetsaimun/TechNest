<?php
$active_page = 'about';
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Set title
$title = "About Us - TechNest";

// Include header
include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="page-header">
    <div class="container">
        <h1>About TechNest</h1>
        <p>Discover our story, mission, and the team behind your favorite tech store</p>
    </div>
</section>

<!-- About Content -->
<section class="about-section">
    <div class="container">
        <div class="about-intro">
            <div class="about-image">
                <img src="<?php echo BASE_URL; ?>assets/images/about.png" alt="TechNest Store">
            </div>
            <div class="about-content">
                <h2>Our Story</h2>
                <p>Founded in 2024, TechNest began with a simple mission: to make premium technology accessible to everyone in Bangladesh. What started as a small online store has grown into one of the country's most trusted tech retailers.</p>
                <p>Our founder, Belayet Hossain Saimun, noticed a gap in the market for quality tech products with reliable customer service. Drawing from his background in computer engineering and passion for innovation, he established TechNest to bridge this gap.</p>
                <p>Today, we serve thousands of customers across Bangladesh, offering the latest smartphones, laptops, audio devices, and smart gadgets from the world's leading brands—all backed by our commitment to quality, affordability, and exceptional service.</p>
            </div>
        </div>
        
        <div class="mission-vision">
            <div class="mission-card">
                <div class="card-icon">
                    <i class="fas fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>To provide Bangladeshi consumers with access to premium technology products at fair prices, supported by exceptional customer service and expert technical support.</p>
            </div>
            <div class="vision-card">
                <div class="card-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>To become the most trusted and customer-centric technology retailer in Bangladesh, empowering people through technology and innovation.</p>
            </div>
            <div class="values-card">
                <div class="card-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>Our Values</h3>
                <p>Integrity, customer satisfaction, innovation, accessibility, and community contribution guide everything we do at TechNest.</p>
            </div>
        </div>
        
        <div class="about-achievements">
            <h2>Our Achievements</h2>
            <div class="achievements-grid">
                <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="achievement-number">25,000+</div>
                    <div class="achievement-label">Happy Customers</div>
                </div>
                
                <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="achievement-number">50,000+</div>
                    <div class="achievement-label">Products Delivered</div>
                </div>
                
                <!-- <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="achievement-number">3</div>
                    <div class="achievement-label">Retail Locations</div>
                </div>
                 -->
                <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="achievement-number">8</div>
                    <div class="achievement-label">Industry Awards</div>
                </div>
            </div>
        </div>
        
        <div class="team-section">
            <h2>Meet Our Leadership Team</h2>
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/user.png" alt="Belayet Hossain Saimun">
                    </div>
                    <div class="member-info">
                        <h3>Belayet Hossain Saimun</h3>
                        <p class="member-role">Founder & CEO</p>
                        <p class="member-bio">An ETE graduate from CUET with a passion for cutting-edge technology. Belayet founded TechNest with a vision to transform the tech retail experience in Bangladesh.</p>
                        <div class="member-social">
                            <a href="#"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/user.png" alt="Joy Ahammed">
                    </div>
                    <div class="member-info">
                        <h3>Juwel Ahammed Joy</h3>
                        <p class="member-role">Chief Technology Officer</p>
                        <p class="member-bio">With over 10 years of experience in software development, Joy leads our e-commerce platform and technology initiatives, ensuring a seamless shopping experience.</p>
                        <div class="member-social">
                            <a href="#"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/user.png" alt="Ramim Kaiser">
                    </div>
                    <div class="member-info">
                        <h3>Ramim Kaiser</h3>
                        <p class="member-role">Chief Operations Officer</p>
                        <p class="member-bio">Ramim manages our supply chain, logistics, and retail operations. His expertise ensures that customers receive their products quickly and in perfect condition.</p>
                        <div class="member-social">
                            <a href="#"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                
                <!-- <div class="team-member">
                    <div class="member-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/user.png" alt="Jahid Islam">
                    </div>
                    <div class="member-info">
                        <h3>Jahid Islam</h3>
                        <p class="member-role">Chief Marketing Officer</p>
                        <p class="member-bio">Jahid brings creative vision to TechNest's brand strategy and marketing initiatives, with a background in digital marketing and consumer behavior.</p>
                        <div class="member-social">
                            <a href="#"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        
        <div class="our-approach">
            <h2>Our Approach</h2>
            <div class="approach-grid">
                <div class="approach-item">
                    <div class="approach-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Quality Assurance</h3>
                    <p>We carefully select and test each product to ensure it meets our high standards. Every device undergoes a rigorous quality check before reaching our customers.</p>
                </div>
                
                <div class="approach-item">
                    <div class="approach-icon">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <h3>Value for Money</h3>
                    <p>We believe in fair pricing and transparent policies. Our direct relationships with manufacturers allow us to offer premium products at competitive prices.</p>
                </div>
                
                <div class="approach-item">
                    <div class="approach-icon">
                        <i class="fas fa-headset"></i>
                    </div>
                    <h3>Customer-First Service</h3>
                    <p>Our team of tech experts is always ready to assist with product selection, technical support, and after-sales service. Your satisfaction is our priority.</p>
                </div>
                
                <div class="approach-item">
                    <div class="approach-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <h3>Sustainability</h3>
                    <p>We're committed to reducing our environmental impact through eco-friendly packaging, device recycling programs, and energy-efficient operations.</p>
                </div>
            </div>
        </div>
        
        <div class="partners-section">
            <h2>Our Brand Partners</h2>
            <p class="partners-intro">We collaborate with the world's leading technology brands to bring you authentic, high-quality products.</p>
            
            <div class="partners-grid">
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-apple.png" alt="Apple">
                </div>
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-samsung.png" alt="Samsung">
                </div>
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-sony.png" alt="Sony">
                </div>
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-dell.png" alt="Dell">
                </div>
                <!-- <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-hp.png" alt="HP">
                </div> -->
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-logitech.png" alt="LG">
                </div>
                <div class="partner-logo">
                    <img src="<?php echo BASE_URL; ?>assets/images/brand-google.png" alt="Google">
                </div>
            </div>
        </div>
        
        <!-- <div class="locations-section">
            <h2>Our Locations</h2>
            <div class="locations-grid">
                <div class="location-card">
                    <div class="location-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/stores/chattogram.jpg" alt="Chattogram Store">
                    </div>
                    <div class="location-details">
                        <h3>Chattogram (Flagship Store)</h3>
                        <p><i class="fas fa-map-marker-alt"></i> SASH, CUET, Raozan-4349, Chattogram</p>
                        <p><i class="fas fa-phone"></i> +8801581448561</p>
                        <p><i class="fas fa-clock"></i> 10:00 AM - 8:00 PM (Sat-Thu), 2:00 PM - 8:00 PM (Fri)</p>
                    </div>
                </div>
                
                <div class="location-card">
                    <div class="location-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/stores/dhaka.jpg" alt="Dhaka Store">
                    </div>
                    <div class="location-details">
                        <h3>Dhaka</h3>
                        <p><i class="fas fa-map-marker-alt"></i> Block C, Bashundhara R/A, Dhaka-1229</p>
                        <p><i class="fas fa-phone"></i> +8801712345678</p>
                        <p><i class="fas fa-clock"></i> 9:00 AM - 9:00 PM (Sat-Thu), 2:00 PM - 9:00 PM (Fri)</p>
                    </div>
                </div>
                
                <div class="location-card">
                    <div class="location-image">
                        <img src="<?php echo BASE_URL; ?>assets/images/stores/khulna.jpg" alt="Khulna Store">
                    </div>
                    <div class="location-details">
                        <h3>Khulna</h3>
                        <p><i class="fas fa-map-marker-alt"></i> KDA Avenue, Khulna-9100</p>
                        <p><i class="fas fa-phone"></i> +8801812345678</p>
                        <p><i class="fas fa-clock"></i> 10:00 AM - 7:00 PM (Sat-Thu), 2:00 PM - 7:00 PM (Fri)</p>
                    </div>
                </div>
            </div>
        </div> -->
        
        <div class="cta-section">
            <div class="cta-content">
                <h2>Join the TechNest Family</h2>
                <p>Whether you're shopping for the latest gadgets, seeking technical support, or looking to join our team, we'd love to hear from you.</p>
                <div class="cta-buttons">
                    <a href="<?php echo BASE_URL; ?>products.php" class="btn primary-btn">Browse Products</a>
                    <a href="<?php echo BASE_URL; ?>contact.php" class="btn secondary-btn">Contact Us</a>
                    <a href="<?php echo BASE_URL; ?>careers.php" class="btn accent-btn">View Careers</a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.page-header {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 60px 0;
    text-align: center;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 42px;
    margin-bottom: 15px;
    font-weight: 700;
}

.page-header p {
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.9;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.about-section {
    padding: 0 0 80px;
}

.about-section h2 {
    font-size: 32px;
    color: var(--dark-color);
    margin-bottom: 25px;
    position: relative;
}

.about-section h2:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

/* About Intro */
.about-intro {
    display: flex;
    gap: 40px;
    margin-bottom: 60px;
    align-items: center;
}

.about-image {
    flex: 1;
    max-width: 500px;
}

.about-image img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-content {
    flex: 1;
}

.about-content p {
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 1.7;
}

/* Mission Vision */
.mission-vision {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-bottom: 60px;
}

.mission-card, .vision-card, .values-card {
    background: var(--card-color);
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease;
}

.mission-card:hover, .vision-card:hover, .values-card:hover {
    transform: translateY(-5px);
}

.card-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    margin: 0 auto 20px;
}

.mission-vision h3 {
    margin: 0 0 15px;
    font-size: 20px;
}

.mission-vision p {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
}

/* Achievements */
.about-achievements {
    margin-bottom: 60px;
    text-align: center;
}

.about-achievements h2 {
    text-align: center;
}

.about-achievements h2:after {
    left: 50%;
    transform: translateX(-50%);
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
    margin-top: 40px;
}

.achievement-item {
    background: var(--card-color);
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease;
}

.achievement-item:hover {
    transform: translateY(-5px);
}

.achievement-icon {
    width: 60px;
    height: 60px;
    background: rgba(0, 82, 204, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: var(--primary-color);
    margin: 0 auto 15px;
}

.achievement-number {
    font-size: 28px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 5px;
}

.achievement-label {
    font-size: 15px;
    color: var(--text-light);
}

/* Team Section */
.team-section {
    margin-bottom: 60px;
    text-align: center;
}

.team-section h2 {
    text-align: center;
}

.team-section h2:after {
    left: 50%;
    transform: translateX(-50%);
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.team-member {
    background: var(--card-color);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    border: 1px solid var(--border-color);
}

.team-member:hover {
    transform: translateY(-5px);
}

.member-image {
    position: relative;
    overflow: hidden;
    height: 250px;
}

.member-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.team-member:hover .member-image img {
    transform: scale(1.05);
}

.member-info {
    padding: 20px;
    text-align: left;
}

.member-info h3 {
    margin: 0 0 5px;
    font-size: 18px;
}

.member-role {
    color: var(--primary-color);
    font-weight: 500;
    margin: 0 0 10px;
    font-size: 14px;
}

.member-bio {
    margin: 0 0 15px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-color);
}

.member-social {
    display: flex;
    gap: 10px;
}

.member-social a {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(0, 82, 204, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    transition: all 0.3s ease;
}

.member-social a:hover {
    background: var(--primary-color);
    color: white;
}

/* Our Approach */
.our-approach {
    margin-bottom: 60px;
    text-align: center;
}

.our-approach h2 {
    text-align: center;
}

.our-approach h2:after {
    left: 50%;
    transform: translateX(-50%);
}

.approach-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-top: 40px;
}

.approach-item {
    background: var(--card-color);
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease;
}

.approach-item:hover {
    transform: translateY(-5px);
}

.approach-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(0, 82, 204, 0.1), rgba(0, 184, 212, 0.1));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: var(--primary-color);
    margin: 0 auto 20px;
}

.approach-item h3 {
    margin: 0 0 15px;
    font-size: 18px;
}

.approach-item p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
}

/* Partners Section */
.partners-section {
    margin-bottom: 60px;
    text-align: center;
}

.partners-section h2 {
    text-align: center;
}

.partners-section h2:after {
    left: 50%;
    transform: translateX(-50%);
}

.partners-intro {
    max-width: 700px;
    margin: 0 auto 30px;
    font-size: 16px;
    color: var(--text-light);
}

.partners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 40px;
}

.partner-logo {
    background: var(--card-color);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    height: 100px;
}

.partner-logo:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.partner-logo img {
    max-width: 80%;
    max-height: 60px;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
}

.partner-logo:hover img {
    filter: grayscale(0%);
    opacity: 1;
}

/* Locations Section */
.locations-section {
    margin-bottom: 60px;
    text-align: center;
}

.locations-section h2 {
    text-align: center;
}

.locations-section h2:after {
    left: 50%;
    transform: translateX(-50%);
}

.locations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.location-card {
    background: var(--card-color);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    border: 1px solid var(--border-color);
}

.location-card:hover {
    transform: translateY(-5px);
}

.location-image {
    height: 200px;
    overflow: hidden;
}

.location-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.location-card:hover .location-image img {
    transform: scale(1.05);
}

.location-details {
    padding: 20px;
    text-align: left;
}

.location-details h3 {
    margin: 0 0 15px;
    font-size: 18px;
}

.location-details p {
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.6;
}

.location-details i {
    color: var(--primary-color);
    margin-right: 8px;
    width: 16px;
    text-align: center;
}

/* CTA Section */
.cta-section {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: 10px;
    padding: 50px;
    color: white;
    text-align: center;
    margin-top: 60px;
}

.cta-content h2 {
    margin: 0 0 15px;
    font-size: 28px;
    color: white;
}

.cta-content h2:after {
    display: none;
}

.cta-content p {
    margin: 0 0 30px;
    font-size: 16px;
    opacity: 0.9;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.accent-btn {
    background: var(--accent-color);
    color: white;
}

.accent-btn:hover {
    background: #0095a8;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 184, 212, 0.3);
}

@media (max-width: 992px) {
    .about-intro {
        flex-direction: column;
    }
    
    .about-image {
        max-width: 100%;
        margin-bottom: 30px;
    }
    
    .team-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .page-header {
        padding: 40px 0;
    }
    
    .page-header h1 {
        font-size: 32px;
    }
    
    .about-section h2 {
        font-size: 28px;
    }
    
    .cta-section {
        padding: 30px 20px;
    }
    
    .locations-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<?php include 'includes/footer.php'; ?>