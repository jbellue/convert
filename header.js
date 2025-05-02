document.addEventListener('DOMContentLoaded', () => {
  // Add common CSS and meta tags to the head
  const head = document.head;
  
  // Add viewport meta tag if it doesn't exist
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    head.appendChild(viewport);
  }
  
  // Add charset meta tag if it doesn't exist
  if (!document.querySelector('meta[name="charset"]')) {
    const charset = document.createElement('meta');
    charset.name = 'charset';
    charset.content = 'utf-8';
    head.appendChild(charset);
  }
  
  // Add font stylesheet if it doesn't exist
  if (!document.querySelector('link[href*="fonts.googleapis.com/css?family=Roboto"]')) {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    fontLink.rel = 'stylesheet';
    head.appendChild(fontLink);
  }
  
  // Add main stylesheet if it doesn't exist
  if (!document.querySelector('link[href="style.css"]')) {
    const styleLink = document.createElement('link');
    styleLink.href = 'style.css';
    styleLink.rel = 'stylesheet';
    head.appendChild(styleLink);
  }
  
  // Get current page filename
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  // Create header element
  const header = document.createElement('header');
  header.className = 'site-header';
  
  // Add title
  const title = document.createElement('h1');
  title.className = 'site-title';
  title.textContent = 'Web Tools';
  header.appendChild(title);
  
  // Create navigation
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  
  // Define pages
  const pages = [
    { name: 'Converter', url: 'convert.html' },
    { name: 'Password Generator', url: 'passwordGenerator.html' },
    { name: 'Luhn Checker', url: 'luhn.html' }
  ];
  
  // Create links
  pages.forEach(page => {
    const link = document.createElement('a');
    link.href = page.url;
    link.textContent = page.name;
    
    // Mark active page
    if (
      (filename === page.url) || 
      (filename === '' && page.url === 'convert.html') ||
      (filename === '/' && page.url === 'convert.html')
    ) {
      link.className = 'active';
    }
    
    nav.appendChild(link);
  });
  
  header.appendChild(nav);
  
  // Insert at the beginning of the body
  document.body.insertBefore(header, document.body.firstChild);
});