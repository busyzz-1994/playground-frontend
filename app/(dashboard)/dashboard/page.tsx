import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Users, Activity, TrendingUp } from "lucide-react"
import { UsersTable } from "@/components/dashboard/users-table"

const stats = [
  {
    label: "总用户数",
    value: "1,234",
    description: "较上月 +12%",
    icon: Users,
  },
  {
    label: "活跃会话",
    value: "56",
    description: "当前在线",
    icon: Activity,
  },
  {
    label: "本月增长",
    value: "89",
    description: "新注册用户",
    icon: TrendingUp,
  },
  {
    label: "总页面访问",
    value: "23,456",
    description: "过去 30 天",
    icon: LayoutDashboard,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">欢迎回来，这里是你的数据概览。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <CardDescription className="text-xs">{stat.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <UsersTable />
    </div>
  )
}
