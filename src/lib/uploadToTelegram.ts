import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const app = express();

const BOT_TOKEN = "8697907922:AAE9fC3OWHMKRawp7tPjncXrKLgXt9n12SE";
const CHANNEL_ID = "-1003892549696";
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
const LINK_API = "https://animeshrinedl-3c904eef1780.herokuapp.com/api/generate_link";

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {

    const form = new FormData();
    form.append("chat_id", CHANNEL_ID);
    form.append("document", fs.createReadStream(req.file.path));

    const tg = await axios.post(TG_API, form, {
      headers: form.getHeaders()
    });

    const messageId = tg.data.result.message_id;

    const link = await axios.post(LINK_API, {
      channel_id: Number(CHANNEL_ID),
      message_id: messageId
    });

    fs.unlinkSync(req.file.path);

    res.json({
      download_link: link.data.download_link
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(3000);
