# ChatGPT with Pulze AI Integration

This project demonstrates how to build a simple chat application using Pulze AI's API, which is compatible with OpenAI's GPT models. The chat application allows users to interact with an AI model through a web interface.

## Getting Started

Follow these steps to get the application running on your local machine.

### Prerequisites

- Git
- Node.js and npm
- A Pulze AI account and an AI Project set up

### Setup Instructions

1. **Clone the Repository**

   First, clone the examples repository from Pulze AI to your local machine:

   ```sh
   git clone git@github.com:pulzeai/examples.git
   ```


2. **Set Up Pulze AI Project**

Sign up on [Pulze Platform](https://platform.pulze.ai) and create an AI Project. This will provide you with a `PULZE_API_KEY`. For guidance on setting up your project, you can follow the [example tutorial](https://docs.pulze.ai/tutorials/building-a-simple-app-with-Pulze).

Feel free to customize your AI Project, including the model used and optimization preferences (speed, quality, or latency). We recommend using Groq for speed optimization.

3. **Configure API Key**

Add your `PULZE_API_KEY` to the `.env` file in the project directory. Since Pulze AI is backwards compatible with OpenAI, you can use the `OPENAI_API_KEY` environment variable for simplicity.

.env file:
```sh
OPENAI_API_KEY=your_pulze_api_key_here
```


4. **Install Dependencies**

Change into the `demos/chatgpt-router` directory within the cloned repository and run the following command to install the necessary Node.js dependencies:

```sh
cd examples/demos/chatgpt-router
npm install
```


5. **Run the Application**

Start the application by running:

```sh
npm start
```

The application will be accessible at `localhost:3000`.


6. **Interact and Customize**

Access the application in your web browser and start chatting with the AI. You can further customize your experience by modifying your AI Project settings on the [Pulze Platform](https://platform.pulze.ai). This includes adding or removing models, adjusting prompts, and tweaking other settings.

## Have Fun!

Explore the capabilities of Pulze AI and enjoy interacting with your customized AI chat application.
