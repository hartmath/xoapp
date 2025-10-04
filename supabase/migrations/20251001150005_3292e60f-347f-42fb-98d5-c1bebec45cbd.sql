-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create resource categories enum
CREATE TYPE public.resource_category AS ENUM ('housing', 'employment', 'transportation', 'assistance');

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category public.resource_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  organization TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  website_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources policies (public read access)
CREATE POLICY "Anyone can view active resources"
  ON public.resources FOR SELECT
  USING (is_active = true);

-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Contact inquiries policies
CREATE POLICY "Users can create contact inquiries"
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample resources
INSERT INTO public.resources (category, title, description, organization, contact_phone, contact_email, website_url) VALUES
('housing', 'Emergency Shelter Program', 'Provides immediate shelter and housing assistance for individuals and families in need.', 'Hope Housing Services', '(555) 123-4567', 'shelter@hopehousing.org', 'https://hopehousing.org'),
('housing', 'Transitional Housing', 'Short-term housing with support services to help transition to permanent housing.', 'New Beginnings Center', '(555) 234-5678', 'info@newbeginnings.org', 'https://newbeginnings.org'),
('employment', 'Job Training Program', 'Free job training and placement services for individuals seeking employment.', 'Workforce Development Alliance', '(555) 345-6789', 'jobs@wda.org', 'https://wda.org'),
('employment', 'Career Counseling', 'One-on-one career counseling and resume building services.', 'Career Success Network', '(555) 456-7890', 'help@careersuccess.org', 'https://careersuccess.org'),
('transportation', 'Free Transit Pass Program', 'Provides free public transportation passes for qualified individuals.', 'Metro Transit Authority', '(555) 567-8901', 'passes@metatransit.gov', 'https://metatransit.gov'),
('transportation', 'Vehicle Donation Program', 'Helps provide donated vehicles to individuals who need transportation for work.', 'Wheels for Work', '(555) 678-9012', 'donate@wheelsforwork.org', 'https://wheelsforwork.org'),
('assistance', 'Food Bank Services', 'Free food distribution and meal programs for individuals and families.', 'Community Food Bank', '(555) 789-0123', 'info@communityfoodbank.org', 'https://communityfoodbank.org'),
('assistance', 'Government Benefits Navigator', 'Helps individuals apply for and access government assistance programs.', 'Benefits Access Center', '(555) 890-1234', 'navigator@benefitsaccess.gov', 'https://benefitsaccess.gov');