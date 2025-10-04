import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";

type Resource = {
  id: string;
  category: string;
  title: string;
  description: string;
  organization: string;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  website_url: string | null;
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = activeCategory === "all"
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  const categories = [
    { value: "all", label: "All Resources" },
    { value: "housing", label: "Housing" },
    { value: "employment", label: "Employment" },
    { value: "transportation", label: "Transportation" },
    { value: "assistance", label: "Government Assistance" },
  ];

  const categoryColors: Record<string, string> = {
    housing: "bg-blue-500",
    employment: "bg-green-500",
    transportation: "bg-orange-500",
    assistance: "bg-purple-500",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available <span className="text-primary">Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our comprehensive directory of resources to help you get back on your feet
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <Badge className={categoryColors[resource.category]}>
                          {resource.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-semibold text-foreground">
                        {resource.organization}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      
                      <div className="space-y-2">
                        {resource.contact_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href={`tel:${resource.contact_phone}`} className="hover:underline">
                              {resource.contact_phone}
                            </a>
                          </div>
                        )}
                        
                        {resource.contact_email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-primary" />
                            <a href={`mailto:${resource.contact_email}`} className="hover:underline">
                              {resource.contact_email}
                            </a>
                          </div>
                        )}
                        
                        {resource.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{resource.address}</span>
                          </div>
                        )}
                        
                        {resource.website_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            asChild
                          >
                            <a
                              href={resource.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              Visit Website <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
