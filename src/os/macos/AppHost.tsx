"use client";

import { useWindowsStore, type AppId } from "@/store/windows";
import { Window } from "@/shared/Window";
import Finder from "./apps/Finder";
import Preview from "./apps/Preview";
import AboutMe from "./apps/AboutMe";
import Skills from "./apps/Skills";
import Experience from "./apps/Experience";
import Messages from "./apps/Messages";
import Settings from "./apps/Settings";

// Each app ignores unknown props, so accept an opaque record here.
type AppComponent = React.ComponentType<Record<string, unknown>>;

const registry: Record<AppId, AppComponent> = {
  finder: Finder as AppComponent,
  preview: Preview as AppComponent,
  aboutme: AboutMe as AppComponent,
  skills: Skills as AppComponent,
  experience: Experience as AppComponent,
  messages: Messages as AppComponent,
  settings: Settings as AppComponent,
  safari: (() => null) as AppComponent,
};

export default function AppHost() {
  const windows = useWindowsStore((s) => s.windows);

  return (
    <>
      {windows.map((w) => {
        const Cmp = registry[w.app];
        return (
          <Window key={w.id} win={w} variant="macos">
            <Cmp {...(w.props ?? {})} />
          </Window>
        );
      })}
    </>
  );
}
