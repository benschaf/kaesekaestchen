# Käsekästchen

Käsekästchen (German for: dots and boxes) is a web app that allows users to play the game of Käsekästchen online. The game is played on a grid of dots, where two players take turns drawing lines between the dots. The goal is to complete a square by drawing the fourth line around it. The player who completes the most squares wins the game.

## UX

### Colour Scheme
This web app is displayed in a dark theme. The colour scheme adheres to the [Material Design 2 Dark Theme guidelines](https://m2.material.io/design/color/dark-theme.html). This provides a familiar experience for users who are used to the dark theme on their devices. The dark theme also reduces eye strain which enables users to play the game for longer periods of time. The colours used are:

- `#121212` used for dark background
- `#1E1E1E` used for card background
- `#03DAC6` used for primary highlights
- `#FFFFFF` used for primary text
- `#A5A5A5` used for secondary text
- `#BAFC86` used for player color
- `#BB86FC` used for AI color

The player colour is a green colour, while the AI colour is a purple colour. These colours are used throughout the website to differentiate between the two players.

I've used CSS :root variables to easily update the global colour scheme by changing only one value, instead of everywhere in the CSS file:

```css
:root {
    /* p = Primary / s = Secondary */
    --dark-backgorund: #121212;
    --card-background: #1E1E1E;
    --p-highlight: #03DAC6;
    --p-highlight-transparent: rgba(3, 218, 198, 0.8);
    --p-text: #FFFFFF;
    --s-text: #A5A5A5;
    --player-color: #BAfC86;
    --ai-color: #BB86FC;
}
```
The `--p-highlight-transparent` variable is used for the hover effect on buttons.


### Typography
- [Nunito](https://fonts.google.com/specimen/Nunito) was used for all text on the website. This font was chosen because of its playful roundness, which fits the theme and style of the game.
- [Font Awesome](https://fontawesome.com/) icons were used for the icons in the footer.

## User Stories

|As a|I would like to|so that I can|
|----|----|----|
|User|play a fun game|spend some time|
|User|play the game on different devices|play on my preferred device|
|User|select the size of the grid|customize the game to my liking|
|User|see the scores of both players|know who is winning|
|User|change my player name|personalize my game experience|
|User|choose who goes first in the game|strategize my game play|
|User|select the AI difficulty level|adjust the game to my skill level|
|User|adjust the size of the grid|control the complexity of the game|
|User|restart the game|play again|
|User|read the game instructions|understand how to play the game|

*Note: User stories that aren't in the scope of this version can be found under Future Features.*

## Wireframes / Mockups

| Device | Wireframe | Figma Mockup |
|-|-|-|
| Phone | ![wireframe-phone](documentation/wireframe-phone.png) | ![figma-phone](documentation/figma-phone.png) |
| Tablet | ![wireframe-tablet](documentation/wireframe-tablet.png) | ![figma-tablet](documentation/figma-tablet.png) |
| Desktop | ![wireframe-desktop](documentation/wireframe-desktop.png) | ![figma-desktop](documentation/figma-desktop.png) |

## Features

### Logo and Heading:
Featured at the top of the page, the Käsekästchen typography logo is easy to see for the user. Upon viewing the page, the user will be able to see the name of the game. The how to play button is displayed on the right side of the display. This button will scroll the user down to the instructions section.

![feature-logo](documentation/feature-logo.png)

### Gameboard:
This section will allow the user to play the Käsekästchen game. The user will be able to easily see the grid of dots and draw lines between them by clicking on a disabled line. When a box is completed, the box will be automatically filled with the active players colour. Once all boxes are completed, the game will end and a message will be displayed to the user. A new game can then be started by clicking on the "Start New Game" button in the options area.

![feature-gameboard](documentation/feature-gameboard.png)

### AI Opponent:
The AI opponent is implemented in the game logic and will play against the user. The AI opponent will play a random move on the "Easy" difficulty level. The "Medium" difficulty follows an algorithm. Check it out in the code comments in the [game.js](assets/js/game.js) file. The "Hard" difficulty is currently disabled and in development.


### Score Card:
This section will allow the user to see exactly how many squares they have completed and how many squares their opponent has completed, indicating who is winning. The Score Card will also display the name of the player and the difficulty level of the AI. Lastly it indicates whose turn it is by colouring the background of the active player's name and score.

![feature-scorecard](documentation/feature-scorecard.png)

### Options Area:
This section allows the user to customize their game experience. The options available are:

- ***Player Name:*** The user can input their desired name.
- ***Turn Choice:*** The user can choose who goes first - the player or the AI.
- ***AI Difficulty:*** The user can select the difficulty level of the AI. The options are "Easy", "Medium", and "Hard". Note that the "Hard" option is currently disabled and in development.
- ***Grid Size:*** The user can adjust the size of the grid using a range input. The minimum size is 2x2 and the maximum size is 8x8. The default size is 3x3.
- ***Start New Game:*** The user can start a new game by clicking on the "Start New Game" button.

![feature-options](documentation/feature-options.png)

### Instructions:
This section will allow the user to read the instructions on how to play the game. The user can click on the "How to Play" button in the header to scroll down to this section.

![feature-instructions](documentation/feature-instructions.png)

**Footer:** 
This section will allow the user to see copyright information. The footer also contains links to the developer's GitHub and LinkedIn profiles.

![feature-footer](documentation/feature-footer.png)

### Future User stories
|As a|I would like to|so that I can|
|----|----|----|
|User|select the number of players|play against my friends|
|User|see the leaderboard|see who is the best player|
|User|play against a harder AI|challenge myself|
|User|display the game in a light theme|play in a light theme|

### Future Features

**Multiplayer:** Allow users to play against each other online.

**Leaderboard:** Implement a leaderboard that shows the top players.

**Harder AI:** Implement a harder AI that can play against the user.

**Light Theme:** Implement a light theme for users who prefer a light theme.


## Tools & Technologies Used

## Testing
Code Validation and Testing can be found in a separate file called [TESTING.md](TESTING.md)

## Deployment

## Credits

### Content
| Source | Location | Notes |
| --- | --- | --- |

### Media
| Source | Location | filename | Notes |
| --- | --- | --- | --- |

### Acknowledgements
