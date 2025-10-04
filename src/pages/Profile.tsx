import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  full_name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  ssn: z.string().trim().regex(/^\d{3}-?\d{2}-?\d{4}$/, "Invalid SSN format (XXX-XX-XXXX)").optional().or(z.literal("")),
  state_id: z.string().trim().max(50, "State ID must be less than 50 characters").optional(),
  address: z.string().trim().max(500, "Address must be less than 500 characters").optional(),
  date_of_birth: z.date().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const needsOptions = [
  { id: "housing", label: "Housing - Safe and affordable housing options" },
  { id: "employment", label: "Employment - Job opportunities and career resources" },
  { id: "food_clothing", label: "Food and Clothing - Access to food banks and clothing" },
  { id: "government_assistance", label: "Government Assistance - Benefits and support" },
];

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      ssn: "",
      state_id: "",
      address: "",
      date_of_birth: null,
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          full_name: data.full_name || "",
          phone: data.phone || "",
          ssn: data.ssn || "",
          state_id: data.state_id || "",
          address: data.address || "",
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
        });
        setSelectedNeeds(data.needs || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: ProfileFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        date_of_birth: formData.date_of_birth ? format(formData.date_of_birth, "yyyy-MM-dd") : null,
        needs: selectedNeeds,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNeedToggle = (needId: string) => {
    setSelectedNeeds(prev =>
      prev.includes(needId)
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground mt-2">
                Complete your profile to get personalized resource recommendations
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your SSN or former State # to access your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      placeholder="John Doe"
                      {...form.register("full_name")}
                    />
                    {form.formState.errors.full_name && (
                      <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("date_of_birth") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("date_of_birth") ? (
                            format(form.watch("date_of_birth")!, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.watch("date_of_birth") || undefined}
                          onSelect={(date) => form.setValue("date_of_birth", date || null)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssn">Social Security Number</Label>
                    <Input
                      id="ssn"
                      placeholder="XXX-XX-XXXX"
                      type="password"
                      {...form.register("ssn")}
                    />
                    {form.formState.errors.ssn && (
                      <p className="text-xs text-destructive">{form.formState.errors.ssn.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Your SSN is encrypted and secure
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state_id">Former State ID</Label>
                    <Input
                      id="state_id"
                      placeholder="State identification number"
                      {...form.register("state_id")}
                    />
                    {form.formState.errors.state_id && (
                      <p className="text-xs text-destructive">{form.formState.errors.state_id.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Current Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State ZIP"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Personal Information"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Your Needs</CardTitle>
              <CardDescription>
                Choose the resources you need. This helps us match you with the right providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {needsOptions.map((need) => (
                <div key={need.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id={need.id}
                    checked={selectedNeeds.includes(need.id)}
                    onCheckedChange={() => handleNeedToggle(need.id)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={need.id}
                    className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
                  >
                    {need.label}
                  </Label>
                </div>
              ))}
              <Button 
                onClick={form.handleSubmit(handleSave)} 
                disabled={saving}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Selected Needs"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
