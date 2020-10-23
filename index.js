require("dotenv").config();
const express = require("express");
const cors = require("cors");
const signature = require("./verifySignature");
const analyzeTone = require("./analyzeTone");

const PORT = 4000;

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  res.send("hi");
});

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(express.json({ verify: rawBodyBuffer }));

app.post("/event", (req, res) => {
  if (req.body.type === "url_verification") {
    res.send(req.body.challenge);
  } else if (req.body.type === "event_callback") {
    // To see if the request is coming from Slack
    if (!signature.isVerified(req)) {
      res.sendStatus(404);
      return;
    } else {
      res.sendStatus(200);
    }

    const { bot_id, text, user, channel } = req.body.event;
    if (!text) return;

    // Exclude the message from a bot, also slash command
    let regex = /(^\/)/;
    if (bot_id || regex.test(text)) return;
    analyzeTone(text, user, channel);
  }
});

app.listen(PORT, () => console.log("Listening on port: ", PORT));
