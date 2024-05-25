import User from '../models/user.js';
import AssignedReview from '../models/assignedReviews.js';
import MyReviews from '../models/myReviews.js';

const homeController = async function(req, res) {
  try {
    let user = await User.findById(req?.user?.id).populate({
      path: 'assignedReviews',
      populate: {
        path: 'toUser'
      }
    }).populate({
      path: 'myReviews',
      populate: {
        path: 'fromUser'
      }
    })

    res.render('./home',{
      user:user
    })
  } catch (error) {
    console.log('Error', error);
  }
}

const completeReview = async function(req, res) {
  try {

    let review = await AssignedReview.findOne({ fromUser: req?.user,toUser: req?.body?.toUser});
    await User.findByIdAndUpdate(req?.user, { $pull: { assignedReviews: review?.id } });
    await AssignedReview.findByIdAndDelete(review.id);

    review = await MyReviews.create({
      fromUser: req.user,
      toUser: req.body.toUser,
      message:req.body.message
    })

    let user = await User.findById(req.body.toUser);

    user.myReviews.push(review);
    user.save();

    req.flash('success', 'Review Submitted Successfully');
      return res.redirect('back');      
  } catch (error) {
    console.log('Error', error);
  }
}

export {
  homeController,
  completeReview
};
