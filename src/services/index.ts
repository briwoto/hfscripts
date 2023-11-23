type Subscription = {
  user_id: string;
  subscription_week: string;
  status: 'paused' | 'active' | 'cancelled';
  email: string;
};

type UserSegment = {
  user_id: string;
  email: string;
  segment: string;
};

// since we are looking for conescutive pauses -
// and by function logic, we are decrementing the counter when status=active
// that's why the segmentMap value will never be '3'
const segmentMap = {
  0: 'low',
  1: 'mid',
  2: 'mid',
  4: 'high',
};

// categorize user based on segment
// time complexity of the code is  O(n)
export const groupUsersBySegment = (usersList: Subscription[]) => {
  let currentUser = usersList[0];
  let totalPause = 0;
  let userGroupList: UserSegment[] = [];
  usersList.forEach((user) => {
    // if user_id is the same, increment/decrement totalPause
    // if user id is different, restart the totalPause counter
    if (user.user_id === currentUser.user_id) {
      totalPause = user.status === 'paused' ? totalPause + 1 : totalPause - 1;
      return;
    }
    userGroupList.push({
      user_id: user.user_id,
      email: user.email,
      segment: segmentMap[totalPause],
    });
    currentUser = user;
    totalPause = 0;
  });

  // the last user in the loop doesn't get added when the loop ends
  userGroupList.push({
    user_id: currentUser.user_id,
    email: currentUser.email,
    segment: segmentMap[totalPause],
  });
  return userGroupList;
};
