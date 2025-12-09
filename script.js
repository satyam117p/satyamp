// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing animation for role text
const roles = ['Electrical Engineer', 'O Level Student', 'Graphics Designer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const roleText = document.getElementById('roleText');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => {
            isDeleting = true;
            typeRole();
        }, pauseTime);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeRole, speed);
}

// Start typing animation
typeRole();

// Comment Form Handler
document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const message = document.getElementById('userMessage').value;
    
    const comment = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
    };
    
    let comments = JSON.parse(localStorage.getItem('portfolioComments')) || [];
    comments.unshift(comment);
    localStorage.setItem('portfolioComments', JSON.stringify(comments));
    
    displayComments();
    this.reset();
    alert('Message sent successfully! Thank you for reaching out!');
});

// Display comments function
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    const comments = JSON.parse(localStorage.getItem('portfolioComments')) || [];
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No messages yet. Be the first to say hello!</div>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${comment.name}</span>
                <span class="comment-time">${comment.timestamp}</span>
            </div>
            <div class="comment-text">${comment.message}</div>
        </div>
    `).join('');
}

// Load comments on page load
displayComments();