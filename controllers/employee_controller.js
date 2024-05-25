import User from "../models/user.js";
import AssignedReview from "../models/assignedReviews.js";
import MyReview from "../models/myReviews.js";

const home = async function (req, res) {
  try {
    let users = await User.find({});
    res.render("./employeeSection", {
      users: users,
    });
  } catch (error) {
    console.log("Error", error);
  }
};

const update = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    if (
      user.name == req.body.name &&
      user.email == req.body.email &&
      user.password == req.body.password
    ) {
      req.flash("success", "No Values Updated");
      return res.redirect("back");
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save();
    req.flash("success", "User Updated succesfully");
    return res.redirect("back");
  } catch (error) {
    console.log("Error", error);
    return res.redirect("back");
  }
};

const deleteReview = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    user.deleteOne();

    await AssignedReview.deleteMany({ fromUser: req.params.id });

    let MyRiviewIDS = await MyReview.find({ fromUser: req.params.id });

    for (let review of MyRiviewIDS) {
      let userid = review.toUser;
      await User.findByIdAndUpdate(userid, { $pull: { myReviews: review.id } });
      await review.deleteOne();
    }

    // await MyReview.deleteMany({toUser:req.params.id})

    res.redirect("back");
  } catch (error) {
    console.log("Error", error);
  }
};

const makeAdmin = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    user.permission = "admin";

    user.save();
    req.flash("success", "User Promoted to Admin");
    return res.redirect("back");
  } catch (error) {
    console.log("Error", error);
    return res.redirect("back");
  }
};

const removeAdmin = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    user.permission = "employee";

    user.save();
    req.flash("success", "User removed as Admin");
    return res.redirect("back");
  } catch (error) {
    console.log("Error", error);
    return res.redirect("back");
  }
};

export {
  home,
  update,
  deleteReview,
  makeAdmin,
  removeAdmin
};
