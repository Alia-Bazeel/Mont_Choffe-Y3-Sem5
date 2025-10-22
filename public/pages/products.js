// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // Select all "Add to Cart" buttons inside product cards
  const buttons = document.querySelectorAll(".product-card button");

  // Loop through each button
  buttons.forEach(button => {
    
    // Adding a click event listener to each button
    button.addEventListener("click", () => {
      
      // Show an alert (placeholder for future cart functionality)
      alert("Added to cart!");
    });
  });
});
