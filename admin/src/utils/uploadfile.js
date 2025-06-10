import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";
import { replaceName } from "./replaceName"

export const uploadFile = async (file, folder= "images") => {
  try {
    const filename = replaceName(file.name);
    const storageRef = ref(storage, `${folder}/${Date.now()}_${filename}`);
    const res = await uploadBytes(storageRef, file);
    if (res.metadata.size === file.size) {
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } else {
      throw new Error("File size mismatch");
    }
  } catch (error) {
    console.error("Upload error:", error);
    return "Error upload";
  }
};