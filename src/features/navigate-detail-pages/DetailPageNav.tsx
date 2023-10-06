import { Button } from "@/src/components/ui/button";
import { CommandShortcut } from "@/src/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useDetailPageLists } from "@/src/features/navigate-detail-pages/context";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const DetailPageNav = (props: {
  currentId: string;
  path: (id: string) => string;
  listKey: string;
}) => {
  const { detailPagelists } = useDetailPageLists();
  const ids = detailPagelists[props.listKey] ?? [];

  const router = useRouter();
  const currentIndex = ids.findIndex((id) => id === props.currentId);
  const previousPageId = currentIndex > 0 ? ids[currentIndex - 1] : undefined;
  const nextPageId =
    currentIndex < ids.length - 1 ? ids[currentIndex + 1] : undefined;

  // keyboard shortcuts for buttons k and j
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && previousPageId) {
        void router.push(props.path(previousPageId));
      } else if (event.key === "j" && nextPageId) {
        void router.push(props.path(nextPageId));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previousPageId, nextPageId, router, props]);

  if (ids.length > 0)
    return (
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!previousPageId}
                onClick={() => {
                  if (previousPageId)
                    void router.push(props.path(previousPageId));
                }}
                className="mr-2"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Navigate up</span>
              <CommandShortcut className="ml-2 rounded-sm bg-gray-100 p-1 px-2">
                k
              </CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!nextPageId}
                onClick={() => {
                  if (nextPageId) void router.push(props.path(nextPageId));
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Navigate down</span>
              <CommandShortcut className="ml-2 rounded-sm bg-gray-100 p-1 px-2">
                j
              </CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  else return null;
};