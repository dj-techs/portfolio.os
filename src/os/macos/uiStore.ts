"use client";

import { create } from "zustand";

type MacUI = {
  spotlightOpen: boolean;
  missionOpen: boolean;
  launchpadOpen: boolean;
  notifCenterOpen: boolean;
  restarting: boolean;
  bootingDone: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  openMission: () => void;
  closeMission: () => void;
  openLaunchpad: () => void;
  closeLaunchpad: () => void;
  openNotifCenter: () => void;
  closeNotifCenter: () => void;
  triggerRestart: () => void;
  setBootingDone: (v: boolean) => void;
};

export const useMacUI = create<MacUI>((set) => ({
  spotlightOpen: false,
  missionOpen: false,
  launchpadOpen: false,
  notifCenterOpen: false,
  restarting: false,
  bootingDone: false,
  openSpotlight: () => set({ spotlightOpen: true }),
  closeSpotlight: () => set({ spotlightOpen: false }),
  openMission: () => set({ missionOpen: true }),
  closeMission: () => set({ missionOpen: false }),
  openLaunchpad: () => set({ launchpadOpen: true }),
  closeLaunchpad: () => set({ launchpadOpen: false }),
  openNotifCenter: () => set({ notifCenterOpen: true }),
  closeNotifCenter: () => set({ notifCenterOpen: false }),
  triggerRestart: () => set({ restarting: true }),
  setBootingDone: (v) => set({ bootingDone: v }),
}));
