const textArea = document.getElementById("text_to_summarize");

const submitButton = document.getElementById("submit-button");

const summarizedTextArea = document.getElementById("summary");

textArea.addEventListener("input", verifyTextLength);

submitButton.addEventListener("click", submitData);

// First, we disable the submit button by default when the user loads the website.
submitButton.disabled = true;

// Next, we define a function called verifyTextLength(). This function will be called when the user enters something in the text area. It receives an event, called ‘e’ here
function verifyTextLength(e) {
  // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called ‘textarea’
  const textarea = e.target;

  // Check if the text in the text area is the right length - between 200 and 100,000 characters
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // If it is, we enable the submit button.
    submitButton.disabled = false;
  } else {
    // If it is not, we disable the submit button.
    submitButton.disabled = true;
  }
}

function submitData(e) {
  // Add a loading animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  // Send a POST request to the server
  fetch("/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_to_summarize: text_to_summarize,
    }),
  })
    .then((response) => {
      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Get the raw text
    })
    .then((rawText) => {
      try {
        const data = JSON.parse(rawText); // Try parsing the text as JSON
        summarizedTextArea.value = data.summary; // Update the text area with the summary
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
        summarizedTextArea.value = "Error: Failed to parse the response";
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      summarizedTextArea.value = "Error: " + error.message;
    })
    .finally(() => {
      // Remove the loading animation
      submitButton.classList.remove("submit-button--loading");
    });
}

