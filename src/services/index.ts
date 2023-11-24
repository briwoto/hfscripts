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
  1: 'low',
  2: 'mid',
  3: 'mid',
  4: 'high',
};

// categorize user based on segment
// time complexity of the code is  O(n)
// NOTE: sql provides a usersList that is sorted by user_id, subscription_week
export const groupUsersBySegment = (sortedUsersList: Subscription[]) => {
  let currentUser = sortedUsersList[0];
  let pauseCounter = 0;
  let maxConsecutive = 0;
  let userGroupList: UserSegment[] = [];
  sortedUsersList.forEach((user) => {
    // if user_id is the same, increment/decrement totalPause
    // if user id is different, restart the totalPause counter
    if (user.user_id === currentUser.user_id) {
      pauseCounter = user.status === 'paused' ? pauseCounter + 1 : 0;
      if (pauseCounter > maxConsecutive) {
        maxConsecutive += 1;
      }
      return;
    }
    userGroupList.push({
      user_id: user.user_id,
      email: user.email,
      segment: segmentMap[maxConsecutive],
    });
    currentUser = user;
    pauseCounter = 0;
    maxConsecutive = 0;
  });

  // the last user in the loop doesn't get added when the loop ends
  userGroupList.push({
    user_id: currentUser.user_id,
    email: currentUser.email,
    segment: segmentMap[maxConsecutive],
  });
  return userGroupList;
};
