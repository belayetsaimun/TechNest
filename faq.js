document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const faqItems = document.querySelectorAll('.faq-item');
    const faqGroups = document.querySelectorAll('.faq-group');
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const searchInput = document.getElementById('faqSearch');
    const searchBtn = document.getElementById('faqSearchBtn');
    const resetBtn = document.getElementById('resetSearch');
    const noResultsMessage = document.getElementById('noResultsFound');
    
    // Initialize FAQ accordion functionality
    initAccordion();
    
    // Initialize category filter
    initCategoryFilter();
    
    // Initialize search functionality
    initSearch();

    // Initialize FAQ Accordion
    function initAccordion() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            question.addEventListener('click', () => {
                // Check if this item is already active
                const isActive = item.classList.contains('active');
                
                // First, close all open FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.classList.remove('active');
                    
                    const otherToggle = otherItem.querySelector('.faq-toggle i');
                    otherToggle.className = 'fas fa-plus';
                });
                
                // If the clicked item wasn't active, open it
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.classList.add('active');
                    toggle.querySelector('i').className = 'fas fa-times';
                }
            });
        });
    }
    
    // Initialize Category Filter
    function initCategoryFilter() {
        faqCategoryBtns.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                faqCategoryBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const selectedCategory = button.dataset.category;
                
                // Show all FAQ groups if "All Questions" is selected
                if (selectedCategory === 'all') {
                    faqGroups.forEach(group => {
                        group.style.display = 'block';
                    });
                } else {
                    // Otherwise, show only the selected category
                    faqGroups.forEach(group => {
                        if (group.dataset.category === selectedCategory) {
                            group.style.display = 'block';
                        } else {
                            group.style.display = 'none';
                        }
                    });
                }
                
                // Reset search and hide "no results" message if visible
                resetSearch();
            });
        });
    }
    
    // Initialize Search Functionality
    function initSearch() {
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSearch);
        }
    }
    
    // Perform Search Function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            resetSearch();
            return;
        }
        
        // Reset to show all categories first
        faqCategoryBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        faqGroups.forEach(group => group.style.display = 'block');
        
        let matchFound = false;
        
        // Initialize an array to track which FAQ items match
        const matchingItems = [];
        
        // Search through all FAQ items
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                matchingItems.push(item);
                matchFound = true;
            }
        });
        
        // Hide all FAQ items first
        faqItems.forEach(item => {
            item.style.display = 'none';
            // Close any open accordions and remove highlighting
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = '0';
            answer.classList.remove('active');
            
            // Remove any existing highlighted text
            const question = item.querySelector('.faq-question h3');
            const answerContent = item.querySelector('.faq-answer');
            question.innerHTML = question.innerHTML.replace(/<mark class="highlight">|<\/mark>/gi, '');
            answerContent.innerHTML = answerContent.innerHTML.replace(/<mark class="highlight">|<\/mark>/gi, '');
        });
        
        // Show and highlight matching items
        if (matchFound) {
            matchingItems.forEach(item => {
                item.style.display = 'block';
                
                // Highlight the matching text
                const question = item.querySelector('.faq-question h3');
                const answer = item.querySelector('.faq-answer');
                
                question.innerHTML = highlightText(question.textContent, searchTerm);
                answer.innerHTML = highlightText(answer.innerHTML, searchTerm);
                
                // Find which group this item belongs to and make sure it's visible
                const parentGroup = item.closest('.faq-group');
                if (parentGroup) {
                    parentGroup.style.display = 'block';
                }
            });
            
            // Automatically open the first matching item
            if (matchingItems.length > 0) {
                const firstMatchItem = matchingItems[0];
                firstMatchItem.classList.add('active');
                const firstMatchAnswer = firstMatchItem.querySelector('.faq-answer');
                firstMatchAnswer.style.maxHeight = firstMatchAnswer.scrollHeight + 'px';
                firstMatchAnswer.classList.add('active');
                const firstMatchToggle = firstMatchItem.querySelector('.faq-toggle i');
                firstMatchToggle.className = 'fas fa-times';
                
                // Scroll to the first matching item
                setTimeout(() => {
                    firstMatchItem.scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 100);
            }
            
            // Hide the no results message
            noResultsMessage.style.display = 'none';
        } else {
            // Show the no results message
            noResultsMessage.style.display = 'block';
            // Hide all FAQ groups when no results are found
            faqGroups.forEach(group => group.style.display = 'none');
        }
    }
    
    // Reset Search Function
    function resetSearch() {
        // Clear search input
        if (searchInput) searchInput.value = '';
        
        // Show all FAQ items
        faqItems.forEach(item => {
            item.style.display = 'block';
            
            // Remove any highlighting
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.faq-answer');
            question.innerHTML = question.textContent;
            answer.innerHTML = answer.innerHTML.replace(/<mark class="highlight">|<\/mark>/gi, '');
        });
        
        // Show all groups according to the current active category
        const activeCategory = document.querySelector('.faq-category-btn.active').dataset.category;
        
        if (activeCategory === 'all') {
            faqGroups.forEach(group => group.style.display = 'block');
        } else {
            faqGroups.forEach(group => {
                if (group.dataset.category === activeCategory) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
        }
        
        // Hide the no results message
        noResultsMessage.style.display = 'none';
    }
    
    // Highlight Text Function
    function highlightText(text, term) {
        const escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        
        const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }
    
    // Initialize live chat button
    const liveChatBtn = document.querySelector('.contact-option-card .btn');
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', () => {
            // This would normally open a chat widget
            // For now, we'll just show an alert
            alert('Live chat feature coming soon!');
        });
    }
    
    // Optional: Add analytics tracking for FAQ usage
    function trackFAQUsage(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track FAQ item clicks for analytics
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const questionText = question.textContent.trim();
        
        question.addEventListener('click', () => {
            trackFAQUsage('FAQ', 'Question Clicked', questionText);
        });
    });
    
    // Track category filter usage
    faqCategoryBtns.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            trackFAQUsage('FAQ', 'Category Filter', category);
        });
    });
    
    // Track search usage
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                trackFAQUsage('FAQ', 'Search', searchTerm);
            }
        });
    }
});