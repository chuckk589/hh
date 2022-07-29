import { Migration } from '@mikro-orm/migrations';

export class Migration20220728184641 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "nickname" varchar(30) not null, "refresh_token" varchar(255) null, "email" varchar(100) null, "password" varchar(255) null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_nickname_unique" unique ("nickname");',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "tag" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(40) not null, "sort_order" int not null default 0, "creator" int null);',
    );

    this.addSql(
      'create table "user_tags" ("user_id" int not null, "tag_id" int not null, constraint "user_tags_pkey" primary key ("user_id", "tag_id"));',
    );

    this.addSql(
      'alter table "tag" add constraint "tag_creator_foreign" foreign key ("creator") references "user" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "user_tags" add constraint "user_tags_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_tags" add constraint "user_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;',
    );
  }
}
