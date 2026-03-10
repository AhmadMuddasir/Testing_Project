import {config as conf} from "dotenv";

conf();

const _config = {
     port:process.env.PORT || 5513,
     mongouri:process.env.MONGO_URI,
     jwtsecret:process.env.JWT_SECRET,
     cloudinaryCloudName:process.env.CLOUDINARY_CLOUD_NAME,
     cloudinariApiKey:process.env.CLOUDINARY_API_KEY,
     cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET,
}

export const config = Object.freeze(_config);