"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Video, AlertTriangle, Shield, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  reportCount: number;
  banned: boolean;
  bannedAt: Date | null;
  banReason: string | null;
  lastSeen: Date;
  createdAt: Date;
  _count: {
    reportsReceived: number;
  };
}

interface Report {
  id: string;
  reason: string;
  timestamp: Date;
  status: string;
  reporterFingerprint: string | null;
  reportedUser: {
    id: string;
    ipAddress: string | null;
    country: string | null;
    city: string | null;
    banned: boolean;
    reportCount: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    onlineUsers: 0,
    waitingText: 0,
    waitingVideo: 0,
    totalReports: 0,
    pendingReports: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    try {
      const [usersRes, reportsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/reports"),
      ]);

      const usersData = await usersRes.json();
      const reportsData = await reportsRes.json();

      setUsers(usersData);
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to refresh data", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };

    fetchData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          banned: ban,
          banReason: ban ? "Banned by admin" : undefined,
        }),
      });

      // Immediately refresh data
      await refreshData();
    } catch (error) {
      console.error("Failed to ban/unban user", error);
    }
  };

  const handleReportAction = async (reportId: string, status: string, action?: string) => {
    try {
      await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status, action }),
      });

      // Immediately refresh data
      await refreshData();
    } catch (error) {
      console.error("Failed to update report", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-400" />
            Admin Dashboard
          </h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Online Users</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.onlineUsers}</div>
              <p className="text-xs text-slate-500">Active connections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Text Queue</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.waitingText}</div>
              <p className="text-xs text-slate-500">Waiting for chat</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Video Queue</CardTitle>
              <Video className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.waitingVideo}</div>
              <p className="text-xs text-slate-500">Waiting for video</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pending Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingReports}</div>
              <p className="text-xs text-slate-500">Total: {stats.totalReports}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Users and Reports */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              Users Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700">
              Reports Queue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-400">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-700/50">
                          <TableHead className="text-slate-300">IP</TableHead>
                          <TableHead className="text-slate-300">Location</TableHead>
                          <TableHead className="text-slate-300">Reports</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Last Seen</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                            <TableCell className="font-mono text-slate-300 text-sm">
                              {user.ipAddress || "N/A"}
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-500" />
                                {user.city}, {user.country || "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.reportCount > 0 ? "destructive" : "outline"}>
                                {user._count.reportsReceived} reports
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.banned ? (
                                <Badge variant="destructive">Banned</Badge>
                              ) : (
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                                  Active
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(user.lastSeen)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.banned ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-emerald-400 border-emerald-400 hover:bg-emerald-400/10"
                                  onClick={() => handleBanUser(user.id, false)}
                                >
                                  Unban
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBanUser(user.id, true)}
                                >
                                  Ban
                                </Button>
                              )}
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

          <TabsContent value="reports" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Report Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-400">Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-700/50">
                          <TableHead className="text-slate-300">Reported User</TableHead>
                          <TableHead className="text-slate-300">Reason</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Time</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id} className="border-slate-700 hover:bg-slate-700/30">
                            <TableCell className="text-slate-300">
                              <div className="space-y-1">
                                <div className="font-mono text-sm">{report.reportedUser.ipAddress || "N/A"}</div>
                                <div className="text-xs text-slate-500">
                                  {report.reportedUser.city}, {report.reportedUser.country}
                                </div>
                                {report.reportedUser.banned && (
                                  <Badge variant="destructive" className="text-xs">Banned</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300 max-w-xs">
                              {report.reason}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  report.status === "PENDING"
                                    ? "outline"
                                    : report.status === "ACTIONED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">
                              {formatDate(report.timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {report.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleReportAction(report.id, "ACTIONED", "ban")}
                                      disabled={report.reportedUser.banned}
                                    >
                                      Ban User
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReportAction(report.id, "DISMISSED")}
                                    >
                                      Dismiss
                                    </Button>
                                  </>
                                )}
                              </div>
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
      </div>
    </div>
  );
}
