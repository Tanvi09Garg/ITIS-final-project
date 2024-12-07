require("dotenv").config();
const express = require("express");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Azure Speech Configuration
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // Use desired voice
speechConfig.setProperty(
    sdk.PropertyId.SpeechServiceConnection_SynthOutputFormat,
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3 // Set MP3 output format
);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Text-to-Speech API. Use POST /synthesize to convert text to speech.");
});

// API Endpoint for Text-to-Speech
app.post("/synthesize", (req, res) => {
    console.log("Request received:", req.body);
    const { text } = req.body;

    if (!text) {
        console.error("Text field is missing in the request.");
        return res.status(400).json({ error: "Text is required" });
    }

    console.log("Received text for synthesis:", text);

    // Generate a unique filename for each request
    const fileName = `output_${Date.now()}.mp3`;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(fileName);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    console.log("Starting speech synthesis...");

    // Set a timeout to prevent indefinite hangs
    const timeout = setTimeout(() => {
        console.error("Speech synthesis timed out.");
        synthesizer.close();
        res.status(500).json({ error: "Speech synthesis timed out." });
    }, 120000); // 120 seconds timeout

    synthesizer.speakTextAsync(text, (result) => {
        clearTimeout(timeout); // Clear timeout on success
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log(`Synthesis completed. File saved as ${fileName}`);
            res.download(fileName, () => {
                fs.unlinkSync(fileName); // Cleanup: Delete the file after download
            });
        } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellationDetails = sdk.SpeechSynthesisCancellationDetails.fromResult(result);
            console.error("Synthesis canceled. Reason:", cancellationDetails.reason);
            if (cancellationDetails.reason === sdk.CancellationReason.Error) {
                console.error("Error details:", cancellationDetails.errorDetails);
            }
            res.status(500).json({ error: "Speech synthesis failed." });
        }
    }, (err) => {
        clearTimeout(timeout); // Clear timeout on error
        console.error("Error during synthesis:", err);
        synthesizer.close();
        res.status(500).json({ error: "Internal Server Error" });
    });
});

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
console.log("Speech Key:", process.env.SPEECH_KEY);
console.log("Speech Region:", process.env.SPEECH_REGION);