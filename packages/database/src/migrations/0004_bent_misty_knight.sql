-- First add nullable columns
ALTER TABLE "clients" ADD COLUMN "first_name" varchar(255);
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "last_name" varchar(255);
--> statement-breakpoint

-- Populate first_name with the part before the first space in name (or the entire name if no space)
UPDATE "clients" SET "first_name" = split_part("name", ' ', 1);
--> statement-breakpoint

-- Populate last_name with everything after the first space in name (or empty if no space)
UPDATE "clients" SET "last_name" = CASE 
  WHEN position(' ' IN "name") > 0 THEN substring("name" FROM position(' ' IN "name") + 1)
  ELSE ''
END;
--> statement-breakpoint

-- Now add NOT NULL constraints
ALTER TABLE "clients" ALTER COLUMN "first_name" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "last_name" SET NOT NULL;
--> statement-breakpoint

-- Finally drop the name column
ALTER TABLE "clients" DROP COLUMN "name";