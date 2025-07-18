import userModel from "../../models/userModel.js";

const userData = async (req, res) => {
  try {
    const tokenuser = res.locals.tokenuser;
    const userData = await userModel.findById(tokenuser.id);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      data: { _id: userData._id, name: userData.name, email: userData.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export { userData };