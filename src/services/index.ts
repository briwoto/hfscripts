type Subscription = {
  user_id: string;
  subscription_week: string;
  status: 'paused' | 'active' | 'cancelled';
  email: string;
};

type UserSegment = {
  user_id: string;
  email: string;
  category: string;
};

const segmentMap = {
  0: 'low',
  1: 'mid',
  2: 'mid',
  4: 'high',
};

// find which segment the user falls under
// time complexity of the code is  O(n)
export const groupUsersBySegment = (usersList: Subscription[]) => {
  let currentUser = usersList[0];
  let totalPause = 0;
  let userGroupList: UserSegment[] = [];
  usersList.forEach((user) => {
    if (user.user_id != currentUser.user_id) {
      userGroupList.push({
        user_id: user.user_id,
        email: user.email,
        category: segmentMap[totalPause],
      });
      currentUser = user;
    } else {
      totalPause = user.status === 'paused' ? totalPause + 1 : totalPause - 1;
    }
  });

  // add the last user in the loop that didn't get added when the loop ended
  userGroupList.push({
    user_id: currentUser.user_id,
    email: currentUser.email,
    category: segmentMap[totalPause],
  });
  return userGroupList;
};
