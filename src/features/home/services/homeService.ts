export async function fetchRecipes() {
    // In a real project:
    // const response = await fetch('https://api.example.com/recipes');
    // return await response.json();
  
    // Mock data for illustration:
    return Promise.resolve([
      { id: '1', title: 'Margherita Pizza', cookTime: 15 },
      { id: '2', title: 'Pasta Bolognese', cookTime: 30 },
      { id: '3', title: 'Tacos Al Pastor', cookTime: 20 }
    ]);
  }