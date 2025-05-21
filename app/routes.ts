import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("aichat", "page/aichat.tsx"),
  route("planner", "page/planner.tsx"),
  route("groupchat", "page/groupchat.tsx"),
  route("login", "auth/login.tsx"),
  route("register","auth/register.tsx"),
  route("about", "page/about.tsx" )
] satisfies RouteConfig;
