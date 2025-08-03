// Mock data
const mockData = {
  interns: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      referralCode: "JOHN2025",
      donationsRaised: 2500,
      joinDate: "2025-01-15",
      department: "Marketing"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      referralCode: "JANE2025",
      donationsRaised: 3200,
      joinDate: "2025-01-10",
      department: "Development"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      referralCode: "MIKE2025",
      donationsRaised: 1800,
      joinDate: "2025-01-20",
      department: "Design"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      referralCode: "SARAH2025",
      donationsRaised: 2900,
      joinDate: "2025-01-12",
      department: "Operations"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      referralCode: "DAVID2025",
      donationsRaised: 2100,
      joinDate: "2025-01-18",
      department: "Sales"
    }
  ],
  rewards: [
    {
      id: 1,
      title: "Bronze Achiever",
      description: "Raised $1000 in donations",
      threshold: 1000,
      icon: "🥉"
    },
    {
      id: 2,
      title: "Silver Performer",
      description: "Raised $2000 in donations",
      threshold: 2000,
      icon: "🥈"
    },
    {
      id: 3,
      title: "Gold Star",
      description: "Raised $3000+ in donations",
      threshold: 3000,
      icon: "🥇"
    },
    {
      id: 4,
      title: "Team Player",
      description: "Completed first month",
      threshold: 0,
      icon: "👥"
    }
  ],
  departments: ["Marketing", "Development", "Design", "Operations", "Sales", "HR", "Finance"]
};
const API_BASE = "https://intern-portal-gmou.onrender.com/api";

// Application state
let currentUser = null;
let currentPage = 'auth';

// DOM elements
const pages = {
  auth: document.getElementById('auth-page'),
  dashboard: document.getElementById('dashboard-page'),
  leaderboard: document.getElementById('leaderboard-page')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  checkAuthStatus();
});

function initializeApp() {
  // Set up tab navigation
  setupTabNavigation();
  // Set up page navigation
  setupPageNavigation();
  // Set up mobile menu
  setupMobileMenu();
}

function setupEventListeners() {
  // Auth forms
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('signup-form').addEventListener('submit', handleSignup);
  
  // Navigation links
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });
  
  // Copy referral code
  document.getElementById('copy-referral').addEventListener('click', copyReferralCode);
  
  // Mobile menu overlay
  document.querySelector('.nav-mobile-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      closeMobileMenu();
    }
  });
}

function setupTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Update active states
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
      
      // Clear error messages
      document.querySelectorAll('.auth-error').forEach(error => {
        error.classList.add('hidden');
      });
    });
  });
}

function setupPageNavigation() {
  // Initial page setup is handled by checkAuthStatus
}

function setupMobileMenu() {
  const mobileToggle = document.querySelectorAll('.nav-mobile-toggle');
  const mobileOverlay = document.querySelectorAll('.nav-mobile-overlay');
  
  mobileToggle.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const overlay = this.closest('.page').querySelector('.nav-mobile-overlay');
      overlay.classList.toggle('hidden');
      overlay.classList.toggle('show');
    });
  });
}

function closeMobileMenu() {
  document.querySelectorAll('.nav-mobile-overlay').forEach(overlay => {
    overlay.classList.add('hidden');
    overlay.classList.remove('show');
  });
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorElement = document.getElementById('login-error');
  
  // Clear previous errors
  errorElement.classList.add('hidden');
  
  // Basic validation
  if (!email || !password) {
    showError(errorElement, 'Please fill in all fields');
    return;
  }
  
  // Mock authentication - check if user exists
  const user = mockData.interns.find(intern => intern.email === email);
  
  if (!user) {
    showError(errorElement, 'Invalid email or password');
    return;
  }
  
  // Successful login
  currentUser = user;
  saveAuthStatus();
  showToast('Login successful!');
  navigateToPage('dashboard');
  loadDashboardData();
}

function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const department = document.getElementById('signup-department').value;
  const password = document.getElementById('signup-password').value;
  const errorElement = document.getElementById('signup-error');
  
  // Clear previous errors
  errorElement.classList.add('hidden');
  
  // Basic validation
  if (!name || !email || !department || !password) {
    showError(errorElement, 'Please fill in all fields');
    return;
  }
  
  // Check if user already exists
  if (mockData.interns.find(intern => intern.email === email)) {
    showError(errorElement, 'User with this email already exists');
    return;
  }
  
  // Create new user
  const newUser = {
    id: mockData.interns.length + 1,
    name: name,
    email: email,
    department: department,
    referralCode: generateReferralCode(name),
    donationsRaised: 0,
    joinDate: new Date().toISOString().split('T')[0]
  };
  
  // Add to mock data
  mockData.interns.push(newUser);
  
  // Successful signup
  currentUser = newUser;
  saveAuthStatus();
  showToast('Account created successfully!');
  navigateToPage('dashboard');
  loadDashboardData();
}

function generateReferralCode(name) {
  const firstName = name.split(' ')[0].toUpperCase();
  const year = new Date().getFullYear();
  return `${firstName}${year}`;
}

function handleNavigation(e) {
  e.preventDefault();
  const targetPage = e.target.dataset.page;
  
  if (targetPage === 'dashboard') {
    navigateToPage('dashboard');
    loadDashboardData();
  } else if (targetPage === 'leaderboard') {
    navigateToPage('leaderboard');
    loadLeaderboardData();
  }
  
  // Update active nav states
  updateNavActiveStates(targetPage);
  closeMobileMenu();
}

function updateNavActiveStates(activePage) {
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === activePage) {
      link.classList.add('active');
    }
  });
}

function navigateToPage(pageName) {
  // Hide all pages
  Object.values(pages).forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  if (pages[pageName]) {
    pages[pageName].classList.add('active');
    currentPage = pageName;
  }
}

function handleLogout() {
  currentUser = null;
  clearAuthStatus();
  navigateToPage('auth');
  showToast('Logged out successfully');
  
  // Reset forms
  document.getElementById('login-form').reset();
  document.getElementById('signup-form').reset();
  
  // Clear errors
  document.querySelectorAll('.auth-error').forEach(error => {
    error.classList.add('hidden');
  });
}

function loadDashboardData() {
  if (!currentUser) return;
  
  // Update welcome message
  document.getElementById('welcome-text').textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
  
  // Update profile card
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-department').textContent = currentUser.department;
  document.getElementById('profile-join-date').textContent = formatDate(currentUser.joinDate);
  
  // Update referral code
  document.getElementById('referral-code').textContent = currentUser.referralCode;
  
  // Update donations
  const donationsAmount = document.getElementById('donations-amount');
  const progressFill = document.getElementById('progress-fill');
  const progressPercentage = document.getElementById('progress-percentage');
  
  donationsAmount.textContent = `$${currentUser.donationsRaised.toLocaleString()}`;
  
  const goalAmount = 5000;
  const percentage = Math.min((currentUser.donationsRaised / goalAmount) * 100, 100);
  progressFill.style.width = `${percentage}%`;
  progressPercentage.textContent = `${Math.round(percentage)}%`;
  
  // Load rewards
  loadRewards();
}

function loadRewards() {
  const rewardsGrid = document.getElementById('rewards-grid');
  rewardsGrid.innerHTML = '';
  
  mockData.rewards.forEach(reward => {
    const isUnlocked = currentUser.donationsRaised >= reward.threshold;
    
    const rewardElement = document.createElement('div');
    rewardElement.className = `reward-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    rewardElement.innerHTML = `
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-title">${reward.title}</div>
      <div class="reward-description">${reward.description}</div>
    `;
    
    rewardsGrid.appendChild(rewardElement);
  });
}

function loadLeaderboardData() {
  const tbody = document.getElementById('leaderboard-tbody');
  tbody.innerHTML = '';
  
  // Sort interns by donations (descending)
  const sortedInterns = [...mockData.interns].sort((a, b) => b.donationsRaised - a.donationsRaised);
  
  sortedInterns.forEach((intern, index) => {
    const rank = index + 1;
    const isCurrentUser = currentUser && intern.id === currentUser.id;
    
    const row = document.createElement('tr');
    row.className = isCurrentUser ? 'current-user' : '';
    
    const rankBadge = getRankBadge(rank);
    
    row.innerHTML = `
      <td class="rank-cell">${rankBadge}</td>
      <td>${intern.name}</td>
      <td>${intern.department}</td>
      <td class="donation-amount">$${intern.donationsRaised.toLocaleString()}</td>
    `;
    
    tbody.appendChild(row);
  });
}

function getRankBadge(rank) {
  let badgeClass = 'default';
  if (rank === 1) badgeClass = 'gold';
  else if (rank === 2) badgeClass = 'silver';
  else if (rank === 3) badgeClass = 'bronze';
  
  return `<span class="rank-badge ${badgeClass}">${rank}</span>`;
}

function copyReferralCode() {
  const referralCode = document.getElementById('referral-code').textContent;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(referralCode).then(() => {
      showToast('Referral code copied to clipboard!');
    }).catch(() => {
      fallbackCopyTextToClipboard(referralCode);
    });
  } else {
    fallbackCopyTextToClipboard(referralCode);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showToast('Referral code copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy referral code');
  }
  
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function saveAuthStatus() {
  if (currentUser) {
    // In a real app, you'd use proper session management
    // For demo purposes, we'll use a simple flag
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('currentUserId', currentUser.id.toString());
  }
}

function clearAuthStatus() {
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('currentUserId');
}

function checkAuthStatus() {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  const userId = sessionStorage.getItem('currentUserId');
  
  if (isAuthenticated && userId) {
    // Find the user in mock data
    const user = mockData.interns.find(intern => intern.id === parseInt(userId));
    if (user) {
      currentUser = user;
      navigateToPage('dashboard');
      loadDashboardData();
      return;
    }
  }
  
  // Not authenticated, show auth page
  navigateToPage('auth');
}