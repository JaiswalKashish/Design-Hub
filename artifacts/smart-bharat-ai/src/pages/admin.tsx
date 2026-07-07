import { useState } from "react";
import { useGetAdminStats, useListComplaints, useUpdateComplaintStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, Users, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: ['/api/admin/stats'] }
  });

  const { data: complaints, isLoading: complaintsLoading } = useListComplaints(
    {}, 
    { query: { queryKey: ['/api/complaints'] } }
  );

  const updateStatus = useUpdateComplaintStatus();

  const handleStatusChange = async (complaintId: string, newStatus: any) => {
    try {
      await updateStatus.mutateAsync({
        complaintId,
        data: { status: newStatus }
      });
      
      toast({
        title: "Status Updated",
        description: `Complaint ${complaintId} status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Overview of civic infrastructure and active complaints.</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
          <Activity className="mr-2 h-4 w-4" /> Live Dashboard
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-blue-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Complaints</p>
                <h3 className="text-3xl font-bold">{stats?.totalComplaints || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-green-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Resolved</p>
                <h3 className="text-3xl font-bold">{stats?.resolvedComplaints || 0}</h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">{(stats?.resolvedComplaints! / stats?.totalComplaints! * 100).toFixed(0) || 0}%</span>
              <span className="text-muted-foreground ml-2">resolution rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-orange-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">In Progress</p>
                <h3 className="text-3xl font-bold">{(stats?.inProgressComplaints || 0) + (stats?.assignedComplaints || 0)}</h3>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Actively being worked on</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-yellow-500"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Pending Review</p>
                <h3 className="text-3xl font-bold">{stats?.pendingComplaints || 0}</h3>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">-5%</span>
              <span className="text-muted-foreground ml-2">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <Card className="lg:col-span-1 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats?.categoryBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                    >
                      {stats.categoryBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} complaints`, 'Count']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm flex flex-col">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Complaints Board</CardTitle>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-semibold tracking-wider">ID / Date</th>
                  <th className="px-6 py-3 font-semibold tracking-wider">Issue</th>
                  <th className="px-6 py-3 font-semibold tracking-wider">Location</th>
                  <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {complaints?.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-medium text-primary">{complaint.complaintId}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{complaint.category}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]">
                        {complaint.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm truncate max-w-[150px]">{complaint.location || "Not specified"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Select 
                        defaultValue={complaint.status} 
                        onValueChange={(val) => handleStatusChange(complaint.complaintId, val)}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className="w-[130px] ml-auto h-8 text-xs">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {!complaints?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No complaints found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}