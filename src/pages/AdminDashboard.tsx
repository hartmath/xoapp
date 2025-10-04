import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, X, Check } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [showAddResource, setShowAddResource] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await Promise.all([
        fetchResources(),
        fetchInquiries(),
        fetchProfiles()
      ]);
    } catch (error) {
      console.error("Admin check error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setResources(data);
  };

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setInquiries(data);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setProfiles(data);
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Resource deleted" });
      fetchResources();
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Status updated" });
      fetchInquiries();
    }
  };

  const saveResource = async (resourceData: any) => {
    if (editingResource?.id) {
      const { error } = await supabase
        .from("resources")
        .update(resourceData)
        .eq("id", editingResource.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update resource",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Resource updated" });
        setEditingResource(null);
        fetchResources();
      }
    } else {
      const { error } = await supabase
        .from("resources")
        .insert([resourceData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create resource",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Resource created" });
        setShowAddResource(false);
        fetchResources();
      }
    }
  };

  const ResourceForm = ({ resource, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(
      resource || {
        title: "",
        description: "",
        organization: "",
        category: "housing",
        contact_phone: "",
        contact_email: "",
        website_url: "",
        address: "",
        is_active: true,
      }
    );

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{resource ? "Edit Resource" : "Add New Resource"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Organization"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Contact Phone"
            value={formData.contact_phone || ""}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
          />
          <Input
            placeholder="Contact Email"
            value={formData.contact_email || ""}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
          />
          <Input
            placeholder="Website URL"
            value={formData.website_url || ""}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)}>Save</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="inquiries">Contact Inquiries</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Resources</h2>
              <Button onClick={() => setShowAddResource(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>

            {showAddResource && (
              <ResourceForm
                onSave={saveResource}
                onCancel={() => setShowAddResource(false)}
              />
            )}

            {editingResource && (
              <ResourceForm
                resource={editingResource}
                onSave={saveResource}
                onCancel={() => setEditingResource(null)}
              />
            )}

            <div className="grid gap-4">
              {resources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.organization}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingResource(resource)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteResource(resource.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge>{resource.category}</Badge>
                      <Badge variant={resource.is_active ? "default" : "secondary"}>
                        {resource.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <h2 className="text-2xl font-semibold mb-4">Contact Inquiries</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{inquiry.full_name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.phone || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                    <TableCell>
                      <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="users">
            <h2 className="text-2xl font-semibold mb-4">User Profiles</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.full_name || "N/A"}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{profile.phone || "N/A"}</TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
