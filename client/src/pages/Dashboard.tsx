"use client";

import type React from "react";
import { useEffect, useState } from "react";
import StatusBar from "@/components/StatusBar";
import Speedometer from "@/components/Speedometer";
import GearIndicator from "@/components/GearIndicator";
import BatteryIndicator from "@/components/BatteryIndicator";
import WarningPanel from "@/components/WarningPanel";
import QuickActions from "@/components/QuickActions";
import { useDashboard } from "@/lib/dashboardContext";
import { Responsive, WidthProvider } from "react-grid-layout";
import TripDistanceWidget from "@/components/DistanceTraveled";
import { Button } from "@/components/ui/button";
import { Save, Grid, Lock, RotateCcw } from "lucide-react";
import { Capacitor } from "@capacitor/core";

import { useIsAndroidApp } from "@/lib/useIsAndroidApp";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

type DashboardComponent = {
  id: string;
  name: string;
  component:
    | React.ReactNode
    | ((width: number, height: number) => React.ReactNode);
  defaultLayout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
  className?: string;
};
const Dashboard: React.FC = () => {
  const {
    motorcycleData,
    userSettings,
    isDarkMode,
    loading,
    error,
    saveDashboardLayout,
  } = useDashboard();

  const [isEditMode, setIsEditMode] = useState(false);
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    return savedLayouts ? JSON.parse(savedLayouts) : null;
  });

  const [isNativeApp, setIsNativeApp] = useState(false);
  const isAndroidApp = useIsAndroidApp();

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setIsNativeApp(platform === "android" || platform === "ios");
  }, []);

  const dashboardComponents: DashboardComponent[] = [
    {
      id: "status",
      name: "Status Bar",
      component: <StatusBar />,
      defaultLayout: { x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1 },
    },
    {
      id: "battery",
      name: "Battery",
      component: <BatteryIndicator />,
      defaultLayout: { x: 0, y: 1, w: 12, h: 2, minW: 3, minH: 2 },
    },
    {
      id: "speedometer",
      name: "Speed",
      component: (width, height) => (
        <Speedometer
          maxSpeed={200}
          type="speed"
          size={Math.min(width, height) * 24}
        />
      ),
      defaultLayout: { x: 0, y: 3, w: 3, h: 5, minW: 1, minH: 1 },
      className: "flex items-center justify-center",
    },
    {
      id: "gear",
      name: "Gear",
      component: <GearIndicator />,
      defaultLayout: { x: 3, y: 3, w: 2, h: 3, minW: 1, minH: 1 },
      className: "flex items-center justify-center",
    },
    {
      id: "tripDistance",
      name: "Distância",
      component: <TripDistanceWidget />,
      defaultLayout: { x: 3, y: 6, w: 2, h: 2, minW: 4, minH: 2 },
    },
    {
      id: "rpm",
      name: "RPM",
      component: (width, height) => (
        <Speedometer
          maxSpeed={200}
          type="rpm"
          size={Math.min(width, height) * 24}
        />
      ),
      defaultLayout: { x: 5, y: 3, w: 3, h: 5, minW: 1, minH: 1 },
      className: "flex items-center justify-center",
    },
    {
      id: "warnings",
      name: "Warnings",
      component: <WarningPanel />,
      defaultLayout: { x: 0, y: 8, w: 12, h: 2, minW: 6, minH: 2 },
    },
  ];

  const generateDefaultLayout = () => {
    return {
      lg: dashboardComponents.map((item) => ({
        i: item.id,
        ...item.defaultLayout,
        static: !isEditMode,
      })),
      md: dashboardComponents.map((item) => ({
        i: item.id,
        ...item.defaultLayout,
        static: !isEditMode,
      })),
      sm: dashboardComponents.map((item) => ({
        i: item.id,
        ...item.defaultLayout,
        static: !isEditMode,
      })),
    };
  };

  const currentLayouts = layouts || generateDefaultLayout();

  const getLayoutsWithStaticProp = () => {
    const updatedLayouts = { ...currentLayouts };
    Object.keys(updatedLayouts).forEach((breakpoint) => {
      updatedLayouts[breakpoint] = updatedLayouts[breakpoint].map((item) => ({
        ...item,
        static: !isEditMode,
        isDraggable: isEditMode,
      }));
    });
    return updatedLayouts;
  };

  const handleLayoutChange = (_: any, allLayouts: any) => {
    if (isEditMode) {
      setLayouts(allLayouts);
      localStorage.setItem("dashboardLayouts", JSON.stringify(allLayouts));
    }
  };

  const saveLayout = async () => {
    try {
      localStorage.setItem("dashboardLayouts", JSON.stringify(layouts));
      if (saveDashboardLayout) await saveDashboardLayout(layouts);
      setIsEditMode(false);
    } catch (err) {
      console.error("Error saving layout:", err);
      localStorage.setItem("dashboardLayouts", JSON.stringify(layouts));
      setIsEditMode(false);
    }
  };

  const resetLayout = () => {
    localStorage.removeItem("dashboardLayouts");
    setLayouts(null);
    setIsEditMode(false);
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@500;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontLink);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .react-grid-item.react-draggable-dragging {
        z-index: 100; 
        opacity: 0.8; 
        transition: none !important;
      }
      .edit-component {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
      }
      .drag-handle {
        cursor: move;
      }
      .speedometer {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        height: 100% !important;
        max-width: 220px !important;
        margin: 0 auto !important;
      }
      .battery-indicator {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 100%;
      }

      .progress-bar {
        transition: height 0.3s ease;
      }
      .speedometer canvas {
        max-width: 220px !important;
        max-height: 220px !important;
        width: auto !important;
        height: auto !important;
      }
      .react-grid-layout {
        background-color: #111827;
      }
      .dashboard-item {
        border: 1px solid rgba(75, 85, 99, 0.5);
        background-color: #1f2937 !important;
        border-radius: 0.375rem;
        overflow: hidden;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      .dashboard-item > div {
        background-color: #171d2a !important;
      }
      .dashboard-item-content {
        background-color: #171d2a !important;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
      }
      
      /* Optimized for 1280x800 Android tablet */
      @media (min-width: 1200px) and (max-width: 1300px) {
        .speedometer {
          max-width: 200px !important;
        }
        .speedometer canvas {
          max-width: 200px !important;
          max-height: 200px !important;
        }
      }
      
      /* Ensure proper sizing on tablet landscape */
      @media (orientation: landscape) and (min-width: 1200px) {
        .speedometer {
          max-width: 220px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-primary">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div
      id="dashboard"
      className="font-sans bg-gray-900 text-white min-h-screen touch-manipulation"
    >
      <div className="max-w-full mx-auto h-full p-2">
        <div
          className={`h-[calc(100vh-80px)] ${
            isEditMode ? "edit-mode" : ""
          } bg-gray-900`}
        >
          <ResponsiveGridLayout
            className="layout"
            layouts={getLayoutsWithStaticProp()}
            breakpoints={{ lg: 1280, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            margin={[8, 8]}
            containerPadding={[4, 4]}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            compactType={null}
            preventCollision={true}
            useCSSTransforms={true}
            draggableHandle=".drag-handle"
          >
            {dashboardComponents.map((item) => {
              // Get the current layout for this item
              const currentLayout =
                currentLayouts.lg.find((layout: any) => layout.i === item.id) ||
                item.defaultLayout;
              const width = currentLayout.w * (24 / 12); // Adjust based on your grid cols
              const height = currentLayout.h * 35; // rowHeight is 35

              return (
                <div
                  key={item.id}
                  className={`dashboard-item ${
                    isEditMode ? "edit-component border-2 border-blue-500" : ""
                  }`}
                >
                  {isEditMode && (
                    <div className="bg-blue-500 text-white text-xs p-1 drag-handle flex items-center justify-between cursor-move">
                      <div>
                        <span className="material-icons text-sm mr-1">
                          drag_indicator
                        </span>
                        {item.name}
                      </div>
                      <div className="text-xs opacity-75">Drag to move</div>
                    </div>
                  )}
                  <div
                    className={`dashboard-item-content ${item.className || ""}`}
                  >
                    {typeof item.component === "function"
                      ? item.component(width, height)
                      : item.component}
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
