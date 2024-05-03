# Capture The King Assistant

Capture The King Assistant is a web application built using Next.js. It assists players during their computerized card game of "Schwytaj Króla" (Capture The King) by memorizing revealed fields and analyzing areas where a card with the number five may appear. It then discards fields where this card cannot appear due to overlapping and non-overlapping fields, as well as the cards revealed so far. Additionally, it estimates the probability of a card with the number five appearing in the candidate fields.

## Features

- **Field Memorization**: The application remembers the fields revealed during the game.
- **Card Analysis**: It analyzes the possible areas where a card with the number five can appear.
- **Field Discarding**: Based on the analysis, it discards fields where the card with the number five cannot appear.
- **Probability Estimation**: It estimates the likelihood of a card with the number five appearing in the candidate fields.

## Access the Application

The Capture The King Assistant application is available at [https://capture-the-king.vercel.app/](https://capture-the-king.vercel.app/).

## Getting Started

To get started with Capture The King Assistant, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Run the development server using `npm run dev`.
4. Open your web browser and navigate to `http://localhost:3000`.

## Usage

1. Start a new game of "Schwytaj Króla".
2. As you reveal fields during the game, input them into the application to memorize.
3. The application will analyze and suggest areas where the card with the number five might appear, along with the probability of its occurrence.
4. Use this information to make strategic decisions during the game.

## Contributing

Contributions are welcome! If you'd like to contribute to Capture The King Assistant, please fork the repository and submit a pull request with your changes.

## License

All Rights Reserved. This project is protected by copyright and prohibits copying, modifying, or distributing the source code without prior consent from the owner.

For inquiries regarding the use of this software, please contact [Marcin Farowski](mailto:m.farowski@gmail.com).
