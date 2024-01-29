# [Käsekästchen](https://benschaf.github.io/kaesekaestchen)

Käsekästchen (German for: dots and boxes) is a web app that allows users to play the game of Käsekästchen online. The game is played on a grid of dots, where two players take turns drawing lines between the dots. The goal is to complete a square by drawing the fourth line around it. The player who completes the most squares wins the game.

The deployed site can be found [here](https://benschaf.github.io/kaesekaestchen)

![responsive-image from amiresponsive](documentation/responsive-image.png)

## UX
### User Persona
The target audience for this web app is anyone who wants to play a fun and easy to learn game online. It's possible to play the game for 5 Minutes but if someone wants to play for longer, they can adjust the size of the grid to make the game more complex. The game is single player, so no second player is required. The game is also playable on mobile devices, so it can be played on the go (although a grid larger than 4x4 is not recommended on mobile devices).

### Colour Scheme
This web app is displayed in a dark theme. The colour scheme adheres to the [Material Design 2 Dark Theme guidelines](https://m2.material.io/design/color/dark-theme.html). This provides a familiar experience for users who are used to the dark theme on their devices. The dark theme also reduces eye strain which enables users to play the game for longer periods of time. The colours used are:

- `#121212` used for dark background
- `#1E1E1E` used for card background
- `#03DAC6` used for primary highlights
- `#FFFFFF` used for primary text
- `#A5A5A5` used for secondary text
- `#BAFC86` used for player colour
- `#BB86FC` used for AI colour

The player colour is a green colour, while the AI colour is a purple colour. These colours are used throughout the website to differentiate between the two players.

I've used CSS :root variables to easily update the global colour scheme by changing only one value, instead of everywhere in the CSS file:

```css
:root {
    /* p = Primary / s = Secondary */
    --dark-backgorund: #121212;
    --card-background: #1E1E1E;
    --p-highlight: #03DAC5;
    --p-highlight-transparent: rgba(3, 218, 197, 0.8);
    --p-text: #FFFFFF;
    --s-text: #A5A5A5;
    --player-color: #BAfC86;
    --ai-color: #BB86FC;
}
```
The `--p-highlight-transparent` variable is used for the hover effect on buttons.

I used the [coolors.co](https://coolors.co/) tool to visualize the colour scheme:
![coolors-theme](documentation/coolors-theme.png)

#### Accessibility for colours
The colours used in the web app are accessible for users with colour blindness. The colour scheme was tested using the [Colorable](https://colorable.jxnblk.com/) tool. The colour scheme was also tested using the [Contrast Checker](https://contrastchecker.com/) tool. The results can be found below:

### Layout
The layout of the website also adheres to the [Material Design 2 Dark Theme guidelines](https://m2.material.io/design/color/dark-theme.html). The Layout is based on cards. The cards are used to group related content together. 

#### Information Architecture
The cards are also used to create a visual hierarchy.
- The biggest card is the **gameboard**, making it the main focus of the website. 
- The card on the top left is the **score card**, which is the second most important card. 
- The **options card** is the third most important card and always appears below or after the score card. 
- The **instructions card** is only visible upon scrolling down or clicking on the "How to Play" button in the header.

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
The wireframes were created using [draw.io](https://www.drawio.com/). The mockups were created using [Figma](https://figma.com). The mockups were created after the wireframes to visualize the design of the website. The mockups were used as a reference during development.

Some of the design was finalized while implementing it in code. The final design differs slightly from the mockups. The final design can be found in the [Features](#features) section.

| Device | Wireframe | Figma Mockup |
|-|-|-|
| Phone | ![wireframe-phone](documentation/wireframe-phone.png) | ![figma-phone](documentation/figma-phone.png) |
| Tablet | ![wireframe-tablet](documentation/wireframe-tablet.png) | ![figma-tablet](documentation/figma-tablet.png) |
| Desktop | ![wireframe-desktop](documentation/wireframe-desktop.png) | ![figma-desktop](documentation/figma-desktop.png) |

## Features

### Existing Features

#### Logo and Heading
Featured at the top of the page, the Käsekästchen typography logo is easy to see for the user. Upon viewing the page, the user will be able to see the name of the game. The how to play button is displayed on the right side of the display. This button will scroll the user down to the instructions section.

![feature-logo](documentation/feature-logo.png)

#### Gameboard
This section will allow the user to play the Käsekästchen game. The user will be able to easily see the grid of dots and draw lines between them by clicking on a disabled line. When a box is completed, the box will be automatically filled with the active players colour. Once all boxes are completed, the game will end and a message will be displayed to the user. A new game can then be started by clicking on the "Start New Game" button in the options area.

![feature-gameboard](documentation/feature-gameboard.png)

#### AI Opponent
The AI opponent is implemented in the game logic and will play against the user. The AI opponent will play a random move on the "Easy" difficulty level. The "Medium" difficulty follows an algorithm. Check it out in the code comments in the !!Link TO FILE!! file. The "Hard" difficulty is currently disabled and in development.


#### Score Card
This section will allow the user to see exactly how many squares they have completed and how many squares their opponent has completed, indicating who is winning. The Score Card will also display the name of the player and the difficulty level of the AI. Lastly it indicates whose turn it is by colouring the background of the active player's name and score.

![feature-scorecard](documentation/feature-scorecard.png)

#### Options Area
This section allows the user to customize their game experience. The options available are:

- ***Player Name:*** The user can input their desired name.
- ***Turn Choice:*** The user can choose who goes first - the player or the AI.
- ***AI Difficulty:*** The user can select the difficulty level of the AI. The options are "Easy", "Medium", and "Hard". Note that the "Hard" option is currently disabled and in development.
- ***Grid Size:*** The user can adjust the size of the grid using a range input. The minimum size is 2x2 and the maximum size is 8x8. The default size is 3x3.
- ***Start New Game:*** The user can start a new game by clicking on the "Start New Game" button.

![feature-options](documentation/feature-options.png)

#### Instructions
This section will allow the user to read the instructions on how to play the game. The user can click on the "How to Play" button in the header to scroll down to this section.

![feature-instructions](documentation/feature-instructions.png)

#### Footer
This section will allow the user to see copyright information. The footer also contains links to the developer's GitHub and LinkedIn profiles.

![feature-footer](documentation/feature-footer.png)

#### Background Blur Design elements
The background blur design elements are used to create a more interesting and playful design. The background blur elements are used behind the header and the footer. When the game is played, more backgorund blur elements are generated behind the gameboard. These elements are coloured after the player colours, depending on who completed which box.

![feature-background-blur](documentation/feature-background-blur.png)

#### Responsiveness
The website is fully responsive on all devices. This is acheived using media queries and CSS Grid and Flexbox for most of the layout. 

The gameboard is responsive using JavaScript. Each DOM element of the gameboard is individually created and resized depending on the size of the viewport. The gameboard is also responsive to the size of the grid. The grid size can be adjusted by the user in the options area. The gameboard will then be resized accordingly. Note that on mobile devices, a grid size larger than 4x4 is not recommended.

![responsive-image from amiresponsive](documentation/responsive-image.png)

#### Single Page Application
The website is a single page application. This means that the user can play the game without having to reload the page. The user can also change the game settings without having to reload the page. This is achieved using JavaScript and DOM manipulation.

### Future Features

#### Proposed Future User stories
|As a|I would like to|so that I can|
|----|----|----|
|User|select the number of players|play against my friends|
|User|see the leaderboard|see who is the best player|
|User|play against a harder AI|challenge myself|
|User|display the game in a light theme|play in a light theme|

#### Proposed Future Features

**Multiplayer:** Allow users to play against each other online.

**Leaderboard:** Implement a leaderboard that shows the top players.

**Harder AI:** Implement a harder AI that can play against the user.

**Light Theme:** Implement a light theme for users who prefer a light theme.


## Tools & Technologies Used
- [JavaScript](https://en.wikipedia.org/wiki/JavaScript) used for the game logic and some of the responsive design
- [HTML](https://en.wikipedia.org/wiki/HTML) used for the main site content
- [CSS](https://en.wikipedia.org/wiki/CSS) used for the main site design and layout
- [CSS Flexbox](https://www.w3schools.com/css/css3_flexbox.asp) used for an enhanced responsive layout
- [CSS Grid](https://www.w3schools.com/css/css_grid.asp) used for an enhanced responsive layout
- [Git](https://git-scm.com/) used for version control (`git add`, `git commit`, `git push`)
- [GitHub](https://github.com/) used for secure online code storage
- [GitHub Pages](https://pages.github.com/) used for hosting the deployed front-end site
- [Github Issues](https://github.com/benschaf/kaesekaestchen/issues) used for issue tracking
- [GitHub Projects](https://github.com/users/benschaf/projects/3) used for project management in conjunction with GitHub Issues
- [Gitpod](https://gitpod.io/) used as a cloud-based IDE for development
- [Visual Studio Code](https://visualstudio.microsoft.com/de/#vscode-section) used a  local IDE for development
- [draw.io](https://www.drawio.com/) used for wireframe creation
- [Figma](https://figma.com) used for design creation
- [Windows Snipping Tool](https://support.microsoft.com/de-de/windows/aufnehmen-von-screenshots-mithilfe-des-snipping-tools-00246869-1843-655f-f220-97299b865f6b) used to take screenshots and screencasts on Windows
- [Adobe free mp4 to gif converter](https://www.adobe.com/express/feature/video/convert/mp4-to-gif) used to convert screencasts to gif

Still to be used:
- [autoprefixer](https://autoprefixer.github.io/) used to add vendor prefixes to css for browser compatibility

## Testing
Code Validation and Testing can be found in a separate file called [TESTING.md](TESTING.md)

## Deployment
The site was deployed to GitHub Pages. The steps to deploy are as follows:

- In the [GitHub repository](https://github.com/benschaf/kaesekaestchen), navigate to the Settings tab 
- From the source section drop-down menu, select the **Main** Branch, then click "Save".
- The page will be automatically refreshed with a detailed ribbon display to indicate the successful deployment.

The live link can be found [here](https://benschaf.github.io/kaesekaestchen)

### Local Deployment

This project can be cloned or forked in order to make a local copy on your own system.

#### Cloning

You can clone the repository by following these steps:

1. Go to the [GitHub repository](https://github.com/benschaf/kaesekaestchen) 
2. Locate the Code button above the list of files and click it 
3. Select if you prefer to clone using HTTPS, SSH, or GitHub CLI and click the copy button to copy the URL to your clipboard
4. Open Git Bash or Terminal
5. Change the current working directory to the one where you want the cloned directory
6. In your IDE Terminal, type the following command to clone my repository:
	- `git clone https://github.com/benschaf/kaesekaestchen.git`
7. Press Enter to create your local clone.

Alternatively, if using Gitpod, you can click below to create your own workspace using this repository.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/benschaf/kaesekaestchen)

Please note that in order to directly open the project in Gitpod, you need to have the browser extension installed.
A tutorial on how to do that can be found [here](https://www.gitpod.io/docs/configure/user-settings/browser-extension).

#### Forking

By forking the GitHub Repository, we make a copy of the original repository on our GitHub account to view and/or make changes without affecting the original owner's repository.
You can fork this repository by using the following steps:

1. Log in to GitHub and locate the [GitHub Repository](https://github.com/benschaf/kaesekaestchen)
2. At the top of the Repository (not top of page) just above the "Settings" Button on the menu, locate the "Fork" Button.
3. Once clicked, you should now have a copy of the original repository in your own GitHub account!

## Credits

### Content
| Source | Location | Notes |
| --- | --- | --- |

### Media
| Source | Location | filename | Notes |
| --- | --- | --- | --- |
|[Fontawesome](https://fontawesome.com) | Footer | various icons | icons used: fa-github, fa-linkedin |
|[Material Design 2](https://m2.material.io/design/color/dark-theme.html) | Colour Scheme and Design | N/A | used for design guidelines |

### Acknowledgements
- I would like to thank my Code Institute mentor, [Tim Nelson](https://tim.2bn.dev/) for his support throughout the development of this project.
- I would like to thank the [Code Institute](https://codeinstitute.net/) tutor team for their assistance with troubleshooting and debugging some project issues.
- I would like to thank the Code Institute Slack community for the moral support; it kept me going during periods of self doubt and imposter syndrome.
- I would like to thank my wife Maria, for believing in me, and allowing me to make this transition into software development.
