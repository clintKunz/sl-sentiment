const axios = require("axios");
const qs = require("qs");
const apiUrl = "https://slack.com/api";

const postEmotion = async (emotions, user, channel) => {
  const args = {
    token: process.env.SL_OAUTH,
    channel: channel,
    text: `<@${user}> is feeling: ${emotions.join(", ")}`,
  };

  axios
    .post(`${apiUrl}/chat.postMessage`, qs.stringify(args))
    .then()
    .catch((error) => console.log("error", error));
};

module.exports = postEmotion;
