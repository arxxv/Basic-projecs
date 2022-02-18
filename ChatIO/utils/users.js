const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((u) => u.id === id);
}

function userLeave(id) {
  const ind = users.findIndex((u) => u.id === id);
  if (ind !== -1) {
    return users.splice(ind, 1)[0];
  }
}

function getAllUsers(room) {
  return users.filter((u) => u.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getAllUsers };
