document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('addItemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemList = document.getElementById('itemList');
  
    // Function to fetch and display items
    const fetchItems = async () => {
      const response = await fetch('/items');
      const items = await response.json();
  
      // Clear the existing list
      itemList.innerHTML = '';
  
      // Display each item in the list
      items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = item.name;
        itemList.appendChild(listItem);
      });
    };
  
    // Function to handle form submission and add a new item
    const handleAddItem = async (event) => {
      event.preventDefault();
  
      const itemName = itemNameInput.value;
  
      if (itemName.trim() !== '') {
        // Make a POST request to add a new item
        await fetch('/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: itemName }),
        });
  
        // Fetch and display updated items
        fetchItems();
  
        // Clear the input field
        itemNameInput.value = '';
      }
    };
  
    // Attach event listeners
    addItemForm.addEventListener('submit', handleAddItem);
  
    // Initial fetch and display of items
    fetchItems();
  });
  