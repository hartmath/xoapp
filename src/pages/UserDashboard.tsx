import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Mail, Phone, Calendar, MapPin, CreditCard, CheckCircle2, MessageSquare, Clock, TrendingUp, Sparkles } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);
      await Promise.all([
        fetchProfile(user.id),
        fetchInquiries(user.id)
      ]);
    } catch (error) {
      console.error("User check error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (!error && data) setProfile(data);
  };

  const fetchInquiries = async (userId: string) => {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (!error && data) setInquiries(data);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-accent p-8 text-primary-foreground shadow-lg animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
            </div>
            <p className="text-primary-foreground/90 text-lg">
              {profile?.full_name || user?.email}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                  <p className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                    {inquiries.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {inquiries.filter(i => i.status === "new").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resources Selected</p>
                  <p className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                    {profile?.needs?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="profile" className="text-base">Profile</TabsTrigger>
            <TabsTrigger value="inquiries" className="text-base">My Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-background pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                    <CardDescription>Your account details and personal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                      <p className="font-semibold text-foreground truncate">{profile?.full_name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="font-semibold text-foreground truncate">{profile?.email || user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</p>
                      <p className="font-semibold text-foreground truncate">{profile?.phone || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date of Birth</p>
                      <p className="font-semibold text-foreground truncate">
                        {profile?.date_of_birth 
                          ? new Date(profile.date_of_birth).toLocaleDateString()
                          : "Not set"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</p>
                      <p className="font-semibold text-foreground truncate">{profile?.address || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Identification</p>
                      <p className="font-semibold text-foreground truncate">
                        {profile?.ssn ? "SSN: •••-••-" + profile.ssn.slice(-4) : 
                         profile?.state_id ? "State ID: " + profile.state_id : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-background pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Selected Needs</CardTitle>
                    <CardDescription>Resources and support you're seeking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {profile?.needs && profile.needs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.needs.map((need: string, index: number) => (
                      <div 
                        key={need} 
                        className="flex items-center gap-3 p-4 border-2 border-accent/20 rounded-lg bg-accent/5 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 hover:shadow-md animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        </div>
                        <span className="font-medium capitalize text-foreground">
                          {need.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      No needs selected yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your profile to select resources you're seeking
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">My Contact Inquiries</CardTitle>
                    <CardDescription>Track and manage your submitted inquiries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      No inquiries yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your submitted inquiries will appear here
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Message</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inquiries.map((inquiry) => (
                          <TableRow key={inquiry.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {new Date(inquiry.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="truncate font-medium">{inquiry.message}</p>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  inquiry.status === "new" 
                                    ? "default" 
                                    : inquiry.status === "in_progress"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="font-medium"
                              >
                                {inquiry.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
