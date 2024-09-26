import mongoose from "mongoose";
import axios from "axios";

const { Schema } = mongoose;

const randomDisplayNameGenerator = async (retryCount = 0) => {
  if (retryCount > 5) {
    throw new Error(
      "Failed to generate a valid display name after multiple attempts"
    );
  }

  const apiUrl = "https://api.api-ninjas.com/v1/randomword";
  try {
    const res = await axios.get(apiUrl, {
      headers: {
        "X-Api-Key": process.env.RND_WORD_API_KEY,
      },
    });
    const word = res.data.word;
    const num = Math.floor(100000 + Math.random() * 900000).toString();
    const displayName = `${word}${num}`;

    if (displayName.length > 30) {
      console.log(
        `Generated name "${displayName}" is too long. Trying again...`
      );
      return randomDisplayNameGenerator(retryCount + 1);
    }

    return displayName;
  } catch (err) {
    console.error("An error occurred: ", err);
    throw new Error("Failed to generate display name");
  }
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      minlength: 3,
      trim: true,
    },
    displayName: {
      type: String,
      unique: true,
      maxlength: 30,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      default: null,
    },
    userImg: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  }
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ displayName: 1 }, { unique: true });
UserSchema.index({ created_at: -1 });

// Pre-save hook to always set displayName
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.displayName = await randomDisplayNameGenerator();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  // Remove any other sensitive fields
  return user;
};

const User = mongoose.model("User", UserSchema);

export default User;
