interface UserSegment {
  user_id: string;
  email: string;
  segment: string;
}

const recCampaignWeeklySchema = {
  tableName: 'rec_weekly_campaign',
  columns: {
    user_id: 'user_id',
    email: 'email',
    segment: 'segment',
  },
};

export { UserSegment, recCampaignWeeklySchema };
