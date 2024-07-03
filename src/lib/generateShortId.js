import { nanoid } from "nanoid";
import Url from "../models/url.models";
import { connectToDB } from "../db";

const generateShortId = async () => {
  try {
    await connectToDB();
    
    let shortId;
    let isUnique = false;
    
    while (!isUnique) {
      shortId = nanoid(7);
      
      const existingUrl = await Url.findOne({ shortId });
      
      if (!existingUrl) {
        isUnique = true;
      }
    }
    
    return shortId;
  } catch (error) {
    console.error("Error generating shortId:", error);
    throw new Error("Failed to generate shortId");
  }
};

export default generateShortId;
