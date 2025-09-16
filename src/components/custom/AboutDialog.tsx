"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleQuestionMark, Youtube, Github, Code, Database, X } from "lucide-react";

// Hook to persist "first visit" state in sessionStorage
function useSessionFlag(key: string, defaultValue: boolean) {
  const [flag, setFlag] = React.useState(() => {
    if (typeof window === "undefined") return defaultValue;
    return sessionStorage.getItem(key) === "true" ? true : defaultValue;
  });

  React.useEffect(() => {
    sessionStorage.setItem(key, flag ? "true" : "false");
  }, [key, flag]);

  return [flag, setFlag] as const;
}

type AboutDialogProps = {
  autoOpen?: boolean; // opens immediately if true
};

export const AboutDialog: React.FC<AboutDialogProps> = ({ autoOpen = false }) => {
  const [open, setOpen] = useSessionFlag("aboutDialogSeen", autoOpen);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Info icon trigger */}
      <AlertDialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <CircleQuestionMark className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="sm:max-w-md w-full mx-auto rounded-lg p-6 bg-white dark:bg-gray-900 relative 
                   left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed"
      >
        {/* X close button */}
        <AlertDialogCancel asChild>
          <button className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
          It's like Google Maps...
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-3">
            <p>
              But for navigating complex human perspectives. Human cartography, maybe.
            </p>

            <p>
              The idea is to explore discussions with fellow citizens. Every dot on the map is a participant who reacted to crowdsourced statements—agree, disagree, or pass—anywhere from 7 to hundreds of times.
            </p>

            <p>
              This demo uses{" "}
              <a
                href="https://pol.is/3hfmicmybc"
                target="_blank"
                className="text-sky-600 underline"
              >
                a 3,000-person Polis conversation
              </a>{" "}
              conducted informally by a local during the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Social_Outburst_(Chile)"
                target="_blank"
                className="text-sky-600 underline"
              >
                2019 #ChileDesperto protests
              </a>
              .
            </p>

            <p>
              Watch a walkthrough video, play around (zoom, paint, click groups), join the{" "}
              <a
                href="http://polislike.short.gy/discord"
                target="_blank"
                className="text-sky-600 underline"
              >
                Discord
              </a>
              , follow weekly notes{" "}
              <a
                href="https://polislike.short.gy/notes"
                target="_blank"
                className="text-sky-600 underline"
              >
                here
              </a>
              , or attend live sessions{" "}
              <a
                href="https://lu.ma/polislike"
                target="_blank"
                className="text-sky-600 underline"
              >
                here
              </a>
              .
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-5 flex flex-col space-y-3">
          <a
            href="https://youtube.com/shorts/cd0Qtzg-0ik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 gap-2"
          >
            <Youtube className="w-5 h-5" />
            Watch Demo
          </a>

          <AlertDialogCancel asChild>
            <button className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              Dismiss
            </button>
          </AlertDialogCancel>
        </div>

        {/* --- Compact GitHub links below buttons --- */}
        <div className="mt-4">
          <p className="font-semibold mb-2 text-sm">GitHub Repos:</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <a
              href="https://github.com/patcon/polislike-opinion-map-painting"
              target="_blank"
              className="flex flex-col items-center gap-1 hover:text-sky-700"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">ugly v1</span>
            </a>
            <a
              href="https://github.com/patcon/polislike-human-cartography-prototype-v2"
              target="_blank"
              className="flex flex-col items-center gap-1 hover:text-sky-700"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">current v2</span>
            </a>
            <a
              href="https://github.com/polis-community/red-dwarf"
              target="_blank"
              className="flex flex-col items-center gap-1 hover:text-sky-700"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">algorithms</span>
            </a>
            <a
              href="https://github.com/patcon/kedro-polislike-pipelines"
              target="_blank"
              className="flex flex-col items-center gap-1 hover:text-sky-700"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">pipelines</span>
            </a>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
