const Group = require("../models/groupModel");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");


// Yeni bir grup oluşturma
const createGroup = asyncErrorWrapper(async (req, res, next) => {
  const { name, members, roles } = req.body;

  const group = await Group.create({
    name,
    members: members.map((member, index) => ({
      user: member,
      role: roles[index] || "user",
    })),
  });

  return res.status(201).json({
    success: true,
    data: group,
  });
});



// Grubu silme
const deleteGroup = asyncErrorWrapper(async (req, res, next) => {
  const { groupId } = req.params;
  const { user } = req; // Oturum açmış kullanıcının bilgileri

  let group;
  try {
    group = await Group.findByIdAndDelete(groupId);
  } catch (err) {
    return next(new CustomError("An error occurred while deleting the group", 500));
  }

  if (!group) {
    return next(new CustomError("Group not found", 404));
  }

  // Grubu oluşturan kişi veya admin rolüne sahip kullanıcıların grupları silebilmesini kontrol et
  if (
    (group.createdBy && group.createdBy.toString() !== user.id) &&
    (!user.roles || !user.roles.includes("admin"))
  ) {
    return next(new CustomError("You are not authorized to delete this group", 403));
  }


  return res.status(200).json({
    success: true,
    message: "Group deleted successfully",
  });
});



// Tüm grupları getirme
const getAllGroups = asyncErrorWrapper(async (req, res, next) => {
  const groups = await Group.find();

  return res.status(200).json({
    success: true,
    data: groups,
  });
});

// Belirli bir gruptaki bilgileri getirme
const getGroup = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const group = await Group.findById(id);

  if (!group) {
    return next(new CustomError("Group not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: group,
  });
});

// Bir gruba kullanıcı ekleme
const addUserToGroup = asyncErrorWrapper(async (req, res, next) => {
  const { groupId, userId, role } = req.body;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new CustomError("Group not found", 404));
  }

  const isUserInGroup = group.members.some(
    (member) => member.user.toString() === userId
  );

  if (isUserInGroup) {
    return next(new CustomError("User is already in the group", 400));
  }

  group.members.push({ user: userId, role: role });
  await group.save();

  return res.status(200).json({
    success: true,
    message: "User added to the group successfully",
  });
});



// Bir kullanıcıyı gruptan çıkarma
const removeUserFromGroup = asyncErrorWrapper(async (req, res, next) => {
  const { groupId, userId } = req.params;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new CustomError("Group not found", 404));
  }

  // Kullanıcının grupta olup olmadığını kontrol etme
    const isUserInGroup = group.members.some(
    (member) => member.user.toString() === userId
);

    if (!isUserInGroup) {
    return next(new CustomError("User is not in the group", 400));
}

group.members = group.members.filter(
    (member) => member.user.toString() !== userId
);
await group.save();

return res.status(200).json({
    success: true,
    message: "User removed from the group successfully",
    });
});

module.exports = {
    createGroup,
    deleteGroup,
    getAllGroups,
    getGroup,
    addUserToGroup,
    removeUserFromGroup,
};
