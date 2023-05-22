const Group = require("../models/groupModel");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

// Yeni bir grup oluşturma
const createGroup = asyncErrorWrapper(async (req, res, next) => {
  const { name, description } = req.body;

  const group = await Group.create({
    name,
    description,
  });

  return res.status(201).json({
    success: true,
    data: group,
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

  // Kullanıcının zaten grupta olup olmadığını kontrol etme
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
    getAllGroups,
    getGroup,
    addUserToGroup,
    removeUserFromGroup,
};
