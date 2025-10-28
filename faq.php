<?php
$active_page = 'faq';
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Set title
$title = "Frequently Asked Questions - TechNest";

// Include header
include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="page-header">
    <div class="container">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to commonly asked questions about our products and services</p>
    </div>
</section>

<!-- FAQ Content Section -->
<section class="faq-section">
    <div class="container">
        <div class="faq-search">
            <input type="text" id="faqSearch" placeholder="Search frequently asked questions...">
            <button><i class="fas fa-search"></i></button>
        </div>

        <div class="faq-categories">
            <button class="faq-category active" data-category="all">All</button>
            <button class="faq-category" data-category="general">General</button>
            <button class="faq-category" data-category="shipping">Shipping</button>
            <button class="faq-category" data-category="returns">Returns</button>
            <button class="faq-category" data-category="support">Technical Support</button>
            <button class="faq-category" data-category="warranty">Warranty</button>
        </div>

        <div class="faq-container">
            <?php
            // Fetch FAQs from database
            $sql = "SELECT * FROM faqs ORDER BY category, sort_order";
            $result = mysqli_query($conn, $sql);

            if (mysqli_num_rows($result) > 0) {
                $current_category = '';
                
                while ($faq = mysqli_fetch_assoc($result)) {
                    // If we're entering a new category, add a header
                    if ($current_category != $faq['category']) {
                        $current_category = $faq['category'];
                        echo '<h2 class="faq-category-title">' . ucfirst($current_category) . '</h2>';
                    }
            ?>
                <div class="faq-item" data-category="<?php echo htmlspecialchars($faq['category']); ?>">
                    <div class="faq-question">
                        <h3><?php echo htmlspecialchars($faq['question']); ?></h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo nl2br(htmlspecialchars($faq['answer'])); ?></p>
                    </div>
                </div>
            <?php
                }
            } else {
                echo "<p class='no-faqs'>No FAQs found. Please check back later.</p>";
            }
            ?>

            <!-- Sample FAQs if database is empty -->
            <?php if (mysqli_num_rows($result) == 0): ?>
                <h2 class="faq-category-title">General</h2>
                
                <div class="faq-item" data-category="general">
                    <div class="faq-question">
                        <h3>What makes TechNest different from other tech retailers?</h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>TechNest offers premium quality tech products at competitive prices with exceptional customer service. We provide 2-year warranties on most products, free shipping on orders over ৳50,000, and 24/7 customer support. Our team of tech experts carefully curates each product to ensure you get the best technology available.</p>
                    </div>
                </div>
                
                <div class="faq-item" data-category="general">
                    <div class="faq-question">
                        <h3>Do you offer warranty on your products?</h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, all our products come with at least a 1-year manufacturer's warranty. Many of our premium products include an extended 2-year TechNest warranty at no extra cost. For specific warranty information on any product, please check the product details page or contact our customer service team.</p>
                    </div>
                </div>

                <h2 class="faq-category-title">Shipping</h2>
                
                <div class="faq-item" data-category="shipping">
                    <div class="faq-question">
                        <h3>What are your shipping options and costs?</h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>We offer free standard shipping on all orders over ৳50,000. Standard shipping typically takes 3-5 business days. Express shipping is available for an additional charge and delivers within 1-2 business days. Local pickup is available at select locations. International shipping is available to select countries.</p>
                    </div>
                </div>
                
                <div class="faq-item" data-category="shipping">
                    <div class="faq-question">
                        <h3>How can I track my order?</h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your TechNest account and view your order status under "Order History." Our tracking system provides real-time updates as your package moves through our delivery network.</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <div class="faq-support-box">
            <h3>Still have questions?</h3>
            <p>Our customer support team is available 24/7 to help you with any questions you may have.</p>
            <div class="faq-support-options">
                <a href="contact.php" class="btn primary-btn"><i class="fas fa-envelope"></i> Contact Us</a>
                <a href="tel:+8801581448561" class="btn secondary-btn"><i class="fas fa-phone"></i> Call Support</a>
                <a href="#" class="btn accent-btn"><i class="fas fa-comment-dots"></i> Live Chat</a>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-toggle i');
            
            // Toggle current FAQ
            answer.style.maxHeight = answer.style.maxHeight ? null : answer.scrollHeight + 'px';
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
            
            // Close other FAQs (uncomment for accordion behavior)
            /*
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.nextElementSibling.style.maxHeight = null;
                    q.querySelector('.faq-toggle i').className = 'fas fa-plus';
                }
            });
            */
        });
    });
    
    // FAQ Category Filter
    const categoryButtons = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Toggle active class for buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQ items
            faqItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide category headers based on visible items
            document.querySelectorAll('.faq-category-title').forEach(title => {
                const categoryName = title.textContent.toLowerCase();
                const hasVisibleItems = Array.from(faqItems).some(item => 
                    item.dataset.category === categoryName && 
                    item.style.display !== 'none'
                );
                
                if (category === 'all' || hasVisibleItems) {
                    title.style.display = 'block';
                } else {
                    title.style.display = 'none';
                }
            });
        });
    });
    
    // FAQ Search functionality
    const searchInput = document.getElementById('faqSearch');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        faqItems.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
</script>

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

.faq-section {
    padding: 40px 0 80px;
}

.faq-search {
    display: flex;
    margin-bottom: 30px;
    max-width: 600px;
    margin: 0 auto 40px;
}

.faq-search input {
    flex: 1;
    padding: 15px 20px;
    border: 2px solid var(--border-color);
    border-radius: 8px 0 0 8px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.faq-search input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
    outline: none;
}

.faq-search button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0 25px;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.faq-search button:hover {
    background: var(--accent-color);
}

.faq-categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 30px 0;
    gap: 10px;
}

.faq-category {
    padding: 10px 20px;
    background: var(--background-color);
    border: 2px solid var(--border-color);
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.faq-category:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.faq-category.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.faq-container {
    max-width: 800px;
    margin: 0 auto;
}

.faq-category-title {
    margin: 40px 0 20px;
    font-size: 24px;
    color: var(--primary-color);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}

.faq-item {
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-item:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.faq-question {
    padding: 20px;
    background: var(--card-color);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-question h3 {
    font-size: 18px;
    margin: 0;
    font-weight: 500;
}

.faq-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--primary-color);
    transition: all 0.3s ease;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding: 0 20px;
}

.faq-answer p {
    padding: 20px 0;
    margin: 0;
    border-top: 1px solid var(--border-color);
    line-height: 1.7;
}

.faq-support-box {
    margin-top: 60px;
    background: linear-gradient(135deg, rgba(0, 82, 204, 0.1), rgba(0, 184, 212, 0.1));
    padding: 40px;
    border-radius: 10px;
    text-align: center;
}

.faq-support-box h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: var(--primary-color);
}

.faq-support-box p {
    margin-bottom: 20px;
    font-size: 16px;
}

.faq-support-options {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
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

@media (max-width: 768px) {
    .page-header {
        padding: 40px 0;
    }
    
    .page-header h1 {
        font-size: 32px;
    }
    
    .faq-question h3 {
        font-size: 16px;
    }
    
    .faq-support-options {
        flex-direction: column;
        align-items: center;
    }
    
    .faq-support-options .btn {
        width: 100%;
    }
}
</style>

<?php include 'includes/footer.php'; ?>