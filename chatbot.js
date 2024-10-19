
// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input
  const input = inputField.value;

  // Clear input field
  inputField.value = '';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

  // Add user input to conversation
  let message = document.createElement('div');
  message.classList.add('chatbot-message', 'user-message');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
  conversation.appendChild(message);

  // Generate chatbot response
  const response = generateResponse(input);

  // Add chatbot response to conversation
  message = document.createElement('div');
  message.classList.add('chatbot-message', 'chatbot');
  message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });
});



// Function to calculate Levenshtein distance (edit distance)
function levenshteinDistance(str1 = '', str2 = '') {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return track[str2.length][str1.length];
}

// Function to calculate similarity using Levenshtein distance
function calculateSimilarity(input, intent) {
  const distance = levenshteinDistance(input, intent);
  const maxLength = Math.max(input.length, intent.length);
  return 1 - distance / maxLength; // Convert distance to similarity (0-1 scale)
}

function generateResponse(input) {
  const normalizedInput = input.toLowerCase();
  const intents = {
    donation: [
      "how can I make a donation",
      "how to donate",
      "make a donation",
      "donate",
      "donation process",
    ],
    donationTypes: [
      "types of donations",
      "what kind of donations",
      "what types of donations do you accept",
    ],
    volunteer: [
      "can I volunteer",
      "how can I volunteer",
    ],
    donationReach: [
      "ensure donations reach those in need",
      "how do you ensure the donations reach those in need",
    ],
    donateInName: [
      "donate in someone else's name",
      "can I donate in someone else's name",
    ],
    taxReceipts: [
      "do you offer tax receipts",
      "tax receipts",
      "taxreciept",
    ],
    stayUpdated: [
      "how can I stay updated",
      "how to stay updated",
    ],
    donationImpact: [
      "see the impact of my donation",
      "impact of my donation",
    ],
    someoneInNeed: [
      "what should I do if I know someone in need",
      "someone in need",
    ],
    help: [
      "help",
    ],
    charity: [
      "charity",
      "nonprofit",
    ],
  };

  let bestMatch = { intent: null, score: 0 };

  // Check intents and find the best match based on similarity
  Object.keys(intents).forEach((intent) => {
    intents[intent].forEach((phrase) => {
      const similarity = calculateSimilarity(normalizedInput, phrase);
      if (similarity > bestMatch.score) {
        bestMatch = { intent, score: similarity };
      }
    });
  });

  // Define a response based on the best matching intent
  let response;
  if (bestMatch.score > 0.4) { // Adjust the threshold as needed
    switch (bestMatch.intent) {
      case "donation":
        response = " Just click on the 'Donate Now' button on our homepage.";
        break;
      case "donationTypes":
        response = "We accept donations of food, clothing, and other essentials. Please visit our donation page for specific guidelines.";
        break;
      case "volunteer":
        response = "Absolutely! We are always looking for volunteers. You can find more information on our 'Get Involved' page or contact us for specific opportunities.";
        break;
      case "donationReach":
        response = "We have a rigorous vetting process to identify individuals and families in need. Our team works closely with local organizations to ensure that donations are distributed fairly and effectively.";
        break;
      case "donateInName":
        response = "Yes, you can choose to donate in someone else's name. During the donation process, you can provide the recipient's name and a personalized message.";
        break;
      case "taxReceipts":
        response = "Yes, all donations are tax-deductible. You will receive a tax receipt via email once your donation is processed.";
        break;
      case "stayUpdated":
        response = "You can subscribe to our newsletter or follow us on social media. We regularly share updates on our initiatives and success stories.";
        break;
      case "donationImpact":
        response = "Yes! We provide regular reports and success stories on our website, showcasing how donations are making a difference in the lives of those we help.";
        break;
      case "someoneInNeed":
        response = "Please reach out to us through our contact page, and we can guide you on how to refer them for assistance.";
        break;
      case "help":
        response = "I'm here to assist you! What specific information do you need about donations?";
        break;
      case "charity":
        response = "We're a registered nonprofit organization dedicated to helping those in need. Your donations help us achieve our goals!";
        break;
      default:
        response = "I'm sorry, I didn't understand your question. Could you please rephrase it?";
    }
  } else {
    response = "I'm here to assist you with any questions or concerns you may have. What can I help you with today?";
  }

  return response;
}
