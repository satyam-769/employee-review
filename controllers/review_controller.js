import User from '../models/user.js';
import AssignedReview from '../models/assignedReviews.js';
import MyReviews from '../models/myReviews.js';

// // create a project for the user
// const create = async function (req, res) {
//   try {
//     Project.create({
//       name: req.body.name,
//       description: req.body.description,
//       author: req.body.author,
//     });
//     return res.redirect('back');
//   } catch (err) {
//     console.log(err);
//     return res.redirect('back');
//   }
// };

// // find project and display it in the project page
// const project = async function (req, res) {
//   try {
//     let project = await Project.findById(req.params.id).populate({
//       path: 'issues',
//     });
//     if (project) {
//       return res.render('project_page', {
//         title: 'Issue Tracker | Project Page',
//         project,
//       });
//     }
//     return res.redirect('back');
//   } catch (err) {
//     console.log(err);
//     return res.redirect('back');
//   }
// };

// // create issue
// const createIssue = async function (req, res) {
//   try {
//     // Find the project id of the issue to be create
//     let project = await Project.findById(req.params.id);
//     if (project) {
//       let issue = await Issue.create({
//         title: req.body.title,
//         description: req.body.description,
//         labels: req.body.labels,
//         author: req.body.author,
//       });
//       project.issues.push(issue);

//       if (!(typeof req.body.labels === 'string')) {
//         for (let label of req.body.labels) {
//           let isPresent = project.labels.find((obj) => obj == label);
//           if (!isPresent) {
//             project.labels.push(label);
//           }
//         }
//       } else {
//         let isPresent = project.labels.find((obj) => obj == req.body.labels);
//         if (!isPresent) {
//           project.labels.push(req.body.labels);
//         }
//       }
//       await project.save();
//       return res.redirect(`back`);
//     } else {
//       return res.redirect('back');
//     }
//   } catch (err) {
//     return res.redirect('back');
//   }
// };

// // delete issue
// const deleteIssue = async function (req, res) {
//   try {
//     // Find the project id of the issue to be deleted
//     let project = await Project.findById(req?.params?.projectId);
//     if (project) {
//       // Find the index of the issue to be deleted
//       let issueIndex = project.issues.findIndex(issue => issue.equals(req.params.issueId));
//       if (issueIndex !== -1) {
//         // Remove the issue from the project's issues array
//         project.issues.splice(issueIndex, 1);

//         // Delete the issue from the Issue collection
//         await Issue.findByIdAndDelete(req.params.issueId);

//         // Save the updated project
//         await project.save();

//         return res.redirect('back');
//       } else {
//         // Issue not found in the project's issues array
//         return res.status(404).send('Issue not found');
//       }
//     } else {
//       // Project not found
//       return res.status(404).send('Project not found');
//     }
//   } catch (err) {
//     console.error('Error deleting issue:', err);
//     return res.status(500).send('Internal Server Error');
//   }
// };

const home = async function(req, res) {
  try {
    let users =await User.find({});
    res.render('./assignWork',{
      users:users
    })
  } catch (error) {
    console.log('Error', error);
  }
}

const createReview = async function(req, res) {
  try {
    let review = await AssignedReview.findOne({ fromUser: req.body.reviewer,toUser: req.body.recipient});

    if (review) {
      req.flash('success', 'Review Already Assigned for same Recipient and Reviewer');
      return res.redirect('back');
    }

    review=await AssignedReview.create({
      fromUser: req.body.reviewer,
      toUser: req.body.recipient
    })

    let user = await User.findById(req.body.reviewer);
    user.assignedReviews.push(review);
    user.save();

    req.flash('success', 'Review Assigned Successfully');
    return res.redirect('back');
  } catch (error) {
    console.log('Error', error);
  }
}

export {
  home,
  createReview,
}
