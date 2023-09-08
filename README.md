# Ingredient Mixer

Ingredient Mixer is a web application that assists users in generating recipes based on the ingredients they have. Instead of trying to figure out what to cook, let Ingredient Mixer do the thinking for you!

Live Preview: [http://recipe.williamphk.com/](http://recipe.williamphk.com/) (hosted on AWS EC2)

## Features

- **Grocery List Input**: Seamlessly add individual ingredients to your list. Our integrated autocompletion API assists you in this process, making it smooth and error-free.
- **Recipe Generation**: Leveraging Google's Large Language Model - PaLM 2, DiscountDish can craft recipes tailored to the ingredients you've listed. Let our AI handle the brainstorming!
- **Data Validation**: The data validation system, powered by express-validator, ensures the validity of your input. You can be sure that every ingredient you add is validated and error-free.
- **Clean and Intuitive UI**: Easily navigate and understand the application.

## Installation

1. Clone the repository:
```
git clone https://github.com/williamphk/Ingredient-Mixer.git
```
2. Navigate to the project directory:
```
cd Ingredient-Mixer
```
3. Install the necessary dependencies:
```
npm install
```
4. Start the server:
```
npm start
```

## Usage

1. Add individual ingredients through the main page.
2. View the list of added ingredients.
3. Generate recipes based on the ingredients you have!

## Acknowledgments

- Openrouter API for recipe generation.
- Datamuse API for autocompletion.


