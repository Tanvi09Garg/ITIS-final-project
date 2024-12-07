require("dotenv").config();
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // Set desired voice
speechConfig.setProperty(
    sdk.PropertyId.SpeechServiceConnection_SynthOutputFormat,
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
);

const audioConfig = sdk.AudioConfig.fromAudioFileOutput("minimal_test_output.mp3");
const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

console.log("Starting minimal speech synthesis...");
synthesizer.speakTextAsync("This is a minimal test.", (result) => {
    console.log("Synthesis result received.");
    synthesizer.close();
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Synthesis completed successfully. Check minimal_test_output.mp3.");
    } else if (result.reason === sdk.ResultReason.Canceled) {
        const cancellationDetails = sdk.SpeechSynthesisCancellationDetails.fromResult(result);
        console.error("Synthesis canceled. Reason:", cancellationDetails.reason);
        if (cancellationDetails.reason === sdk.CancellationReason.Error) {
            console.error("Error details:", cancellationDetails.errorDetails);
        }
    } else {
        console.error("Unknown result reason:", result.reason);
    }
}, (err) => {
    console.error("Error during synthesis:", err);
    synthesizer.close();
});
