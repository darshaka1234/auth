"use client";

import { Card } from "@/components/ui/card";
import { Activity, Users, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-2xl font-semibold">42</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold">$12,345</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth</p>
              <p className="text-2xl font-semibold">+23%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Activity {item}</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            Add User
          </button>
          <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
            Generate Report
          </button>
          <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
            View Analytics
          </button>
          <button className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
            Settings
          </button>
        </div>
      </Card>
    </div>
  );
}
