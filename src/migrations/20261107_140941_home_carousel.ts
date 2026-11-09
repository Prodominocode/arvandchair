import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_carousel_chairs_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"swatch" varchar
  );
  
  CREATE TABLE "home_carousel_chairs_specs_locales" (
  	"kind" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_carousel_chairs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "home_carousel_chairs_locales" (
  	"name" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_carousel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_carousel_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "home_carousel_chairs_specs" ADD CONSTRAINT "home_carousel_chairs_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_carousel_chairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_carousel_chairs_specs_locales" ADD CONSTRAINT "home_carousel_chairs_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_carousel_chairs_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_carousel_chairs" ADD CONSTRAINT "home_carousel_chairs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_carousel_chairs" ADD CONSTRAINT "home_carousel_chairs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_carousel_chairs_locales" ADD CONSTRAINT "home_carousel_chairs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_carousel_chairs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_carousel_rels" ADD CONSTRAINT "home_carousel_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_carousel_rels" ADD CONSTRAINT "home_carousel_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_carousel_chairs_specs_order_idx" ON "home_carousel_chairs_specs" USING btree ("_order");
  CREATE INDEX "home_carousel_chairs_specs_parent_id_idx" ON "home_carousel_chairs_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_carousel_chairs_specs_locales_locale_parent_id_unique" ON "home_carousel_chairs_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_carousel_chairs_order_idx" ON "home_carousel_chairs" USING btree ("_order");
  CREATE INDEX "home_carousel_chairs_parent_id_idx" ON "home_carousel_chairs" USING btree ("_parent_id");
  CREATE INDEX "home_carousel_chairs_image_idx" ON "home_carousel_chairs" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_carousel_chairs_locales_locale_parent_id_unique" ON "home_carousel_chairs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_carousel_rels_order_idx" ON "home_carousel_rels" USING btree ("order");
  CREATE INDEX "home_carousel_rels_parent_idx" ON "home_carousel_rels" USING btree ("parent_id");
  CREATE INDEX "home_carousel_rels_path_idx" ON "home_carousel_rels" USING btree ("path");
  CREATE INDEX "home_carousel_rels_media_id_idx" ON "home_carousel_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_carousel_chairs_specs" CASCADE;
  DROP TABLE "home_carousel_chairs_specs_locales" CASCADE;
  DROP TABLE "home_carousel_chairs" CASCADE;
  DROP TABLE "home_carousel_chairs_locales" CASCADE;
  DROP TABLE "home_carousel" CASCADE;
  DROP TABLE "home_carousel_rels" CASCADE;`)
}
