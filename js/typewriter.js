function createTypewriterEffect(element, textArray, options = {loop: false, delay: 50, cursor: ""}) {
    // Error Handling
    if (!element) {
        console.error(`Element not found.`);
        return;
    }
   
    // Initialize the typewriter effect for the given element
    const typewriter = new Typewriter(element, options);
  
    // Loop through each line of the text array and add it to the typewriter
    textArray.forEach(line => {
        typewriter.typeString(line + "<br>");
    });

    // Start the typewriter animation
    typewriter.start();
}

const storyArr = [
  "  ... (⊙︿⊙) S\n" +
  "    ...(╯︵╰,) <3 </3 ? ! (?) \n" +
  "   | ] ; '' | \n" +
  "    full of... (ಥ﹏ಥ) \n" +
  "   | ] ; '' | \n" +
  "   | ] ; '' | \n" +
  "   | ]  | \n" +
  "   |  '' | (╥﹏╥) \n" +
  "   |  '' | (´。• ᵕ •。`) \n" +
  " ^^^^www^^^ww6^^^^^^w^^^"
];
const anotherStoryArr = [
  "  ... (╯_╰) S\n" +
  "    ...(ಥ_ಥ) <3 </3 ? ! (?) \n" +
  "   | ] ; '' | \n" +
  "    full of... (╥﹏╥) \n" +
  "   | ] ; '' | \n" +
  "   | ] ; '' | \n" +
  "   | ]  | \n" +
  "   |  '' | (っ- ‸ - ς) \n" +
  "   |  '' | (￣︿￣) \n" +
  " ^^^^www^^^ww6^^^^^^w^^^"
];
// Split the text into lines
const storyText = storyArr[0].split("\n");
const anotherStoryText = anotherStoryArr[0].split("\n");
                    
// Remove or comment out these lines since we're no longer using them
// createTypewriterEffect("tree", storyText);
// createTypewriterEffect("tree2", anotherStoryText);