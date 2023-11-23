import { TableSchema } from '.';

interface UserSegment {
  user_id: string;
  email: string;
  segment: string;
}

const RecCampaignWeeklySchema: TableSchema = {
  tableName: 'rec_campaigns_weekly',
  columns: {
    user_id: 'user_id',
    email: 'email',
    segment: 'segment',
  },
};

export { UserSegment, RecCampaignWeeklySchema };
