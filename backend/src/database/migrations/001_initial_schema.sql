-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE subject_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE file_type AS ENUM ('PDF', 'Video', 'Audio', 'Document', 'Other');

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'student',
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Subjects table
CREATE TABLE IF NOT EXISTS "Subjects" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    level subject_level NOT NULL,
    description TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Files table
CREATE TABLE IF NOT EXISTS "Files" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" file_type NOT NULL DEFAULT 'Document',
    "fileSize" INTEGER NOT NULL,
    "storedFileName" VARCHAR(255) NOT NULL UNIQUE,
    "downloadCount" INTEGER DEFAULT 0,
    "isPublic" BOOLEAN DEFAULT true,
    "uploadedBy" UUID NOT NULL REFERENCES "Users"(id),
    "subjectId" UUID NOT NULL REFERENCES "Subjects"(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial subjects
INSERT INTO "Subjects" (name, level, description, "order") VALUES
    ('Mathematics', 'Advanced', 'Advanced mathematics including calculus, linear algebra, and differential equations', 1),
    ('Physics', 'Advanced', 'Advanced physics covering mechanics, electromagnetism, and quantum physics', 2),
    ('English', 'Beginner', 'Basic English language skills, grammar, and vocabulary', 3),
    ('French', 'Beginner', 'Introduction to French language and basic conversation skills', 4),
    ('Arabic', 'Intermediate', 'Intermediate Arabic language, grammar, and cultural studies', 5),
    ('Chemistry', 'Advanced', 'Advanced chemistry including organic, inorganic, and physical chemistry', 6),
    ('History', 'Intermediate', 'World history and historical analysis', 7),
    ('Computer Science', 'Advanced', 'Advanced computer science including algorithms, data structures, and software engineering', 8);

-- Create indexes
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_subjects_name ON "Subjects"(name);
CREATE INDEX idx_files_subject ON "Files"("subjectId");
CREATE INDEX idx_files_uploader ON "Files"("uploadedBy");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS '
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
';

-- Create triggers for updatedAt
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON "Subjects"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON "Files"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 