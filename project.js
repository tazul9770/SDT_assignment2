let drinkCount = 0;

const loadAllProduct = () => {
  document.getElementById('handleAdd').addEventListener('click', () => {
    const searchValue = document.getElementById('search-box').value.trim();
    const productContainer = document.getElementById('product-container');
    const detailsContainer = document.getElementById('food-details');
    
    if (searchValue === '') {
      alert('Please enter a drink name!');
      return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`)
      .then(res => res.json())
      .then(data => {
        if (data.drinks) {
          displayProduct(data.drinks);
          detailsContainer.classList.add('hidden');
        } else {
          productContainer.innerHTML = '<p class="error-message">No drinks found!</p>';
        }
      })
      .catch(err => {
        console.log("Error:", err);
      });
  });
};

const loadRandomDrinks = (count = 10) => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`).then(res => res.json()));
  }

  Promise.all(promises)
    .then(results => {
      const drinks = results.map(r => r.drinks[0]);
      displayProduct(drinks);
    })
    .catch(err => console.log("Error:", err));
};

const displayProduct = (drinks) => {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';

  drinks.forEach(drink => {
    const div = document.createElement('div');
    div.classList.add('cart');

    div.innerHTML = `
      <img class="imag" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <h3>${drink.strDrink}</h3>
      <button onclick="addToCart('${drink.strDrink}', '${drink.idDrink}')">Add to cart</button>
      <button onclick="showDetails('${drink.idDrink}')">Details</button>
    `;

    productContainer.appendChild(div);
  });
};

const addToCart = (name, id) => {
  if (drinkCount >= 7) {
    alert('Cannot add more than 7 drinks to the group!');
    return;
  }

  const cartContainer = document.getElementById('cart-main-container');
  const div = document.createElement('div');
  div.classList.add('cart-details');

  div.innerHTML = `
    <span>${name} added</span>
  `;

  cartContainer.appendChild(div);
  drinkCount++;
  document.getElementById('drink-count').innerText = drinkCount;
  document.getElementById('total-drinks').innerText = drinkCount;
};

const showDetails = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.drinks && data.drinks.length > 0) {
        const drink = data.drinks[0];
        const detailsContainer = document.getElementById('food-details');
        detailsContainer.classList.remove('hidden');

        detailsContainer.innerHTML = `
          <img class="images" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
          <h3>${drink.strDrink}</h3>
          <p><strong>Category:</strong> ${drink.strCategory}</p>
          <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        `;
      }
    });
};

loadAllProduct();        
loadRandomDrinks(12);   
