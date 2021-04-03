# Snake Game
This is the well known snake game. It was created with ReactJS and CSS, with no additional libraries. 
It stores the snake's position as an array, and is constantly moved every 125 milliseconds. When the 
snake 'eats' the food-cell, it 'unshifts' the array, and adds the position to the front. To make it move 
normally, it adds the next position to the front, and pops the last element in the array.
