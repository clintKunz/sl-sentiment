const ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");
const postEmotion = require("./postEmotion");

const toneAnalyzer = new ToneAnalyzerV3({
  iam_apikey: process.env.TONE_ANALYZER_KEY,
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  version: "2017-09-21",
});

const analyzeTone = (text, user, channel) => {
  const confidencethreshold = 0.55;
  console.log("send text to watson...");

  toneAnalyzer.tone({ tone_input: { text } }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let tones = result.document_tone.tones;
      let emotions = []; // put all emotions results in an array

      for (let v of tones) {
        if (v.score >= confidencethreshold) {
          // pulse only if the likelihood of an emotion is above the given confidencethreshold
          console.log(`Current Emotion is ${v.tone_id}, ${v.score}`);
          emotions.push(v.tone_id);
        }
      }

      if (emotions.length) postEmotion(emotions, user, channel);
    }
  });
};

module.exports = analyzeTone;
