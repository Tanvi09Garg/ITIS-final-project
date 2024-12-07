require("dotenv").config();
const express = require("express");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const app = express();
app.use(express.json()); 

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 
speechConfig.setProperty(
    sdk.PropertyId.SpeechServiceConnection_SynthOutputFormat,
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3 
);

app.get("/", (req, res) => {
    res.send("Welcome to the Text-to-Speech API. Use POST /synthesize to convert text to speech.");
});

app.post("/synthesize", (req, res) => {
    console.log("Request received:", req.body);

    const { text } = req.body;
    if (!text) {
        console.error("Text field is missing in the request.");
        return res.status(400).json({ error: "Text is required" });
    }

    console.log("Received text for synthesis:", text);

    const fileName = `output_${Date.now()}.mp3`;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(fileName);

    speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_SynthOutputFormat,
        sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
    );

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    console.log("Starting speech synthesis...");

    const timeout = setTimeout(() => {
        console.error("Speech synthesis timed out.");
        synthesizer.close();
        res.status(500).json({ error: "Speech synthesis timed out." });
    }, 30000); // 30 seconds

    synthesizer.speakTextAsync(text, (result) => {
        clearTimeout(timeout); 
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log(`Synthesis completed. File saved as ${fileName}`);
            res.download(fileName, () => {
                fs.unlinkSync(fileName); 
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
        clearTimeout(timeout); 
        console.error("Error during synthesis:", err);
        synthesizer.close();
        res.status(500).json({ error: "Internal Server Error" });
    });
});


// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
