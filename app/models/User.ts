import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Check if the model exists before creating a new one
// This is important for Next.js hot reloading
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
