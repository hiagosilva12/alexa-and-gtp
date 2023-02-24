/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require("ask-sdk-core");
const { Configuration, OpenAIApi } = require("openai");
const keys = require("./Keys");

const config = new Configuration({
  apiKey: keys.OPEN_AI_KEY,
});

const openai = new OpenAIApi(config);

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Bem-vindo, você pode dizer gpt descrição. Vamos lá?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const AskOpenAIIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AskOpenAIIntent"
    );
  },
  async handle(handlerInput) {
    const question = Alexa.getSlotValue(
      handlerInput.requestEnvelope,
      "question"
    );

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const speakOutput =
      response.data.choices[0].text + " O que mais você gostaria de saber?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("algo mais?")
      .getResponse();
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Desculpe, tive problemas para fazer o que você pediu. Por favor, tente novamente.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(AskOpenAIIntentHandler, LaunchRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();
