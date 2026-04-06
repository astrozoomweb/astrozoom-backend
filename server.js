import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express(); // 🔥 THIS WAS MISSING

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/rudraksha", async (req, res) => {
  console.log("STEP 1: API HIT");

  try {
    const { dob, tob, pob } = req.body;

    console.log("STEP 2: INPUT RECEIVED", { dob, tob, pob });

    // ✅ Step 3: DOB format
    const date = new Date(dob);
    console.log("STEP 3: DATE OBJECT", date);

    const formattedDob = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

    console.log("STEP 4: FORMATTED DOB", formattedDob);

    // ✅ Step 5: Static lat/lon
    const lat = 26.24;
    const lon = 73.02;

    console.log("STEP 5: LAT/LON", lat, lon);

    // ✅ Step 6: BEFORE API CALL
    console.log("STEP 6: CALLING VEDIC API");

    const astroResponse = await axios.get(
      "https://api.vedicastroapi.com/v3-json/extended-horoscope/rudraksh-suggestion",
      {
        params: {
          api_key: process.env.ASTRO_API_KEY,
          dob: formattedDob,
          tob: tob,
          lat: lat,
          lon: lon,
          tz: 5.5,
          lang: "en"
        }
      }
    );

    console.log("STEP 7: API SUCCESS");
    console.log("ASTRO DATA:", astroResponse.data);

    const apiData = astroResponse.data;

    const mukhi =
      apiData.response?.mukhi_for_money?.[0] ||
      apiData.response?.mukhi_for_health?.[0] ||
      apiData.response?.mukhi_for_disease_cure?.[0] ||
      5;

    res.json({
      success: true,
      mukhi: mukhi,
      rudraksha: `${mukhi} Mukhi Rudraksha`
    });

  } catch (error) {
    console.log("STEP ERROR HIT");

    console.error("ERROR MESSAGE:", error.message);

    if (error.response) {
      console.error("ERROR STATUS:", error.response.status);
      console.error("ERROR DATA:", error.response.data);
    }

    res.status(500).json({
      success: false,
      debug: error.response?.data || error.message
    });
  }
});

app.all("/gemstone", async (req, res) => {
  console.log("💎 GEMSTONE HIT");

  try {
    const body = req.body || req.query || {};
    const { dob, tob, pob } = body;

    console.log("INPUT:", body);

    // Format DOB
    const date = new Date(dob);
    const formattedDob = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;

    const lat = 26.24;
    const lon = 73.02;

    // Call Vedic API
    const response = await axios.get(
      "https://api.vedicastroapi.com/v3-json/extended-horoscope/gem-suggestion",
      {
        params: {
          api_key: process.env.ASTRO_API_KEY,
          dob: formattedDob,
          tob: tob,
          lat: lat,
          lon: lon,
          tz: 5.5,
          lang: "en"
        }
      }
    );

    console.log("GEM API RESPONSE:", response.data);

    const data = response.data;

    let gem = "Yellow Sapphire";

    // ✅ Correct key from your API
    if (data.response?.name) {
      gem = data.response.name;
    }

    res.json({
      success: true,
      gemstone: data.response?.name || "Yellow Sapphire",
      gem_key: data.response?.gem || "yellow_sapphire"
    });

  } catch (error) {
    console.error("GEM ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});