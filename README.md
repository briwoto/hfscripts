# hfscripts

// does not follow clean architecture principles - script directly interacts with the Postgres class - need to add one layer of abstraction between script and DB

/\*
The next phase of the campaigns i.e. sending the emails to the users
can be done in this way
This code is not linked to the script yet.
It is just a demonstration of what the code could look like, if implemented

---

---

## create directory and file: data/segmentsTemplate.ts

type Incentive = {
header: string;
body: string;
incentive: {};
};
export const segmentLow: Incentive = {
header: '',
body: '',
incentive: {},
};
similarly create variables for Mid and High segments

---

## db/queries.ts

create a function to run the select query
select user_id, email from rec_campaigns_weekly
where 1=1
and campaign_sent = false

this function would return an array of users
this needs be sent to the services layer
\*/

// services/index.ts
const segmentMessages = {
low: segmentLow,
// ....
};

/\*
Following tables already created

create table customer (
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
email VARCHAR(64) not null,
status VARCHAR(16) not null,
date_created DATE not null
);

create table subscription (
subscription_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
subscription_week varchar(8) PRIMARY KEY,
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
status VARCHAR(16) not null,
);

since there is not write operation needed in the above two tables,
the schema for them does not exist in the code

I have added a schema for the below table that gets populated via Bulk insert from the code

create table rec_campaigns_weekly (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
email varchar(64) not null ,
segment varchar(8) not null,
campaign_sent bool default false,
row_created_on timestamp not null default now()
);

\*/
