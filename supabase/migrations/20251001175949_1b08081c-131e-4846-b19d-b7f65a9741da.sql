-- Add profile enhancement fields
ALTER TABLE public.profiles
ADD COLUMN ssn TEXT,
ADD COLUMN state_id TEXT,
ADD COLUMN needs TEXT[] DEFAULT '{}',
ADD COLUMN date_of_birth DATE,
ADD COLUMN address TEXT;

-- Add comment explaining SSN handling
COMMENT ON COLUMN public.profiles.ssn IS 'Social Security Number - sensitive data, encrypted at rest';
COMMENT ON COLUMN public.profiles.state_id IS 'Former State ID number for ex-offenders';
COMMENT ON COLUMN public.profiles.needs IS 'Array of needed resources: housing, employment, food_clothing, government_assistance';