/*
Following tables already created

create table customer ( 
	user_id bigint PRIMARY KEY, 
	email VARCHAR(64) not null, 
	status VARCHAR(16) not null, 
	date_created DATE not null 
);

create table subscription (
	subscription_id bigint PRIMARY KEY,
	subscription_week varchar(8) PRIMARY KEY, 
	user_id bigint PRIMARY KEY, 
	status VARCHAR(16) not null, 
);

since there is not write operation needed in the above two tables, 
the schema for them does not exist in the code

I have added a schema for the below table that gets populated via Bulk insert from the code

create table rec_campaigns_weekly (
    id serial PRIMARY KEY,
    user_id bigint not null,
    email varchar(64) not null ,
    segment varchar(8) not null,
    campaign_sent bool default false,
    row_created_on timestamp not null default now()
);

*/
