import Home from "../views/home";
import Info from "../views/info";
import Dashboard from "../views/dashboard";
import { useRoutes,Navigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const router_item:Array<object> = [
  {
    path: "/",
    label: "Home",
    key: "home",
    component: Home,
    meta: { hidden: true },
  },
  
    // {
    //     path: "/",
    //     key: "/",
    //     label: "Home",
    //     hidden: true,
    //     element: <Navigate to="/layout/home" />,
    // },
    // {
    //   path: "/layout",
    //   key: "layout",
    //   label: "Layout",
    //   element: <div />,
    //   meta: { hidden: true },
    //   children: [
    //     {
    //         path: "home",
    //         label: "Home",
    //         key: "home",
    //         component: Home,
    //         meta: { hidden: true },
    //       },
        
    //       {
    //         path: "info",
    //         label: "Info",
    //         key: "info",
    //         component: Info,
    //         meta: { hidden: true },
    //       },
        
    //       {
    //         path: "dashboard",
    //         label: "Dashboard",
    //         key: "dashboard",
    //         component: Dashboard,
    //         redirect: "/dashboard",
    //         // children: [
    //         //   {
    //         //     path: "dashboard",
    //         //     component: ,
    //         //     name: "Dashboard",  
    //         //     meta: {
    //         //       title: "dashboard",
    //         //       icon: "homepage",
    //         //       affix: true,
    //         //       keepAlive: true,
    //         //       alwaysShow: false,
    //         //     },
    //         //   },
    //         //   {
    //         //     path: "401",
    //         //     component: () => import("@/views/error-page/401.vue"),
    //         //     meta: { hidden: true },
    //         //   },
    //         //   {
    //         //     path: "404",
    //         //     component: () => import("@/views/error-page/404.vue"),
    //         //     meta: { hidden: true },
    //         //   },
    //         // ],
    //       },
    //   ]
    // },
  
   
  
    // {
    //   path: "/external-link",
    //   component: Layout,
    //   children: [ {
    //       component: () => import("@/views/external-link/index.vue"),
    //       path: "https://www.cnblogs.com/haoxianrui/",
    //       meta: { title: "  ", icon: "link" },
    //     },
    //   ],
    // },
    
  ];


export const GetRouters = ()=>{
    const routes = useRoutes(router_item);
      return routes;
}
