import mongoose from "mongoose";

const { Schema } = mongoose;

const AnalyticsSchema = new Schema(
  {
    deviceType: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    }
  },
);

const UrlSchema = new Schema(
  {
    shortId: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    analytics: {
      type: [AnalyticsSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Url = mongoose.models.Url || mongoose.model("Url", UrlSchema);

export default Url;
