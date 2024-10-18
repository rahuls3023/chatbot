// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
  // Prevent form submission
  event.preventDefault();

  // Get user input and current time
  const input = inputField.value.trim();
  if (input === "") return;  // Skip empty inputs
  inputField.value = '';

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user input to conversation
  addMessageToConversation(input, 'user-message', userTime);

  // Generate chatbot response
  const response = generateResponse(input);
  const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add chatbot response to conversation after a short delay to mimic typing
  setTimeout(() => {
    addMessageToConversation(response, 'chatbot', botTime);
  }, 600); // Delay for realism (in milliseconds)
});

// Function to add message to the conversation
function addMessageToConversation(text, className, time) {
  const message = document.createElement('div');
  message.classList.add('chatbot-message', className);
  message.innerHTML = `<p class="chatbot-text" sentTime="${time}">${text}</p>`;
  conversation.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });
}

// Response generation based on predefined intents
function generateResponse(input) {
  const normalizedInput = input.toLowerCase();
  const intents = {
    donation: ["how can i make a donation", "how to donate", "make a donation", "donate", "donation process"],
    donationTypes: ["types of donations", "what kind of donations", "what types of donations do you accept"],
    volunteer: ["can i volunteer", "how can i volunteer"],
    donationReach: ["ensure donations reach those in need", "how do you ensure the donations reach those in need"],
    donateInName: ["donate in someone else's name", "can i donate in someone else's name"],
    taxReceipts: ["do you offer tax receipts", "tax receipts"],
    stayUpdated: ["how can i stay updated", "how to stay updated"],
    donationImpact: ["see the impact of my donation", "impact of my donation"],
    someoneInNeed: ["what should i do if i know someone in need", "someone in need"],
    help: ["help"],
    charity: ["charity", "nonprofit"],
  };

  let response = "I'm here to assist you with any questions or concerns you may have. What can I help you with today?";

  // Check against each intent
  Object.keys(intents).forEach((intent) => {
    if (intents[intent].some((phrase) => normalizedInput.includes(phrase))) {
      switch (intent) {
        case "donation":
          response = "Just click on the 'Donate Now' button on our homepage.";
          break;
        case "donationTypes":
          response = "We accept donation of food, clothing, and other essentials. Please visit our donation page for specific guidelines.";
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
      }
    }
  });

  return response;
}
